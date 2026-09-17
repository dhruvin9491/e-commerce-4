import React from "react";
import { useNavigate } from "react-router-dom";
import { AUTH_ROUTE } from "../../constants/RoutesConstant";
import { useAuth } from "../../helper/AuthHelper";
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined';

function Topbar() {
    const navigate = useNavigate();
    const { user, logout } = useAuth();
    const handleLogout = () => {
        logout();
        navigate(AUTH_ROUTE.LOGIN, { replace: true });
    };
    return <header className="bg-white border-bottom d-flex justify-content-between align-items-center px-4 py-3">
        <div>
            <span className="eyebrow">Admin workspace</span>
            <strong className="d-block small mt-1">Good to see you, {user?.name || 'Admin'}</strong>
        </div>
        <button type="button" className="btn btn-outline-secondary btn-sm d-inline-flex align-items-center gap-2" onClick={handleLogout}>
            <LogoutOutlinedIcon fontSize="small" />
            <span>Sign out</span>
        </button>
    </header>;
}

export default Topbar;
