import React, { useEffect, useState } from 'react';
import { PRODUCT_API, USER_API } from '../../constants/ApiConstant';
import { getData } from '../../helper/ApiHelper';
import { useTranslation } from 'react-i18next';

function Dashboard(props) {
    const [stats, setStats] = useState({ products: 0, users: 0 });
    const { t } = useTranslation();
    useEffect(() => {
        Promise.all([getData(PRODUCT_API), getData(USER_API)])
            .then(([products, users]) => setStats({ products: products.data.length, users: users.data.length }))
            .catch(() => null);
    }, []);
    return <main className="container-fluid p-4">
        <p className="text-uppercase text-primary small mb-1">{t('overview')}</p><h1 className="h2 mb-4">{t('dashboard')}</h1>
        <div className="row g-3">
            <div className="col-md-6">
                <div className="bg-white border-start border-primary border-4 p-4 shadow-sm">
                    <div className="text-muted">{t('products')}</div><strong className="display-6">{stats.products}</strong>
                </div>
            </div>
            <div className="col-md-6">
                <div className="bg-white border-start border-success border-4 p-4 shadow-sm">
                    <div className="text-muted">{t('users')}</div><strong className="display-6">{stats.users}</strong>
                </div>
            </div>
        </div>
    </main>;
}

export default Dashboard;