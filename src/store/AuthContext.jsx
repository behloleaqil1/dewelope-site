import React, {createContext, useCallback, useContext, useEffect, useMemo, useState} from "react";
import {hashPassword} from "../utils/hash.js";
import {useContentStore} from "./ContentContext.jsx";

const SESSION_KEY = "dewelope:session:v1";
const AuthContext = createContext(null);

export function AuthProvider({children}) {
    const {content} = useContentStore();
    const [user, setUser] = useState(null);
    const [ready, setReady] = useState(false);

    // Restore session on load.
    useEffect(() => {
        try {
            const raw = sessionStorage.getItem(SESSION_KEY);
            if (raw) setUser(JSON.parse(raw));
        } catch {
            /* ignore */
        }
        setReady(true);
    }, []);

    // Validate credentials against the hashed users in content.json.
    const login = useCallback(
        async (username, password) => {
            const users = content?.users || [];
            const found = users.find(
                (u) => u.username.toLowerCase() === String(username).trim().toLowerCase()
            );
            if (!found) return {ok: false, error: "Unknown user."};
            const hash = await hashPassword(found.salt, password);
            if (hash !== found.passwordHash) return {ok: false, error: "Incorrect password."};
            const session = {id: found.id, username: found.username, name: found.name, role: found.role};
            setUser(session);
            try {
                sessionStorage.setItem(SESSION_KEY, JSON.stringify(session));
            } catch {
                /* ignore */
            }
            return {ok: true};
        },
        [content]
    );

    const logout = useCallback(() => {
        setUser(null);
        try {
            sessionStorage.removeItem(SESSION_KEY);
        } catch {
            /* ignore */
        }
    }, []);

    const value = useMemo(() => ({user, ready, login, logout, isAuthed: !!user}), [user, ready, login, logout]);
    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error("useAuth must be used within AuthProvider");
    return ctx;
}
