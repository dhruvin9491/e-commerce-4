import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import Inventory2OutlinedIcon from '@mui/icons-material/Inventory2Outlined';
import PeopleOutlinedIcon from '@mui/icons-material/PeopleOutlined';
import RateReviewOutlinedIcon from '@mui/icons-material/RateReviewOutlined';
import WarningAmberOutlinedIcon from '@mui/icons-material/WarningAmberOutlined';
import { ROLES } from '../../constants/CommonConstant';
import { ADMIN_ROUTE } from '../../constants/RoutesConstant';
import { fetchProducts } from '../../redux/actions/productActions';
import { fetchUsers } from '../../redux/actions/userActions';
import { fetchReviews } from '../../redux/actions/reviewActions';

const DASHBOARD_STATS = [
    {
        key: 'products',
        label: 'Products',
        description: 'Available in your catalog',
        icon: Inventory2OutlinedIcon,
        route: ADMIN_ROUTE.PRODUCT_LIST
    },
    {
        key: 'users',
        label: 'Customers',
        description: 'Active customer accounts',
        icon: PeopleOutlinedIcon,
        route: ADMIN_ROUTE.USER_LIST
    },
    {
        key: 'reviews',
        label: 'Reviews',
        description: 'Published customer reviews',
        icon: RateReviewOutlinedIcon,
        route: ADMIN_ROUTE.REVIEW_LIST
    }
];

function Dashboard() {
    const dispatch = useDispatch();
    const productsState = useSelector((state) => state.products);
    const usersState = useSelector((state) => state.users);
    const reviewsState = useSelector((state) => state.reviews);
    const products = productsState.data;
    const users = usersState.data;
    const reviews = reviewsState.data;

    useEffect(() => {
        dispatch(fetchProducts()).catch(() => {});
        dispatch(fetchUsers()).catch(() => {});
        dispatch(fetchReviews()).catch(() => {});
    }, [dispatch]);

    const productCount = products.filter((product) => !product.isDeleted && product.isActive).length;
    const customerCount = users.filter((user) => !user.isDeleted && user.role !== ROLES.ADMIN).length;
    const publishedReviewCount = reviews.filter((review) => !review.isDeleted && review.isActive).length;
    const lowStockCount = products.filter((product) => !product.isDeleted && product.stock < 10).length;
    const pendingReviewCount = reviews.filter((review) => !review.isDeleted && !review.isActive).length;
    const errors = [productsState.error, usersState.error, reviewsState.error].filter(Boolean);

    const statValues = {
        products: productsState.loading && !products.length ? '—' : productCount,
        users: usersState.loading && !users.length ? '—' : customerCount,
        reviews: reviewsState.loading && !reviews.length ? '—' : publishedReviewCount
    };

    return (
        <main className="admin-dashboard">
            <header className="admin-dashboard__heading">
                <div>
                    <span className="eyebrow">Store overview</span>
                    <h1>Dashboard</h1>
                    <p>A snapshot of your catalog, customers, and store activity.</p>
                </div>
                <Link className="button button--dark admin-dashboard__view-store" to="/">
                    View storefront <ArrowForwardIcon fontSize="small" />
                </Link>
            </header>

            {errors.length > 0 && (
                <div className="admin-dashboard__notice" role="alert">
                    Some dashboard data could not be loaded: {errors.join(' · ')}
                </div>
            )}

            <section className="admin-dashboard__stats" aria-label="Store statistics">
                {DASHBOARD_STATS.map(({ key, label, description, icon: Icon, route }) => (
                    <Link className={`admin-dashboard__stat admin-dashboard__stat--${key}`} to={route} key={key}>
                        <span className="admin-dashboard__stat-icon"><Icon /></span>
                        <span className="admin-dashboard__stat-copy">
                            <span className="admin-dashboard__stat-label">{label}</span>
                            <strong>{statValues[key]}</strong>
                            <span className="admin-dashboard__stat-description">{description}</span>
                        </span>
                        <ArrowForwardIcon className="admin-dashboard__stat-arrow" fontSize="small" />
                    </Link>
                ))}
            </section>

            <section className="admin-dashboard__lower">
                <div className="admin-dashboard__panel">
                    <div className="admin-dashboard__panel-heading">
                        <div>
                            <span className="eyebrow">Needs attention</span>
                            <h2>Store health</h2>
                        </div>
                        <WarningAmberOutlinedIcon aria-hidden="true" />
                    </div>
                    <Link to={ADMIN_ROUTE.PRODUCT_LIST} className="admin-dashboard__health-row">
                        <span>Products running low on stock</span>
                        <strong>{lowStockCount}</strong>
                    </Link>
                    <Link to={ADMIN_ROUTE.REVIEW_LIST} className="admin-dashboard__health-row">
                        <span>Reviews awaiting moderation</span>
                        <strong>{pendingReviewCount}</strong>
                    </Link>
                </div>

                <div className="admin-dashboard__panel admin-dashboard__shortcuts">
                    <span className="eyebrow">Shortcuts</span>
                    <h2>Get things done</h2>
                    <Link to={ADMIN_ROUTE.PRODUCT_CREATE}>Add a product <ArrowForwardIcon fontSize="small" /></Link>
                    <Link to={ADMIN_ROUTE.COUPON_CREATE}>Create a coupon <ArrowForwardIcon fontSize="small" /></Link>
                    <Link to={ADMIN_ROUTE.USER_LIST}>Manage customer accounts <ArrowForwardIcon fontSize="small" /></Link>
                </div>
            </section>
        </main>
    );
}

export default Dashboard;
