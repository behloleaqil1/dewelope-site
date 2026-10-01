import React, {createContext, useCallback, useContext, useEffect, useMemo, useState} from "react";

// localStorage key holding Baneen's working copy of the site content.
const STORAGE_KEY = "dewelope:content:v1";

const ContentContext = createContext(null);

// Deep clone helper (content is plain JSON — safe to structuredClone/JSON).
const clone = (o) => (typeof structuredClone === "function" ? structuredClone(o) : JSON.parse(JSON.stringify(o)));

function readLocal() {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        return raw ? JSON.parse(raw) : null;
    } catch {
        return null;
    }
}

function writeLocal(content) {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(content));
        return true;
    } catch {
        return false;
    }
}

export function ContentProvider({children}) {
    const [seed, setSeed] = useState(null);      // pristine content.json from the server
    const [content, setContent] = useState(null); // active content (local overlay or seed)
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [dirty, setDirty] = useState(false);     // local edits differ from seed

    // Load the seed content.json once, then overlay any local edits.
    useEffect(() => {
        let cancelled = false;
        (async () => {
            try {
                const base = import.meta.env.BASE_URL || "/";
                const res = await fetch(`${base}content.json`, {cache: "no-cache"});
                if (!res.ok) throw new Error(`content.json ${res.status}`);
                const data = await res.json();
                if (cancelled) return;
                setSeed(data);
                const local = readLocal();
                if (local && local.version === data.version) {
                    setContent(local);
                    setDirty(true);
                } else {
                    // Seed changed (new deploy) — discard stale local overlay.
                    if (local) localStorage.removeItem(STORAGE_KEY);
                    setContent(data);
                    setDirty(false);
                }
            } catch (e) {
                if (!cancelled) setError(e);
            } finally {
                if (!cancelled) setLoading(false);
            }
        })();
        return () => {
            cancelled = true;
        };
    }, []);

    // Replace the entire content object (used by section editors + import).
    const setAll = useCallback((next) => {
        const stamped = {...next, updatedAt: new Date().toISOString()};
        setContent(stamped);
        writeLocal(stamped);
        setDirty(true);
    }, []);

    // Update a single top-level section immutably.
    const updateSection = useCallback((key, value) => {
        setContent((prev) => {
            const next = {...prev, [key]: value, updatedAt: new Date().toISOString()};
            writeLocal(next);
            return next;
        });
        setDirty(true);
    }, []);

    // Discard local edits, revert to the deployed seed.
    const reset = useCallback(() => {
        if (!seed) return;
        localStorage.removeItem(STORAGE_KEY);
        setContent(clone(seed));
        setDirty(false);
    }, [seed]);

    // Export the current content as a downloadable content.json.
    const exportJson = useCallback(() => {
        const data = JSON.stringify(content, null, 2) + "\n";
        const blob = new Blob([data], {type: "application/json"});
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "content.json";
        document.body.appendChild(a);
        a.click();
        a.remove();
        URL.revokeObjectURL(url);
    }, [content]);

    // Import a content.json (from file) — validates shape minimally.
    const importJson = useCallback((parsed) => {
        if (!parsed || typeof parsed !== "object" || !parsed.profile) {
            throw new Error("Not a valid content.json (missing 'profile').");
        }
        setAll(parsed);
    }, [setAll]);

    const value = useMemo(
        () => ({
            content, seed, loading, error, dirty,
            setAll, updateSection, reset, exportJson, importJson,
        }),
        [content, seed, loading, error, dirty, setAll, updateSection, reset, exportJson, importJson]
    );

    return <ContentContext.Provider value={value}>{children}</ContentContext.Provider>;
}

// Hook for dashboard (full API).
export function useContentStore() {
    const ctx = useContext(ContentContext);
    if (!ctx) throw new Error("useContentStore must be used within ContentProvider");
    return ctx;
}

// Hook for public components: returns the active content, or null while loading.
export function useContent() {
    const ctx = useContext(ContentContext);
    return ctx ? ctx.content : null;
}
