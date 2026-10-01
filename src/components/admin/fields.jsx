import React from "react";
import {FiChevronDown, FiChevronUp, FiPlus, FiTrash2} from "react-icons/fi";

// --- Primitive inputs -------------------------------------------------------

export function Field({label, hint, children}) {
    return (
        <label className="block">
            <span className="block text-xs font-mono uppercase tracking-widest text-muted mb-1.5">{label}</span>
            {children}
            {hint && <span className="block text-[11px] text-muted mt-1">{hint}</span>}
        </label>
    );
}

const inputCls =
    "w-full rounded-lg bg-surface-2 border border-border px-3 py-2 text-sm text-white " +
    "placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-brand/60 focus:border-brand/60";

export function TextInput({value, onChange, placeholder, type = "text"}) {
    return (
        <input
            type={type}
            value={value ?? ""}
            placeholder={placeholder}
            onChange={(e) => onChange(e.target.value)}
            className={inputCls}
        />
    );
}

export function TextArea({value, onChange, placeholder, rows = 3}) {
    return (
        <textarea
            rows={rows}
            value={value ?? ""}
            placeholder={placeholder}
            onChange={(e) => onChange(e.target.value)}
            className={inputCls + " resize-y leading-relaxed"}
        />
    );
}

export function SelectInput({value, onChange, options}) {
    return (
        <select value={value ?? ""} onChange={(e) => onChange(e.target.value)} className={inputCls}>
            <option value="">— none —</option>
            {options.map((o) => (
                <option key={o} value={o}>{o}</option>
            ))}
        </select>
    );
}

// --- List of plain strings (e.g. experience bullet points, stack tags) ------

export function StringList({items, onChange, placeholder = "Add item", textarea = false}) {
    const list = items || [];
    const update = (i, v) => onChange(list.map((it, idx) => (idx === i ? v : it)));
    const remove = (i) => onChange(list.filter((_, idx) => idx !== i));
    const add = () => onChange([...list, ""]);
    const move = (i, dir) => {
        const j = i + dir;
        if (j < 0 || j >= list.length) return;
        const next = [...list];
        [next[i], next[j]] = [next[j], next[i]];
        onChange(next);
    };
    return (
        <div className="space-y-2">
            {list.map((it, i) => (
                <div key={i} className="flex items-start gap-2">
                    <div className="flex flex-col gap-0.5 pt-1">
                        <IconBtn onClick={() => move(i, -1)} title="Move up" disabled={i === 0}><FiChevronUp/></IconBtn>
                        <IconBtn onClick={() => move(i, 1)} title="Move down" disabled={i === list.length - 1}><FiChevronDown/></IconBtn>
                    </div>
                    {textarea
                        ? <TextArea value={it} onChange={(v) => update(i, v)} rows={2}/>
                        : <TextInput value={it} onChange={(v) => update(i, v)} placeholder={placeholder}/>}
                    <IconBtn onClick={() => remove(i)} title="Remove" danger><FiTrash2/></IconBtn>
                </div>
            ))}
            <button type="button" onClick={add}
                    className="inline-flex items-center gap-1.5 text-xs font-mono uppercase tracking-widest text-brand-400 hover:text-brand">
                <FiPlus/> {placeholder}
            </button>
        </div>
    );
}

// --- Small icon button ------------------------------------------------------

export function IconBtn({children, onClick, title, danger, disabled}) {
    return (
        <button
            type="button"
            onClick={onClick}
            title={title}
            aria-label={title}
            disabled={disabled}
            className={
                "w-7 h-7 shrink-0 rounded-md flex items-center justify-center border transition-colors " +
                (disabled
                    ? "border-border text-muted/40 cursor-not-allowed"
                    : danger
                        ? "border-border text-muted hover:text-white hover:border-brand hover:bg-brand/15"
                        : "border-border text-muted hover:text-white hover:border-white/30 hover:bg-white/5")
            }
        >
            {children}
        </button>
    );
}

// --- Repeatable list of complex items with reorder/add/remove ---------------
// renderItem(item, update(partial|fn), index) renders the item's fields.

export function ItemList({items, onChange, newItem, renderItem, itemLabel = "item"}) {
    const list = items || [];
    const update = (i, patch) =>
        onChange(list.map((it, idx) => (idx === i ? {...it, ...(typeof patch === "function" ? patch(it) : patch)} : it)));
    const remove = (i) => onChange(list.filter((_, idx) => idx !== i));
    const add = () => onChange([...list, typeof newItem === "function" ? newItem() : {...newItem}]);
    const move = (i, dir) => {
        const j = i + dir;
        if (j < 0 || j >= list.length) return;
        const next = [...list];
        [next[i], next[j]] = [next[j], next[i]];
        onChange(next);
    };
    return (
        <div className="space-y-4">
            {list.map((it, i) => (
                <div key={i} className="rounded-xl border border-border bg-surface p-4">
                    <div className="flex items-center justify-between mb-3">
                        <span className="text-[11px] font-mono uppercase tracking-widest text-muted">
                            {itemLabel} {i + 1}
                        </span>
                        <div className="flex items-center gap-1">
                            <IconBtn onClick={() => move(i, -1)} title="Move up" disabled={i === 0}><FiChevronUp/></IconBtn>
                            <IconBtn onClick={() => move(i, 1)} title="Move down" disabled={i === list.length - 1}><FiChevronDown/></IconBtn>
                            <IconBtn onClick={() => remove(i)} title="Delete" danger><FiTrash2/></IconBtn>
                        </div>
                    </div>
                    {renderItem(it, (patch) => update(i, patch), i)}
                </div>
            ))}
            <button type="button" onClick={add}
                    className="w-full py-3 rounded-xl border border-dashed border-border text-sm font-mono uppercase tracking-widest text-brand-400 hover:text-brand hover:border-brand/50 transition-colors inline-flex items-center justify-center gap-2">
                <FiPlus/> Add {itemLabel}
            </button>
        </div>
    );
}
