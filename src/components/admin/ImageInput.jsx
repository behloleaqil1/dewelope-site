import React, {useRef, useState} from "react";
import {FiUploadCloud, FiLink, FiX, FiImage} from "react-icons/fi";
import {Field} from "./fields.jsx";

// Downscale + compress an image File to a WebP data URL via canvas, so uploads
// stay small enough to live inside content.json (no server/storage needed).
async function fileToCompressedDataURL(file, {maxDim = 1600, quality = 0.8} = {}) {
    const dataUrl = await new Promise((resolve, reject) => {
        const r = new FileReader();
        r.onload = () => resolve(r.result);
        r.onerror = reject;
        r.readAsDataURL(file);
    });

    // SVGs can't be rasterized reliably at arbitrary sizes — keep as-is.
    if (file.type === "image/svg+xml") return dataUrl;

    const img = await new Promise((resolve, reject) => {
        const i = new Image();
        i.onload = () => resolve(i);
        i.onerror = reject;
        i.src = dataUrl;
    });

    let {width, height} = img;
    if (width > maxDim || height > maxDim) {
        const scale = Math.min(maxDim / width, maxDim / height);
        width = Math.round(width * scale);
        height = Math.round(height * scale);
    }

    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(img, 0, 0, width, height);

    // Prefer WebP; fall back to JPEG if the browser can't encode WebP.
    let out = canvas.toDataURL("image/webp", quality);
    if (!out.startsWith("data:image/webp")) {
        out = canvas.toDataURL("image/jpeg", quality);
    }
    return out;
}

function sizeOf(dataUrlOrUrl) {
    if (!dataUrlOrUrl || !dataUrlOrUrl.startsWith("data:")) return null;
    // Approx decoded byte size of the base64 payload.
    const b64 = dataUrlOrUrl.split(",")[1] || "";
    return Math.round((b64.length * 3) / 4);
}

export function ImageInput({label, hint, value, onChange, maxDim = 1600, quality = 0.8}) {
    const fileRef = useRef(null);
    const [busy, setBusy] = useState(false);
    const [showUrl, setShowUrl] = useState(false);
    const [err, setErr] = useState("");

    const pick = () => fileRef.current?.click();

    const onFile = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setErr("");
        setBusy(true);
        try {
            const url = await fileToCompressedDataURL(file, {maxDim, quality});
            onChange(url);
        } catch (ex) {
            setErr(`Couldn't process image: ${ex?.message || ex}`);
        } finally {
            setBusy(false);
            e.target.value = "";
        }
    };

    const bytes = sizeOf(value);
    const big = bytes && bytes > 400 * 1024;

    return (
        <Field label={label} hint={hint}>
            <div className="rounded-lg border border-border bg-surface-2 p-3">
                <div className="flex items-start gap-3">
                    <div className="w-24 h-16 shrink-0 rounded-md overflow-hidden bg-surface-3 border border-border flex items-center justify-center">
                        {value
                            ? <img src={value} alt="" className="w-full h-full object-cover"/>
                            : <FiImage className="text-muted text-xl"/>}
                    </div>
                    <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap gap-2">
                            <button type="button" onClick={pick} disabled={busy}
                                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-white text-primary text-xs font-semibold disabled:opacity-60">
                                <FiUploadCloud/> {busy ? "Processing…" : "Upload"}
                            </button>
                            <button type="button" onClick={() => setShowUrl((s) => !s)}
                                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-border text-xs text-secondary hover:text-white hover:border-white/30">
                                <FiLink/> URL
                            </button>
                            {value && (
                                <button type="button" onClick={() => onChange("")}
                                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-border text-xs text-muted hover:text-white hover:border-brand/50">
                                    <FiX/> Remove
                                </button>
                            )}
                        </div>
                        <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={onFile}/>
                        {showUrl && (
                            <input
                                type="text"
                                value={value && value.startsWith("data:") ? "" : (value || "")}
                                placeholder="https://… image URL"
                                onChange={(e) => onChange(e.target.value)}
                                className="mt-2 w-full rounded-md bg-surface border border-border px-2.5 py-1.5 text-xs text-white placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-brand/60"
                            />
                        )}
                        <div className="mt-2 text-[11px] text-muted">
                            {value?.startsWith("data:")
                                ? <>Embedded image{bytes ? ` · ~${(bytes / 1024).toFixed(0)} KB` : ""}{big ? <span className="text-brand-400"> · large, consider a smaller source</span> : null}</>
                                : value
                                    ? "External URL"
                                    : "Upload a file (auto-resized & compressed) or paste a URL."}
                        </div>
                        {err && <div className="mt-1 text-[11px] text-brand-400">{err}</div>}
                    </div>
                </div>
            </div>
        </Field>
    );
}
