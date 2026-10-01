import React, {useEffect, useState} from "react";
import {useNavigate, useLocation} from "react-router-dom";
import {Helmet} from "react-helmet-async";
import {FiLock, FiUser, FiArrowRight} from "react-icons/fi";
import {useAuth} from "../../store/AuthContext.jsx";

export default function AdminLogin() {
    const {login, isAuthed} = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [busy, setBusy] = useState(false);

    const dest = location.state?.from || "/admin";
    useEffect(() => {
        if (isAuthed) navigate(dest, {replace: true});
    }, [isAuthed, dest, navigate]);

    const submit = async (e) => {
        e.preventDefault();
        setError("");
        setBusy(true);
        try {
            const res = await login(username, password);
            if (res.ok) navigate(dest, {replace: true});
            else setError(res.error || "Login failed.");
        } catch (err) {
            setError(String(err?.message || err));
        } finally {
            setBusy(false);
        }
    };

    return (
        <div className="min-h-screen bg-primary text-white flex items-center justify-center px-6">
            <Helmet>
                <title>Admin · DeWelope</title>
                <meta name="robots" content="noindex,nofollow"/>
            </Helmet>
            <form onSubmit={submit} className="w-full max-w-sm glass rounded-2xl p-8 border border-white/10">
                <div className="flex items-center gap-2.5 mb-6">
                    <img src="/dewelope-mark-white.svg" alt="" width="32" height="32" className="w-8 h-8"/>
                    <div>
                        <div className="font-display font-semibold text-lg leading-none">DeWelope Admin</div>
                        <div className="text-xs text-muted mt-1">Content dashboard</div>
                    </div>
                </div>

                <label className="block mb-4">
                    <span className="block text-xs font-mono uppercase tracking-widest text-muted mb-1.5">Username</span>
                    <div className="relative">
                        <FiUser className="absolute left-3 top-1/2 -translate-y-1/2 text-muted"/>
                        <input
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            autoFocus
                            autoComplete="username"
                            className="w-full rounded-lg bg-surface-2 border border-border pl-9 pr-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand/60"
                        />
                    </div>
                </label>

                <label className="block mb-5">
                    <span className="block text-xs font-mono uppercase tracking-widest text-muted mb-1.5">Password</span>
                    <div className="relative">
                        <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-muted"/>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            autoComplete="current-password"
                            className="w-full rounded-lg bg-surface-2 border border-border pl-9 pr-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand/60"
                        />
                    </div>
                </label>

                {error && <p className="text-sm text-brand-400 mb-4" role="alert">{error}</p>}

                <button
                    type="submit"
                    disabled={busy}
                    className="w-full inline-flex items-center justify-center gap-2 rounded-lg bg-white text-primary font-semibold py-2.5 text-sm disabled:opacity-60"
                >
                    {busy ? "Signing in…" : <>Sign in <FiArrowRight/></>}
                </button>

                <p className="text-[11px] text-muted mt-5 leading-relaxed">
                    Edits save to this browser. Use <strong className="text-secondary">Publish / Export</strong> in
                    the dashboard to push changes live.
                </p>
            </form>
        </div>
    );
}
