import React from "react";
import {FiChevronDown, FiChevronUp, FiPlus, FiTrash2} from "react-icons/fi";
import {TAG_COLORS, TAG_COLOR_KEYS, DEFAULT_TAG_COLOR, tagColorKey, tagColorClass} from "../../utils/tagColors.js";

// --- Primitive inputs -------------------------------------------------------

// `group` renders a <div> instead of a <label>: use it when the field holds
// several buttons, since a click anywhere in a <label> fires its first control.
export function Field({label, hint, children, group = false}) {
    const Wrapper = group ? "div" : "label";
    return (
        <Wrapper className="block">
            <span className="block text-xs font-mono uppercase tracking-widest text-muted mb-1.5">{label}</span>
            {children}
            {hint && <span className="block text-[11px] text-muted mt-1">{hint}</span>}
        </Wrapper>
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

export function SelectInput({value, onChange, options, allowEmpty = true}) {
    return (
        <select value={value ?? ""} onChange={(e) => onChange(e.target.value)} className={inputCls}>
            {allowEmpty && <option value="">— none —</option>}
            {options.map((o) => (
                <option key={o} value={o}>{o}</option>
            ))}
        </select>
    );
}

// --- Color: native picker + brand swatches ----------------------------------
// Always emits a 6-digit hex; the 3D canvases append alpha digits to it.

const BRAND_SWATCHES = ["#c0292f", "#d4494f", "#a3232a", "#e8e8e8"];
const HEX6 = /^#[0-9a-f]{6}$/i;

export function ColorInput({value, onChange, fallback = "#c0292f", swatches = BRAND_SWATCHES}) {
    const hex = (HEX6.test(value || "") ? value : fallback).toLowerCase();
    return (
        <div className="flex items-center gap-2 flex-wrap">
            <input
                type="color"
                value={hex}
                onChange={(e) => onChange(e.target.value)}
                title="Pick any color"
                aria-label="Pick any color"
                className="w-9 h-9 p-1 rounded-lg bg-surface-2 border border-border cursor-pointer"
            />
            {swatches.map((c) => (
                <button
                    key={c}
                    type="button"
                    onClick={() => onChange(c)}
                    title={c}
                    aria-label={`Use ${c}`}
                    aria-pressed={hex === c}
                    className={
                        "w-7 h-7 rounded-full border border-white/20 transition-shadow " +
                        (hex === c ? "ring-2 ring-white ring-offset-2 ring-offset-surface" : "hover:ring-1 hover:ring-white/40")
                    }
                    style={{background: c}}
                />
            ))}
            <span className="font-mono text-xs text-muted ml-1">{hex}</span>
        </div>
    );
}

// --- Project tags: name + color, previewed as they render on the site -------

export function TagList({items, onChange}) {
    const list = items || [];
    const update = (i, patch) => onChange(list.map((t, idx) => (idx === i ? {...t, ...patch} : t)));
    const remove = (i) => onChange(list.filter((_, idx) => idx !== i));
    const add = () => onChange([...list, {name: "", color: DEFAULT_TAG_COLOR}]);
    const move = (i, dir) => {
        const j = i + dir;
        if (j < 0 || j >= list.length) return;
        const next = [...list];
        [next[i], next[j]] = [next[j], next[i]];
        onChange(next);
    };
    return (
        <div className="space-y-2">
            {list.map((t, i) => {
                const current = tagColorKey(t.color);
                return (
                    <div key={i} className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
                        <div className="flex flex-col gap-0.5">
                            <IconBtn onClick={() => move(i, -1)} title="Move up" disabled={i === 0}><FiChevronUp/></IconBtn>
                            <IconBtn onClick={() => move(i, 1)} title="Move down" disabled={i === list.length - 1}><FiChevronDown/></IconBtn>
                        </div>
                        <div className="flex-1 min-w-[8rem]">
                            <TextInput value={t.name} onChange={(v) => update(i, {name: v})} placeholder="Tag name"/>
                        </div>
                        <div className="flex items-center gap-1.5" role="group" aria-label="Tag color">
                            {TAG_COLOR_KEYS.map((k) => (
                                <button
                                    key={k}
                                    type="button"
                                    onClick={() => update(i, {color: k})}
                                    title={TAG_COLORS[k].label}
                                    aria-label={TAG_COLORS[k].label}
                                    aria-pressed={current === k}
                                    className={
                                        `h-7 px-2 rounded-full border text-[10px] font-mono ${TAG_COLORS[k].className} ` +
                                        (current === k ? "ring-2 ring-white ring-offset-2 ring-offset-surface" : "opacity-70 hover:opacity-100")
                                    }
                                >
                                    Aa
                                </button>
                            ))}
                        </div>
                        <IconBtn onClick={() => remove(i)} title="Remove" danger><FiTrash2/></IconBtn>
                    </div>
                );
            })}
            {list.some((t) => t.name) && (
                <div className="flex flex-wrap gap-2 rounded-lg bg-primary border border-border p-3">
                    {list.filter((t) => t.name).map((t, i) => (
                        <span key={i} className={`px-2.5 py-1 rounded-full text-[10px] font-mono border ${tagColorClass(t.color)}`}>
                            #{t.name}
                        </span>
                    ))}
                </div>
            )}
            <button type="button" onClick={add}
                    className="inline-flex items-center gap-1.5 text-xs font-mono uppercase tracking-widest text-brand-400 hover:text-brand">
                <FiPlus/> Add tag
            </button>
        </div>
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
