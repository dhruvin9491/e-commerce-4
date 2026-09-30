import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProducts } from '../../redux/actions/productActions';
import { fetchUsers } from '../../redux/actions/userActions';
import { fetchReviews } from '../../redux/actions/reviewActions';

function Dashboard(props) {
    const dispatch = useDispatch();
    const products = useSelector((state) => state.products.data);
    const users = useSelector((state) => state.users.data);
    const reviews = useSelector((state) => state.reviews.data);
    useEffect(() => {
        dispatch(fetchProducts()).catch(() => null);
        dispatch(fetchUsers()).catch(() => null);
        dispatch(fetchReviews()).catch(() => null);
    }, [dispatch]);
    return <main className="container-fluid py-5 px-4">
        <div className="mb-5">
            <span className="eyebrow">Overview</span>
            <h1 className="display-5 mt-2 mb-2">Good morning, admin.</h1>
            <p className="text-muted mb-0">Keep a clear view of the store and its customer feedback.</p>
        </div>
        <div className="row g-3">
            <div className="col-lg-4"><div className="card h-100 border-0 border-top border-4 border-danger rounded-0 shadow-sm p-4"><span className="text-muted small text-uppercase fw-bold">Catalog</span><strong className="display-6 my-3">{products.length}</strong><small className="text-muted">Products in store</small></div></div>
            <div className="col-lg-4"><div className="card h-100 border-0 border-top border-4 border-success rounded-0 shadow-sm p-4"><span className="text-muted small text-uppercase fw-bold">Community</span><strong className="display-6 my-3">{users.length}</strong><small className="text-muted">Registered users</small></div></div>
            <div className="col-lg-4"><div className="card h-100 border-0 border-top border-4 border-warning rounded-0 shadow-sm p-4"><span className="text-muted small text-uppercase fw-bold">Feedback</span><strong className="display-6 my-3">{reviews.length}</strong><small className="text-muted">Reviews in workspace</small></div></div>
        </div>
        <section className="bg-success-subtle mt-3 p-4"><span className="eyebrow">Quick check</span><h2 className="h3 mt-2">Small details, better storefront.</h2><p className="text-muted mb-0">Review product visibility, keep customer accounts tidy, and surface useful feedback from the admin navigation.</p></section>
    </main>;
}

export default Dashboard;