// Postbuild static pre-render: loads the built SPA in headless Chrome, scrolls
// to trigger lazy-loaded sections, and writes the fully-rendered HTML back to
// dist/index.html so crawlers (Googlebot / AdSense) see real content without
// executing JS. The live app uses createRoot (not hydration), so it cleanly
// re-renders over this snapshot on load — no hydration-mismatch risk.
//
// Non-fatal by design: any failure logs a warning and exits 0, leaving the
// normal SPA index.html in place so a prerender hiccup can never block a deploy.
import http from "node:http";
import {readFile, writeFile, mkdir} from "node:fs/promises";
import {existsSync, statSync} from "node:fs";
import path from "node:path";
import {fileURLToPath} from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DIST = path.resolve(__dirname, "..", "dist");
const ROUTES = ["/", "/mvp"];
const PORT = 5055;

const MIME = {
    ".html": "text/html", ".js": "text/javascript", ".mjs": "text/javascript",
    ".css": "text/css", ".json": "application/json", ".svg": "image/svg+xml",
    ".png": "image/png", ".jpg": "image/jpeg", ".jpeg": "image/jpeg",
    ".gif": "image/gif", ".webp": "image/webp", ".ico": "image/x-icon",
    ".woff": "font/woff", ".woff2": "font/woff2", ".ttf": "font/ttf",
    ".bin": "application/octet-stream", ".gltf": "model/gltf+json",
    ".txt": "text/plain", ".xml": "application/xml", ".map": "application/json",
};

function startServer() {
    const server = http.createServer(async (req, res) => {
        try {
            const urlPath = decodeURIComponent(req.url.split("?")[0]);
            let filePath = path.join(DIST, urlPath);
            if (urlPath.endsWith("/")) filePath = path.join(filePath, "index.html");
            if (!existsSync(filePath) || statSync(filePath).isDirectory()) {
                filePath = path.join(DIST, "index.html"); // SPA fallback
            }
            const data = await readFile(filePath);
            res.writeHead(200, {"Content-Type": MIME[path.extname(filePath)] || "application/octet-stream"});
            res.end(data);
        } catch {
            res.writeHead(404);
            res.end("not found");
        }
    });
    return new Promise((resolve) => server.listen(PORT, () => resolve(server)));
}

async function autoScroll(page) {
    await page.evaluate(async () => {
        await new Promise((resolve) => {
            let total = 0;
            const step = 500;
            const timer = setInterval(() => {
                window.scrollBy(0, step);
                total += step;
                if (total >= document.body.scrollHeight + 3000) {
                    clearInterval(timer);
                    resolve();
                }
            }, 120);
        });
        window.scrollTo(0, 0);
    });
}

async function main() {
    let puppeteer;
    try {
        puppeteer = (await import("puppeteer")).default;
    } catch {
        console.warn("[prerender] puppeteer not installed — skipping (SPA index.html kept).");
        return;
    }

    const server = await startServer();
    let browser;
    try {
        browser = await puppeteer.launch({
            headless: "new",
            args: ["--no-sandbox", "--disable-setuid-sandbox", "--disable-dev-shm-usage"],
        });

        for (const route of ROUTES) {
            const page = await browser.newPage();
            // Set the flag before any app script runs so 3D canvases are skipped.
            await page.evaluateOnNewDocument(() => {
                window.__PRERENDER__ = true;
            });
            await page.setViewport({width: 1366, height: 900});
            page.on("pageerror", (e) => console.warn("[prerender] pageerror:", e.message));

            await page.goto(`http://localhost:${PORT}${route}`, {
                waitUntil: "networkidle0",
                timeout: 60000,
            });
            await autoScroll(page);
            // Let lazy chunks resolve and in-view animations settle to final state.
            await new Promise((r) => setTimeout(r, 3000));

            const html = await page.content();
            const outPath = route === "/"
                ? path.join(DIST, "index.html")
                : path.join(DIST, route, "index.html");

            // Sanity check: only overwrite if the snapshot has substantial content.
            const textLen = html.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim().length;
            if (textLen < 800) {
                console.warn(`[prerender] ${route}: snapshot too thin (${textLen} chars) — keeping original.`);
            } else {
                await mkdir(path.dirname(outPath), {recursive: true});
                await writeFile(outPath, html, "utf8");
                console.log(`[prerender] wrote ${outPath} — ${html.length} bytes, ~${textLen} chars of text`);
            }
            await page.close();
        }
    } finally {
        if (browser) await browser.close();
        server.close();
    }
}

main().catch((e) => {
    console.warn("[prerender] failed (non-fatal, keeping SPA index.html):", e?.message || e);
    process.exit(0);
});
