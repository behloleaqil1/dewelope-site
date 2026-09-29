import React, {useEffect, useRef, useState} from "react";

const INTERACTIVE = 'a, button, [data-magnet], [role="button"], input, textarea, label, [data-cursor="hover"]';

const Cursor = () => {
    const dotRef = useRef(null);
    const haloRef = useRef(null);
    const [supported, setSupported] = useState(false);

    useEffect(() => {
        // Only enable on devices with a fine pointer that hovers, and never
        // when the user prefers reduced motion.
        const hoverMq = window.matchMedia("(hover: hover) and (pointer: fine)");
        const motionMq = window.matchMedia("(prefers-reduced-motion: reduce)");
        const evaluate = () => setSupported(hoverMq.matches && !motionMq.matches);
        evaluate();
        hoverMq.addEventListener?.("change", evaluate);
        motionMq.addEventListener?.("change", evaluate);
        return () => {
            hoverMq.removeEventListener?.("change", evaluate);
            motionMq.removeEventListener?.("change", evaluate);
        };
    }, []);

    useEffect(() => {
        if (!supported) return;
        document.documentElement.classList.add("has-custom-cursor");
        return () => document.documentElement.classList.remove("has-custom-cursor");
    }, [supported]);

    useEffect(() => {
        if (!supported) return;
        const dot = dotRef.current;
        const halo = haloRef.current;
        if (!dot || !halo) return;

        const target = {x: window.innerWidth / 2, y: window.innerHeight / 2};
        const dotPos = {x: target.x, y: target.y};
        const haloPos = {x: target.x, y: target.y};
        const state = {hovering: false, pressed: false, visible: false, magnet: null};

        const show = () => {
            if (state.visible) return;
            state.visible = true;
            dot.style.opacity = "1";
            halo.style.opacity = "1";
        };

        const onMove = (e) => {
            target.x = e.clientX;
            target.y = e.clientY;
            show();
        };
        const onDown = () => { state.pressed = true; };
        const onUp = () => { state.pressed = false; };
        const onLeave = () => {
            state.visible = false;
            dot.style.opacity = "0";
            halo.style.opacity = "0";
        };

        const onOver = (e) => {
            const el = e.target.closest && e.target.closest(INTERACTIVE);
            if (el) {
                state.hovering = true;
                state.magnet = el;
            }
        };
        const onOut = (e) => {
            const leaving = e.target.closest && e.target.closest(INTERACTIVE);
            const entering = e.relatedTarget && e.relatedTarget.closest && e.relatedTarget.closest(INTERACTIVE);
            if (leaving && !entering) {
                state.hovering = false;
                state.magnet = null;
            }
        };

        window.addEventListener("pointermove", onMove, {passive: true});
        window.addEventListener("pointerdown", onDown, {passive: true});
        window.addEventListener("pointerup", onUp, {passive: true});
        document.addEventListener("pointerleave", onLeave);
        document.addEventListener("pointerover", onOver, {passive: true});
        document.addEventListener("pointerout", onOut, {passive: true});

        // Reset internal state on tab blur so the cursor doesn't get "stuck"
        // hovering/pressed after the user alt-tabs away mid-interaction.
        const onBlur = () => { state.pressed = false; state.hovering = false; state.magnet = null; };
        window.addEventListener("blur", onBlur);

        let raf = 0;
        const loop = () => {
            // Gentle magnetic pull: when hovering an interactive element, ease
            // the halo toward the element's center for a subtle "snap" feel.
            let hx = target.x, hy = target.y;
            if (state.magnet) {
                const r = state.magnet.getBoundingClientRect();
                const cx = r.left + r.width / 2;
                const cy = r.top + r.height / 2;
                hx = target.x + (cx - target.x) * 0.18;
                hy = target.y + (cy - target.y) * 0.18;
            }

            // Dot tracks tightly (feels responsive); halo trails softly.
            dotPos.x += (target.x - dotPos.x) * 0.5;
            dotPos.y += (target.y - dotPos.y) * 0.5;
            haloPos.x += (hx - haloPos.x) * 0.2;
            haloPos.y += (hy - haloPos.y) * 0.2;

            // Subtler scaling than before (was 1.55/0.5) so it doesn't "jump".
            const haloScale = state.hovering ? (state.pressed ? 1.1 : 1.3) : (state.pressed ? 0.85 : 1);
            const dotScale = state.hovering ? 0.6 : (state.pressed ? 0.8 : 1);

            dot.style.transform =
                `translate3d(${dotPos.x}px, ${dotPos.y}px, 0) translate(-50%, -50%) scale(${dotScale})`;
            halo.style.transform =
                `translate3d(${haloPos.x}px, ${haloPos.y}px, 0) translate(-50%, -50%) scale(${haloScale})`;
            halo.style.backgroundColor = state.hovering ? "rgba(192, 41, 47, 0.10)" : "rgba(192, 41, 47, 0)";
            halo.style.borderColor = state.hovering ? "rgba(192, 41, 47, 0.9)" : "rgba(192, 41, 47, 0.35)";

            raf = requestAnimationFrame(loop);
        };
        raf = requestAnimationFrame(loop);

        return () => {
            cancelAnimationFrame(raf);
            window.removeEventListener("pointermove", onMove);
            window.removeEventListener("pointerdown", onDown);
            window.removeEventListener("pointerup", onUp);
            document.removeEventListener("pointerleave", onLeave);
            document.removeEventListener("pointerover", onOver);
            document.removeEventListener("pointerout", onOut);
            window.removeEventListener("blur", onBlur);
        };
    }, [supported]);

    if (!supported) return null;

    return (
        <>
            <div
                ref={haloRef}
                aria-hidden
                className="pointer-events-none fixed top-0 left-0 w-8 h-8 rounded-full border border-brand/35 z-[9999] opacity-0 transition-[opacity,border-color,background-color] duration-200 ease-out"
                style={{willChange: "transform, opacity"}}
            />
            <div
                ref={dotRef}
                aria-hidden
                className="pointer-events-none fixed top-0 left-0 w-[5px] h-[5px] rounded-full bg-brand z-[9999] opacity-0 transition-opacity duration-200"
                style={{willChange: "transform, opacity"}}
            />
        </>
    );
};

export default Cursor;
