# DeWelope Publish Worker — Deploy Guide

This Cloudflare Worker lets the admin dashboard publish content changes to the
GitHub repo **without putting any repo token in the browser**. The GitHub token
lives only in the Worker's secret store.

## Prerequisites

1. **Roll your Cloudflare API key.** If you pasted a Cloudflare key anywhere
   (chat, email, etc.), treat it as compromised and roll it:
   Cloudflare dashboard → My Profile → API Tokens → roll/recreate.
2. Install Wrangler and authenticate with your own credentials:
   ```bash
   npm install -g wrangler
   wrangler login            # opens browser, uses YOUR account — no key in code
   ```
3. Create a **GitHub fine-grained Personal Access Token**:
   - github.com → Settings → Developer settings → Fine-grained tokens → Generate
   - Repository access: **Only select repositories → `behloleaqil1/dewelope-site`**
   - Permissions: **Contents → Read and write** (nothing else)
   - Copy the token (starts with `github_pat_...`).
4. Invent a **publish token** — any long random string. The dashboard will send
   this so only your dashboard can call the Worker. Generate one:
   ```bash
   openssl rand -hex 32
   ```

## Deploy

```bash
cd worker

# Set the two secrets (prompts for the value; nothing is written to disk):
wrangler secret put GITHUB_TOKEN     # paste the github_pat_... token
wrangler secret put PUBLISH_TOKEN    # paste the openssl rand string

# Deploy:
wrangler deploy
```

Wrangler prints the Worker URL, e.g.
`https://dewelope-publish.<your-subdomain>.workers.dev`.

## Wire it into the dashboard

In the dashboard → **Settings → Publishing**, paste:
- **Worker URL**: the `https://...workers.dev` URL from deploy
- **Publish token**: the same `PUBLISH_TOKEN` string you set above

These are stored in the browser's localStorage for the logged-in user. The
publish token is a low-privilege shared secret (it only lets the holder call
*your* Worker, which only commits `content.json`) — not the GitHub token.

## How publishing works

1. Baneen edits content, clicks **Publish**.
2. Dashboard POSTs the full content JSON to `POST <worker>/publish` with
   `Authorization: Bearer <PUBLISH_TOKEN>`.
3. Worker commits `public/content.json` to `main` using the GitHub token.
4. The commit triggers `.github/workflows/deploy.yml` → the site rebuilds and
   republishes automatically (~1–2 minutes).

## Security notes

- The GitHub token never leaves the Worker. The browser only ever holds the
  low-privilege publish token.
- `ALLOWED_ORIGIN` in `wrangler.toml` restricts which site can call the Worker.
  Keep it set to `https://dewelope.com` in production.
- The fine-grained GitHub token is scoped to a single repo's contents, so the
  worst case is a bad commit you can revert — not account-wide access.
- To revoke access instantly: delete the GitHub token, or run
  `wrangler secret delete PUBLISH_TOKEN`.
