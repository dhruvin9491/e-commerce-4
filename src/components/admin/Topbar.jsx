import React from "react";
import { useNavigate } from "react-router-dom";
import { AUTH_ROUTE } from "../../constants/RoutesConstant";
import { useAuth } from "../../helper/AuthHelper";
import { confirmAction } from "../../helper/UiHelper";
import { useTranslation } from 'react-i18next';

function Topbar() {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { user, logout } = useAuth();
    const handleLogout = async () => {
        const isConfirmed = await confirmAction({
            title: t('signOutAdminTitle'),
            text: t('signOutAdminText'),
            confirmButtonText: t('signOutButton'),
            icon: "question"
        });

        if (!isConfirmed) return;
        logout();
        navigate(AUTH_ROUTE.LOGIN, { replace: true });
    };
    return <header className="bg-white border-bottom px-4 py-3 d-flex justify-content-between align-items-center">
        <span className="text-muted">{t('signedInAs')} <strong className="text-dark">{user?.name}</strong></span>
        <button type="button" className="btn btn-outline-secondary btn-sm" onClick={handleLogout}>{t('signOut')}</button>
    </header>;
}

export default Topbar;
