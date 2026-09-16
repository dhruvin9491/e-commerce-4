import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { AUTH_ROUTE, CLIENT_ROUTE } from '../../constants/RoutesConstant';
import { useAuth } from '../../helper/AuthHelper';
import { LANG_VALUE } from '../../constants/CommonConstant';
import { langContext } from '../../context/LangContext';

function Header() {
    const navigate = useNavigate();
    const { user, logout } = useAuth();
    const {changeLang} = useContext(langContext);

    const handleLogout = () => {
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
                    <Link to={CLIENT_ROUTE.HOME}>Home</Link>
                    <Link to={CLIENT_ROUTE.PROFILE}>Profile</Link>
                    <Link to={CLIENT_ROUTE.STORE}>Store</Link>
                </nav>

                <div className="store-header__actions">
                    <span className="welcome text-nowrap">Hi, {user?.name || 'shopper'}</span>
                    <select onChange={(e) => changeLang(e.target.value)}  className='form-control form-select'>
                        {Object.entries(LANG_VALUE).map((lang, i) => <option value={lang[1]} key={i}>{lang[0]}</option>)}
                    </select>
                    <button type="button" className="text-button text-nowrap" onClick={handleLogout}>
                        Sign out
                    </button>
                </div>
            </div>
        </header>
    );
}

export default Header;