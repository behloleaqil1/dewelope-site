/**
 * DeWelope content-publish Worker
 * ---------------------------------
 * A tiny serverless endpoint that lets the admin dashboard publish an updated
 * content.json to the GitHub repo WITHOUT ever putting a repo token in the
 * browser. The GitHub token lives only in this Worker's secret store.
 *
 * Flow:
 *   dashboard  --POST /publish (Bearer <PUBLISH_TOKEN>)-->  this Worker
 *   this Worker --PUT /repos/.../contents/... (GitHub PAT)--> GitHub
 *   commit triggers the Pages deploy workflow -> site rebuilds automatically.
 *
 * Secrets (set via `wrangler secret put`, NEVER hard-coded):
 *   GITHUB_TOKEN   fine-grained PAT, scoped to behloleaqil1/dewelope-site,
 *                  Contents: Read and write.
 *   PUBLISH_TOKEN  a shared secret the dashboard sends as a Bearer token so
 *                  only authenticated dashboard users can trigger a publish.
 *
 * Vars (set in wrangler.toml [vars] — these are NOT secret):
 *   REPO_OWNER, REPO_NAME, REPO_BRANCH, CONTENT_PATH, ALLOWED_ORIGIN
 */

export default {
  async fetch(request, env) {
    const cors = {
      "Access-Control-Allow-Origin": env.ALLOWED_ORIGIN || "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
      "Access-Control-Max-Age": "86400",
    };

    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: cors });
    }

    const url = new URL(request.url);
    if (request.method !== "POST" || url.pathname !== "/publish") {
      return json({ error: "Not found" }, 404, cors);
    }

    // Authenticate the caller against the shared publish token.
    const auth = request.headers.get("Authorization") || "";
    const token = auth.replace(/^Bearer\s+/i, "");
    if (!env.PUBLISH_TOKEN || token !== env.PUBLISH_TOKEN) {
      return json({ error: "Unauthorized" }, 401, cors);
    }

    let body;
    try {
      body = await request.json();
    } catch {
      return json({ error: "Invalid JSON body" }, 400, cors);
    }

    const { content, message } = body || {};
    if (!content || typeof content !== "object") {
      return json({ error: "Missing 'content' object" }, 400, cors);
    }

    const owner = env.REPO_OWNER;
    const repo = env.REPO_NAME;
    const branch = env.REPO_BRANCH || "main";
    const path = env.CONTENT_PATH || "public/content.json";
    const api = `https://api.github.com/repos/${owner}/${repo}/contents/${path}`;
    const ghHeaders = {
      Authorization: `Bearer ${env.GITHUB_TOKEN}`,
      Accept: "application/vnd.github+json",
      "User-Agent": "dewelope-publish-worker",
      "X-GitHub-Api-Version": "2022-11-28",
    };

    // Fetch current file SHA (required by GitHub to update an existing file).
    let sha;
    try {
      const cur = await fetch(`${api}?ref=${branch}`, { headers: ghHeaders });
      if (cur.status === 200) {
        sha = (await cur.json()).sha;
      } else if (cur.status !== 404) {
        const t = await cur.text();
        return json({ error: `GitHub read failed (${cur.status})`, detail: t }, 502, cors);
      }
    } catch (e) {
      return json({ error: "GitHub read error", detail: String(e) }, 502, cors);
    }

    // Base64-encode the pretty-printed JSON (UTF-8 safe).
    const text = JSON.stringify(content, null, 2) + "\n";
    const b64 = base64FromUtf8(text);

    const put = await fetch(api, {
      method: "PUT",
      headers: ghHeaders,
      body: JSON.stringify({
        message: message || "chore(content): publish via admin dashboard",
        content: b64,
        branch,
        ...(sha ? { sha } : {}),
      }),
    });

    if (!put.ok) {
      const t = await put.text();
      return json({ error: `GitHub write failed (${put.status})`, detail: t }, 502, cors);
    }

    const result = await put.json();
    return json(
      { ok: true, commit: result.commit?.sha, url: result.content?.html_url },
      200,
      cors
    );
  },
};

function json(obj, status, cors) {
  return new Response(JSON.stringify(obj), {
    status,
    headers: { "Content-Type": "application/json", ...cors },
  });
}

function base64FromUtf8(str) {
  const bytes = new TextEncoder().encode(str);
  let bin = "";
  for (const b of bytes) bin += String.fromCharCode(b);
  return btoa(bin);
}
