import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

function StoreFooter() {
    const { t } = useTranslation();
    return (
        <footer className="store-footer">
            <div className="store-footer__inner">
                <div>
                    <Link to="/" className="brand">
                        <span className="brand__mark">S</span>
                        <span>
                            shop
                            <span className="brand__accent">lane</span>
                        </span>
                    </Link>
                    <p>{t('footerDescription')}</p>
                </div>

                <div className="store-footer__links">
                        <Link to="/">{t('home')}</Link>
                        <Link to="/profile">{t('profile')}</Link>
                    <span>support@shoplane.local</span>
                </div>
            </div>

            <div className="store-footer__bottom">
                © 2026 shoplane. Built for better everyday choices.
            </div>
        </footer>
    );
}

export default StoreFooter;