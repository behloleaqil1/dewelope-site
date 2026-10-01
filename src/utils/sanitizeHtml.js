// Minimal, dependency-free HTML sanitizer for blog body content produced by
// the admin WYSIWYG. Removes script/style/iframe/object, inline event handlers,
// and javascript: URLs. Allows data:image/* (used by uploaded inline images).
//
// Note: the blog author is a trusted, authenticated editor, so this is
// defense-in-depth rather than a hostile-input boundary.
export function sanitizeHtml(html) {
    if (!html || typeof html !== "string") return "";
    if (typeof document === "undefined") return html; // prerender: trusted author content

    const tpl = document.createElement("template");
    tpl.innerHTML = html;

    const BAD_TAGS = new Set(["SCRIPT", "STYLE", "IFRAME", "OBJECT", "EMBED", "LINK", "META", "FORM", "INPUT", "BUTTON"]);

    const walk = (node) => {
        const children = Array.from(node.childNodes);
        for (const child of children) {
            if (child.nodeType !== 1) continue; // keep text nodes
            if (BAD_TAGS.has(child.tagName)) {
                child.remove();
                continue;
            }
            // Strip event handlers and dangerous URLs.
            for (const attr of Array.from(child.attributes)) {
                const name = attr.name.toLowerCase();
                const val = (attr.value || "").trim();
                if (name.startsWith("on")) {
                    child.removeAttribute(attr.name);
                } else if ((name === "href" || name === "src") && /^javascript:/i.test(val)) {
                    child.removeAttribute(attr.name);
                } else if (name === "style") {
                    child.removeAttribute(attr.name); // drop inline styles entirely
                }
            }
            // Make external links safe.
            if (child.tagName === "A" && child.getAttribute("href")) {
                child.setAttribute("rel", "noopener noreferrer");
                child.setAttribute("target", "_blank");
            }
            walk(child);
        }
    };

    walk(tpl.content);
    return tpl.innerHTML;
}
