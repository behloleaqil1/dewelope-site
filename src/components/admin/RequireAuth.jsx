import React from "react";
import {Navigate, useLocation} from "react-router-dom";
import {useAuth} from "../../store/AuthContext.jsx";

export default function RequireAuth({children}) {
    const {isAuthed, ready} = useAuth();
    const location = useLocation();

    if (!ready) {
        return (
            <div className="min-h-screen bg-primary flex items-center justify-center">
                <div className="canvas-loader"/>
            </div>
        );
    }
    if (!isAuthed) {
        return <Navigate to="/admin/login" state={{from: location.pathname}} replace/>;
    }
    return children;
}
