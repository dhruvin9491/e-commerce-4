import React from "react";
import { useNavigate } from "react-router-dom";
import { AUTH_ROUTE } from "../../constants/RoutesConstant";
import { useAuth } from "../../helper/AuthHelper";

function Topbar() {
    const navigate = useNavigate();
    const { user, logout } = useAuth();
    const handleLogout = () => {
        logout();
        navigate(AUTH_ROUTE.LOGIN, { replace: true });
    };
    return <header className="bg-white border-bottom px-4 py-3 d-flex justify-content-between align-items-center">
        <span className="text-muted">Signed in as <strong className="text-dark">{user?.name}</strong></span>
        <button type="button" className="btn btn-outline-secondary btn-sm" onClick={handleLogout}>Sign out</button>
    </header>;
}

export default Topbar;
