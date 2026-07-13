import React, {lazy, Suspense} from "react";
import {BrowserRouter, Routes, Route} from "react-router-dom";
import {About, Cursor, Hero, Navbar, SmoothScroll} from "./components/index.js";
import LazyVisible from "./components/LazyVisible.jsx";
import ScrollProgress from "./components/ScrollProgress.jsx";
import {isPrerender} from "./utils/prerender.js";
import Clients from "./components/Clients.jsx";
import SideNav from "./components/SideNav.jsx";
import SeoSchemas from "./components/SeoSchemas.jsx";
import HomeMeta from "./components/HomeMeta.jsx";
import MvpLanding from "./components/MvpLanding.jsx";

const Works = lazy(() => import("./components/Works.jsx"));
const Process = lazy(() => import("./components/Process.jsx"));
const Tech = lazy(() => import("./components/Tech.jsx"));
const Feedbacks = lazy(() => import("./components/Feedbacks.jsx"));
const CTA = lazy(() => import("./components/CTA.jsx"));
const Contact = lazy(() => import("./components/Contact.jsx"));
const Footer = lazy(() => import("./components/Footer.jsx"));
const StarsCanvas = lazy(() =>
    import("./components/canvas/index.js").then((m) => ({default: m.StarsCanvas}))
);

const SectionFallback = ({label = "Loading"}) => (
    <div className="w-full max-w-7xl mx-auto px-6 sm:px-16 py-24 flex items-center gap-3 text-muted">
        <div className="canvas-loader"/>
        <span className="text-xs font-mono uppercase tracking-widest">{label}…</span>
    </div>
);

function Home() {
    return (
        <>
            <SeoSchemas/>
            <HomeMeta/>
            <SideNav/>
            <div className="relative z-0 bg-primary noise-overlay overflow-x-hidden">
                <Navbar/>
                <Hero/>
                <Clients/>
                <About/>

                <Suspense fallback={<SectionFallback label="Work"/>}>
                    <Works/>
                </Suspense>

                <Suspense fallback={<SectionFallback label="Process"/>}>
                    <Process/>
                </Suspense>

                <Suspense fallback={<SectionFallback label="Stack"/>}>
                    <Tech/>
                </Suspense>

                <Suspense fallback={<SectionFallback label="Voices"/>}>
                    <Feedbacks/>
                </Suspense>

                <Suspense fallback={null}>
                    <CTA/>
                </Suspense>

                <div className="relative z-0">
                    <LazyVisible minHeight="400px" rootMargin="600px 0px">
                        <Suspense fallback={<SectionFallback label="Contact"/>}>
                            <Contact/>
                        </Suspense>
                    </LazyVisible>
                    {!isPrerender() && (
                        <Suspense fallback={null}>
                            <StarsCanvas/>
                        </Suspense>
                    )}
                </div>

                <Suspense fallback={null}>
                    <Footer/>
                </Suspense>
            </div>
        </>
    );
}

function App() {
    return (
        <BrowserRouter>
            <SmoothScroll/>
            <Cursor/>
            <ScrollProgress/>
            <Routes>
                <Route path="/" element={<Home/>}/>
                <Route path="/mvp" element={<MvpLanding/>}/>
            </Routes>
        </BrowserRouter>
    );
}

export default App;
