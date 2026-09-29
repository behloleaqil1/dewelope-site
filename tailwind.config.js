/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx}"],
  mode: "jit",
  theme: {
    extend: {
      colors: {
        // Brand: ink black + brand red (DeWelope brand guide)
        //   Brand red  #C0292F  ·  Ink black #141414
        primary: "#141414",       // ink black — never pure #000
        surface: "#1a1a1a",       // raised ink
        "surface-2": "#212121",
        "surface-3": "#2a2a2a",
        border: "#333333",
        secondary: "#b7b7b7",     // muted warm grey text
        muted: "#8a8a8a",
        brand: "#C0292F",         // brand red — the single accent red
        "brand-600": "#a3232a",   // darker red (hover/pressed)
        "brand-400": "#d4494f",   // lighter red (highlights)
        accent: "#C0292F",        // accent === brand red (was violet)
        "accent-2": "#d4494f",    // lighter brand red (was cyan)
        "accent-3": "#e8e8e8",    // near-white neutral highlight (was lime)
        "accent-4": "#C0292F",    // (was rose) — keep red family
        // legacy aliases (kept so existing imports compile)
        tertiary: "#212121",
        "black-100": "#1a1a1a",
        "black-200": "#141414",
        "white-100": "#f3f3f3",
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        display: ["'Space Grotesk'", "Inter", "sans-serif"],
        mono: ["'JetBrains Mono'", "ui-monospace", "monospace"],
      },
      boxShadow: {
        card: "0 30px 80px -20px rgba(192, 41, 47, 0.35)",
        glow: "0 0 60px rgba(192, 41, 47, 0.45)",
        "glow-cyan": "0 0 60px rgba(192, 41, 47, 0.28)",
        inset: "inset 0 1px 0 0 rgba(255,255,255,0.06)",
      },
      screens: {
        xs: "450px",
      },
      backgroundImage: {
        "grid-pattern":
          "linear-gradient(rgba(192,41,47,0.07) 1px, transparent 1px), linear-gradient(90deg, rgba(192,41,47,0.07) 1px, transparent 1px)",
        "radial-glow":
          "radial-gradient(circle at 50% 0%, rgba(192,41,47,0.18), transparent 60%)",
        "hero-pattern":
          "radial-gradient(ellipse at top, rgba(192,41,47,0.20), transparent 55%), radial-gradient(ellipse at bottom right, rgba(192,41,47,0.08), transparent 60%)",
      },
      backgroundSize: {
        grid: "44px 44px",
      },
      animation: {
        "spin-slow": "spin 18s linear infinite",
        "float": "float 6s ease-in-out infinite",
        "marquee": "marquee 40s linear infinite",
        "pulse-glow": "pulseGlow 3s ease-in-out infinite",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-12px)" },
        },
        marquee: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
        pulseGlow: {
          "0%, 100%": { opacity: 0.7 },
          "50%": { opacity: 1 },
        },
      },
    },
  },
  plugins: [],
};
