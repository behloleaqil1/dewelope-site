import React, {useRef, useState} from "react";
import {Link} from "react-router-dom";
import {Helmet} from "react-helmet-async";
import {
    FiUser, FiBarChart2, FiGrid, FiGitBranch, FiCpu, FiBriefcase, FiFolder,
    FiMessageSquare, FiSearch, FiEdit3, FiDownload, FiUpload, FiRotateCcw,
    FiLogOut, FiExternalLink, FiCheckCircle, FiAlertCircle,
} from "react-icons/fi";
import {useContentStore} from "../../store/ContentContext.jsx";
import {useAuth} from "../../store/AuthContext.jsx";
import {
    ProfileEditor, HeroStatsEditor, ServicesEditor, ProcessEditor, TechEditor,
    ExperiencesEditor, ProjectsEditor, TestimonialsEditor, SeoEditor,
} from "./editors.jsx";
import {BlogEditor} from "./BlogEditor.jsx";

const SECTIONS = [
    {key: "profile", label: "Profile & Identity", icon: FiUser, Editor: ProfileEditor},
    {key: "heroStats", label: "Hero Stats", icon: FiBarChart2, Editor: HeroStatsEditor},
    {key: "services", label: "Services", icon: FiGrid, Editor: ServicesEditor},
    {key: "processSteps", label: "Process", icon: FiGitBranch, Editor: ProcessEditor},
    {key: "technologies", label: "Technologies", icon: FiCpu, Editor: TechEditor},
    {key: "experiences", label: "Experience", icon: FiBriefcase, Editor: ExperiencesEditor},
    {key: "projects", label: "Projects", icon: FiFolder, Editor: ProjectsEditor},
    {key: "testimonials", label: "Testimonials", icon: FiMessageSquare, Editor: TestimonialsEditor},
    {key: "blog", label: "Blog", icon: FiEdit3, Editor: BlogEditor},
    {key: "seo", label: "SEO", icon: FiSearch, Editor: SeoEditor},
];

export default function AdminDashboard() {
    const {content, loading, error, dirty, updateSection, reset, exportJson, importJson} = useContentStore();
    const {user, logout} = useAuth();
    const [active, setActive] = useState("profile");
    const [toast, setToast] = useState(null);
    const fileRef = useRef(null);

    const flash = (type, msg) => {
        setToast({type, msg});
        setTimeout(() => setToast(null), 4000);
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-primary flex items-center justify-center">
                <div className="canvas-loader"/>
            </div>
        );
    }
    if (error || !content) {
        return (
            <div className="min-h-screen bg-primary flex items-center justify-center text-center px-6">
                <div>
                    <p className="text-brand-400 font-semibold mb-2">Couldn&apos;t load content.json</p>
                    <p className="text-muted text-sm">{String(error?.message || "Unknown error")}</p>
                </div>
            </div>
        );
    }

    const current = SECTIONS.find((s) => s.key === active);
    const Editor = current.Editor;

    const handleImport = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;
        try {
            const text = await file.text();
            importJson(JSON.parse(text));
            flash("ok", "Imported content.json into this browser.");
        } catch (err) {
            flash("err", `Import failed: ${err.message}`);
        } finally {
            e.target.value = "";
        }
    };

    const handleExport = () => {
        exportJson();
        flash("ok", "Downloaded content.json. Commit it to the repo to publish.");
    };

    return (
        <div className="min-h-screen bg-primary text-white flex">
            <Helmet>
                <title>Dashboard · DeWelope Admin</title>
                <meta name="robots" content="noindex,nofollow"/>
            </Helmet>

            {/* Sidebar */}
            <aside className="w-64 shrink-0 border-r border-white/10 bg-surface/40 flex flex-col sticky top-0 h-screen">
                <div className="p-5 border-b border-white/10 flex items-center gap-2.5">
                    <img src="/dewelope-mark-white.svg" alt="" width="30" height="30" className="w-[30px] h-[30px]"/>
                    <div>
                        <div className="font-display font-semibold text-sm leading-none">DeWelope</div>
                        <div className="text-[11px] text-muted mt-1">Content Admin</div>
                    </div>
                </div>
                <nav className="flex-1 overflow-y-auto p-3 space-y-0.5">
                    {SECTIONS.map((s) => {
                        const Icon = s.icon;
                        const on = s.key === active;
                        return (
                            <button
                                key={s.key}
                                onClick={() => setActive(s.key)}
                                className={
                                    "w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors " +
                                    (on ? "bg-brand/15 text-white" : "text-secondary hover:bg-white/5 hover:text-white")
                                }
                            >
                                <Icon className={on ? "text-brand-400" : ""}/>
                                <span>{s.label}</span>
                                {s.key === "blog" && (content.blog?.length ? (
                                    <span className="ml-auto text-[10px] font-mono bg-white/10 rounded-full px-1.5 py-0.5">{content.blog.length}</span>
                                ) : null)}
                            </button>
                        );
                    })}
                </nav>
                <div className="p-3 border-t border-white/10 space-y-2">
                    <div className="text-[11px] text-muted px-1">
                        Signed in as <span className="text-secondary">{user?.name}</span>
                    </div>
                    <Link to="/" className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-secondary hover:bg-white/5 hover:text-white">
                        <FiExternalLink/> View site
                    </Link>
                    <button onClick={logout} className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-secondary hover:bg-white/5 hover:text-white">
                        <FiLogOut/> Sign out
                    </button>
                </div>
            </aside>

            {/* Main */}
            <main className="flex-1 min-w-0">
                {/* Top bar */}
                <header className="sticky top-0 z-10 bg-primary/80 backdrop-blur border-b border-white/10 px-6 py-3 flex items-center justify-between gap-4">
                    <div>
                        <h1 className="font-display font-semibold text-lg">{current.label}</h1>
                        <p className="text-[11px] text-muted">
                            {dirty ? "Unsaved changes stored in this browser" : "In sync with the published content.json"}
                        </p>
                    </div>
                    <div className="flex items-center gap-2">
                        <button onClick={() => fileRef.current?.click()}
                                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-border text-xs font-medium text-secondary hover:text-white hover:border-white/30">
                            <FiUpload/> Import
                        </button>
                        <input ref={fileRef} type="file" accept="application/json,.json" className="hidden" onChange={handleImport}/>
                        <button onClick={() => {
                            if (confirm("Discard local edits and revert to the published content?")) {
                                reset();
                                flash("ok", "Reverted to published content.");
                            }
                        }}
                                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-border text-xs font-medium text-secondary hover:text-white hover:border-white/30">
                            <FiRotateCcw/> Reset
                        </button>
                        <button onClick={handleExport}
                                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-white text-primary text-xs font-semibold">
                            <FiDownload/> Export / Publish
                        </button>
                    </div>
                </header>

                {/* Publish helper */}
                <div className="px-6 pt-4">
                    <div className="rounded-xl border border-border bg-surface/50 px-4 py-3 text-[12px] text-muted leading-relaxed">
                        <strong className="text-secondary">How to publish:</strong> edits save instantly to this browser.
                        Click <strong className="text-secondary">Export / Publish</strong> to download the updated{" "}
                        <code className="text-brand-400">content.json</code>, then commit it to the repo
                        (<code>public/content.json</code>) — the site redeploys automatically.
                    </div>
                </div>

                {/* Editor */}
                <div className="p-6 max-w-4xl">
                    <Editor
                        value={content[active]}
                        onChange={(next) => updateSection(active, next)}
                    />
                </div>
            </main>

            {/* Toast */}
            {toast && (
                <div className={
                    "fixed bottom-5 right-5 z-50 flex items-center gap-2 px-4 py-3 rounded-xl text-sm shadow-glow " +
                    (toast.type === "ok" ? "bg-surface-2 border border-green-500/30 text-green-300" : "bg-surface-2 border border-brand/40 text-brand-400")
                }>
                    {toast.type === "ok" ? <FiCheckCircle/> : <FiAlertCircle/>}
                    {toast.msg}
                </div>
            )}
        </div>
    );
}
