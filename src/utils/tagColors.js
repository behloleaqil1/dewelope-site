// Project tag colors (brand tones only). Every pairing keeps text readable on the
// dark card background — well above 4.5:1 even at the 10px tag size.
// Older content used "*-text-gradient" class names from before the rebrand;
// those map onto these keys so existing content and saved drafts keep working.

export const TAG_COLORS = {
    red: {label: "Red", className: "bg-brand border-brand text-white"},
    rose: {label: "Soft red", className: "bg-brand/20 border-brand/60 text-[#f6a9ac]"},
    white: {label: "White", className: "bg-white/15 border-white/30 text-white"},
    grey: {label: "Grey", className: "bg-white/5 border-white/15 text-secondary"},
};

export const TAG_COLOR_KEYS = Object.keys(TAG_COLORS);
export const DEFAULT_TAG_COLOR = "rose";

const LEGACY = {
    "blue-text-gradient": "rose",
    "green-text-gradient": "white",
    "pink-text-gradient": "grey",
    "orange-text-gradient": "rose",
    "red-text-gradient": "red",
};

export function tagColorKey(color) {
    if (TAG_COLORS[color]) return color;
    return LEGACY[color] || DEFAULT_TAG_COLOR;
}

export function tagColorClass(color) {
    return TAG_COLORS[tagColorKey(color)].className;
}
