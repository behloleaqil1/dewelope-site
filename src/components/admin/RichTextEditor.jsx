import React, {useEffect, useRef, useCallback} from "react";
import {
    FiBold, FiItalic, FiUnderline, FiList, FiLink, FiImage, FiCode,
} from "react-icons/fi";

// Compress an uploaded image to a WebP data URL so inline images stay small
// enough to live inside content.json.
async function fileToDataURL(file, maxDim = 1200, quality = 0.8) {
    const read = await new Promise((res, rej) => {
        const r = new FileReader();
        r.onload = () => res(r.result);
        r.onerror = rej;
        r.readAsDataURL(file);
    });
    if (file.type === "image/svg+xml") return read;
    const img = await new Promise((res, rej) => {
        const i = new Image();
        i.onload = () => res(i);
        i.onerror = rej;
        i.src = read;
    });
    let {width, height} = img;
    if (width > maxDim || height > maxDim) {
        const s = Math.min(maxDim / width, maxDim / height);
        width = Math.round(width * s);
        height = Math.round(height * s);
    }
    const c = document.createElement("canvas");
    c.width = width;
    c.height = height;
    c.getContext("2d").drawImage(img, 0, 0, width, height);
    let out = c.toDataURL("image/webp", quality);
    if (!out.startsWith("data:image/webp")) out = c.toDataURL("image/jpeg", quality);
    return out;
}

const Btn = ({onClick, title, children}) => (
    <button
        type="button"
        title={title}
        aria-label={title}
        onMouseDown={(e) => e.preventDefault()} // keep selection
        onClick={onClick}
        className="w-8 h-8 rounded-md flex items-center justify-center text-secondary hover:text-white hover:bg-white/10 text-sm"
    >
        {children}
    </button>
);

const Divider = () => <span className="w-px h-5 bg-border mx-1"/>;

export function RichTextEditor({value, onChange}) {
    const ref = useRef(null);
    const imgRef = useRef(null);

    // Initialize / sync external value without clobbering the caret while typing.
    useEffect(() => {
        if (ref.current && ref.current.innerHTML !== (value || "")) {
            ref.current.innerHTML = value || "";
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const emit = useCallback(() => {
        if (ref.current) onChange(ref.current.innerHTML);
    }, [onChange]);

    const exec = (cmd, arg = null) => {
        document.execCommand(cmd, false, arg);
        ref.current?.focus();
        emit();
    };

    const addLink = () => {
        const url = prompt("Link URL:");
        if (url) exec("createLink", url);
    };

    const addImage = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;
        try {
            const url = await fileToDataURL(file);
            exec("insertImage", url);
        } catch (ex) {
            alert(`Couldn't insert image: ${ex?.message || ex}`);
        } finally {
            e.target.value = "";
        }
    };

    return (
        <div className="rounded-lg border border-border bg-surface-2 overflow-hidden">
            <div className="flex items-center flex-wrap gap-0.5 px-2 py-1.5 border-b border-border bg-surface">
                <Btn title="Bold" onClick={() => exec("bold")}><FiBold/></Btn>
                <Btn title="Italic" onClick={() => exec("italic")}><FiItalic/></Btn>
                <Btn title="Underline" onClick={() => exec("underline")}><FiUnderline/></Btn>
                <Divider/>
                <Btn title="Heading 2" onClick={() => exec("formatBlock", "<h2>")}><span className="font-bold text-xs">H2</span></Btn>
                <Btn title="Heading 3" onClick={() => exec("formatBlock", "<h3>")}><span className="font-bold text-xs">H3</span></Btn>
                <Btn title="Paragraph" onClick={() => exec("formatBlock", "<p>")}><span className="text-xs">¶</span></Btn>
                <Btn title="Quote" onClick={() => exec("formatBlock", "<blockquote>")}><span className="text-sm">&ldquo;&rdquo;</span></Btn>
                <Divider/>
                <Btn title="Bulleted list" onClick={() => exec("insertUnorderedList")}><FiList/></Btn>
                <Btn title="Numbered list" onClick={() => exec("insertOrderedList")}><span className="text-xs font-bold">1.</span></Btn>
                <Divider/>
                <Btn title="Link" onClick={addLink}><FiLink/></Btn>
                <Btn title="Insert image" onClick={() => imgRef.current?.click()}><FiImage/></Btn>
                <Btn title="Clear formatting" onClick={() => exec("removeFormat")}><FiCode/></Btn>
                <input ref={imgRef} type="file" accept="image/*" className="hidden" onChange={addImage}/>
            </div>
            <div
                ref={ref}
                contentEditable
                suppressContentEditableWarning
                onInput={emit}
                onBlur={emit}
                className="prose-admin min-h-[260px] max-h-[520px] overflow-y-auto px-4 py-3 text-sm text-white leading-relaxed focus:outline-none"
                data-placeholder="Write your post…"
            />
        </div>
    );
}
