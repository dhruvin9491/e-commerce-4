import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { AUTH_ROUTE, CLIENT_ROUTE } from '../../constants/RoutesConstant';
import { useAuth } from '../../helper/AuthHelper';
import { LANG_VALUE } from '../../constants/CommonConstant';
import { langContext } from '../../context/LangContext';
import { confirmAction } from '../../helper/UiHelper';
import { useTranslation } from 'react-i18next';

function Header() {
    const navigate = useNavigate();
    const { user, logout } = useAuth();
    const {changeLang} = useContext(langContext);
    const { t } = useTranslation();

    const handleLogout = async () => {
        const isConfirmed = await confirmAction({
            title: t('signOutStoreTitle'),
            text: t('signOutStoreText'),
            confirmButtonText: t('signOutButton'),
            icon: "question"
        });

        if (!isConfirmed) return;
        logout();
        navigate(AUTH_ROUTE.LOGIN, { replace: true });
    };

    return (
        <header className="store-header">
            <div className="store-header__inner">
                <Link to={CLIENT_ROUTE.HOME} className="brand">
                    <span className="brand__mark">S</span>
                    <span>
                        shop
                        <span className="brand__accent">lane</span>
                    </span>
                </Link>

                <nav className="store-nav">
                    <Link to={CLIENT_ROUTE.HOME}>{t('home')}</Link>
                    <Link to={CLIENT_ROUTE.PROFILE}>{t('profile')}</Link>
                    <Link to={CLIENT_ROUTE.STORE}>{t('store')}</Link>
                </nav>

                <div className="store-header__actions">
                    <span className="welcome text-nowrap">{t('navWelcome', { name: user?.name || t('shopper') })}</span>
                    <select onChange={(e) => changeLang(e.target.value)}  className='form-control form-select'>
                        {
                            Object.entries(LANG_VALUE).map((lang, i) => {
                                return (
                                    <option value={lang[1]} key={i}>{t(lang[0].toLowerCase())}</option>
                                )
                            })
                        }
                    </select>
                    <button type="button" className="text-button text-nowrap" onClick={handleLogout}>
                        {t('signOut')}
                    </button>
                </div>
            </div>
        </header>
    );
}

export default Header;