import React, { useEffect, useState } from 'react';
import { PRODUCT_API, USER_API } from '../../constants/ApiConstant';
import { getData } from '../../helper/ApiHelper';

function Dashboard(props) {
    const [stats, setStats] = useState({ products: 0, users: 0 });
    useEffect(() => {
        Promise.all([getData(PRODUCT_API), getData(USER_API)])
            .then(([products, users]) => setStats({ products: products.data.length, users: users.data.length }))
            .catch(() => null);
    }, []);
    return <main className="container-fluid p-4">
        <p className="text-uppercase text-primary small mb-1">Overview</p><h1 className="h2 mb-4">Dashboard</h1>
        <div className="row g-3">
            <div className="col-md-6">
                <div className="bg-white border-start border-primary border-4 p-4 shadow-sm">
                    <div className="text-muted">Products</div><strong className="display-6">{stats.products}</strong>
                </div>
            </div>
            <div className="col-md-6">
                <div className="bg-white border-start border-success border-4 p-4 shadow-sm">
                    <div className="text-muted">Users</div><strong className="display-6">{stats.users}</strong>
                </div>
            </div>
        </div>
    </main>;
}

export default Dashboard;