import React, { useEffect, useState } from 'react';

import Header from '../../components/user/Header';
import StoreFooter from '../../components/user/StoreFooter';
import { useAuth } from '../../helper/AuthHelper';
import { PRODUCT_API } from '../../constants/ApiConstant';
import { getData } from '../../helper/ApiHelper';
import { useSelector } from 'react-redux';
import ProductCard from '../../components/user/ProductCard';
import Loader from '../../components/common/Loader';
import { Link } from 'react-router-dom';
import { CLIENT_ROUTE } from '../../constants/RoutesConstant';

function StoreHome() {
    const { user } = useAuth();
    const reviews = useSelector((state) => state.reviews);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        getData(PRODUCT_API)
            .then(({ data }) => setProducts(data.filter((product) => !product.isDeleted && product.isActive)))
            .catch((requestError) => setError(requestError.message))
            .finally(() => setLoading(false));
    }, []);

    const getReviewStats = (product) => {
        const productReviews = reviews.filter((review) => review.pid === product.id && !review.isDeleted && review.isActive);
        const rating = productReviews.length
            ? productReviews.reduce((total, review) => total + Number(review.ratting || 0), 0) / productReviews.length
            : 0;
        return { reviewCount: productReviews.length, rating };
    };
    const latestProducts = [...products].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 4);
    const trendyProducts = [...products].sort((a, b) => getReviewStats(b).rating - getReviewStats(a).rating || getReviewStats(b).reviewCount - getReviewStats(a).reviewCount).slice(0, 4);
    const popularProducts = [...products].sort((a, b) => getReviewStats(b).reviewCount - getReviewStats(a).reviewCount || getReviewStats(b).rating - getReviewStats(a).rating).slice(0, 4);

    const shelf = (title, description, shelfProducts) => (
        <section className="home-shelf">
            <div className="section-heading">
                <div><span className="eyebrow">Curated for you</span><h2>{title}</h2><p>{description}</p></div>
                <Link className="text-button" to={CLIENT_ROUTE.STORE}>View all <span aria-hidden="true">→</span></Link>
            </div>
            <div className="product-grid">{shelfProducts.map((product) => <ProductCard key={product.id} product={product} />)}</div>
        </section>
    );
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
                {loading && <Loader label="Loading the latest collection" />}
                {!loading && error && <p className="home-error">{error}</p>}
                {!loading && !error && <>{shelf('Latest arrivals', 'Freshly added pieces worth a first look.', latestProducts)}{shelf('Most trendy', 'The highest-rated picks in the collection.', trendyProducts)}{shelf('Most popular', 'Loved by shoppers and reviewed often.', popularProducts)}</>}
            </main>

            <StoreFooter />
        </>
    );
}

export default StoreHome;