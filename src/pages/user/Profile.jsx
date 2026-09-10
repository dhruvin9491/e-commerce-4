import React from 'react';
import { useTranslation } from 'react-i18next';
import Header from '../../components/user/Header';
import StoreFooter from '../../components/user/StoreFooter';
import { useAuth } from '../../helper/AuthHelper';

function StoreProfile() {
    const { user } = useAuth();
    const { t } = useTranslation();

    return (
        <>
            <Header />

            <main className="profile-page">
                <section className="profile-card">
                    <h1>{t('profileTitle')}</h1>

                    <div className="profile-info">
                        <div className="profile-info__item">
                            <label>{t('name')}</label>
                            <span>{user?.name || t('guestUser')}</span>
                        </div>

                        <div className="profile-info__item">
                            <label>{t('role')}</label>
                            <span>{user?.role || t('user')}</span>
                        </div>

                        <div className="profile-info__item">
                            <label>{t('email')}</label>
                            <span>{user?.email || t('noEmail')}</span>
                        </div>

                        <div className="profile-info__item">
                            <label>{t('status')}</label>
                            <span>{user?.isDeleted ? t('inactive') : t('active')}</span>
                        </div>
                    </div>
                </section>
            </main>

            <StoreFooter />
        </>
    );
}

export default StoreProfile;
