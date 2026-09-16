import React from 'react';

import Header from '../../components/user/Header';
import StoreFooter from '../../components/user/StoreFooter';
import { useAuth } from '../../helper/AuthHelper';

function StoreHome() {
    const { user } = useAuth();
    return (
        <>
            <Header />

            <main className="user-home">
                <section className="user-home__card">
                    <span className="eyebrow">Welcome</span>
                    <h1>
                        {
                            'Hello'
                        },
                        {user?.name || 'shopper'}
                        <br />
                        <em>Welcome back.</em>
                    </h1>

                    <p>
                        This is your personal home page. You can view your profile and keep the experience simple and clean.
                    </p>

                    <div className="user-home__meta">
                        <div className="user-home__meta-item">
                            <label>Account</label>
                            <strong>{user?.role || 'user'}</strong>
                        </div>

                        <div className="user-home__meta-item">
                            <label>Status</label>
                            <strong>{user?.isDeleted ? 'Inactive' : 'Active'}</strong>
                        </div>
                    </div>
                </section>
            </main>

            <StoreFooter />
        </>
    );
}

export default StoreHome;