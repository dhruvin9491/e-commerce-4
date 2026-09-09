import React, { useContext } from 'react';
import Header from '../../components/user/Header';
import StoreFooter from '../../components/user/StoreFooter';
import { useAuth } from '../../helper/AuthHelper';
import { LANG_VALUE } from '../../constants/CommonConstant';
import { langContext } from '../../context/LangContext';

function StoreProfile() {
    const { user } = useAuth();
    const { lang } = useContext(langContext);

    return (
        <>
            <Header />

            <main className="profile-page">
                <section className="profile-card">
                    <h1>  {
                        lang === LANG_VALUE.GJ ? "મારી પ્રોફાઇલ" :
                            lang === LANG_VALUE.HI ? "मेरी प्रोफाइल" :
                                "My profile"
                    }</h1>

                    <div className="profile-info">
                        <div className="profile-info__item">
                            <label>Name</label>
                            <span>{user?.name || 'Guest user'}</span>
                        </div>

                        <div className="profile-info__item">
                            <label>Role</label>
                            <span>{user?.role || 'user'}</span>
                        </div>

                        <div className="profile-info__item">
                            <label>Email</label>
                            <span>{user?.email || 'No email found'}</span>
                        </div>

                        <div className="profile-info__item">
                            <label>Status</label>
                            <span>{user?.isDeleted ? 'Inactive' : 'Active'}</span>
                        </div>
                    </div>
                </section>
            </main>

            <StoreFooter />
        </>
    );
}

export default StoreProfile;
