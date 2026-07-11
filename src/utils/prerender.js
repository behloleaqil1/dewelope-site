// True only while the static pre-render snapshot is being generated
// (scripts/prerender.mjs sets window.__PRERENDER__ before any script runs).
// Real visitors never have this flag, so they still get the full 3D scenes.
// We skip the decorative WebGL canvases during pre-render because they add no
// crawlable text and are slow/flaky under headless SwiftShader in CI.
export const isPrerender = () =>
    typeof window !== "undefined" && window.__PRERENDER__ === true;
