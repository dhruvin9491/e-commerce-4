import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

import Header from "../../components/user/Header";
import StoreFooter from "../../components/user/StoreFooter";
import Loader from "../../components/common/Loader";
import { PageState } from "../../components/common/PageState";
import { PRODUCT_API } from "../../constants/ApiConstant";
import { CLIENT_ROUTE } from "../../constants/RoutesConstant";
import { getData } from "../../helper/ApiHelper";
import { useSelector } from "react-redux";
import ReviewSummary from "../../components/user/ReviewSummary";
import RateReviewOutlinedIcon from '@mui/icons-material/RateReviewOutlined';

function StoreProductDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const { reviews } = useSelector((state) => state);
    const [error, setError] = useState("");

    useEffect(() => {
        getData(`${PRODUCT_API}/${id}`)
            .then(({ data }) => setProduct(data))
            .catch((requestError) => setError(requestError.message))
            .finally(() => setLoading(false));
    }, [id]);

    const filteredReviews = reviews.filter((r) => r.pid === id && r.isDeleted === false && r.isActive === true);

    return <>
        <Header />
        <main className="product-detail">
            {loading && <Loader label="Loading products" />}
            {!loading && error && <PageState title="Product unavailable" message={error} action={<Link className="button button--dark" to={CLIENT_ROUTE.STORE}>Back to store</Link>} />}
            {!loading && !error && product && (
                <>
                    <section className="product-detail__layout">
                        <div className="product-detail__image-wrap">
                            <img src={product.thumbnail} alt={product.title} className="product-detail__image" />
                        </div>
                        <div className="product-detail__content">
                            <span className="eyebrow">Shoplane collection</span>
                            <h1>{product.title}</h1>
                            <p className="product-detail__price">₹{Number(product.price || 0).toLocaleString("en-IN")}</p>
                            <ReviewSummary reviews={filteredReviews} />
                            <p className="product-detail__description">A considered everyday essential, selected for its simple utility and easy place in your routine.</p>
                            <div className="product-detail__facts">
                                <div><span>Availability</span><strong>{product.stock > 0 ? 'In stock' : 'Out of stock'}</strong></div>
                                <div><span>Quantity available</span><strong>{product.stock || 0}</strong></div>
                            </div>
                            <Link className="button button--dark" to={CLIENT_ROUTE.STORE}>Continue browsing <span aria-hidden="true">→</span></Link>
                        </div>
                    </section>
                    <section className="product-reviews">
                        <div className="section-heading">
                            <div>
                                <span className="eyebrow">Customer notes</span>
                                <h2>Reviews from the shelf.</h2>
                            </div>
                            <div className="product-reviews__actions">
                                <ReviewSummary reviews={filteredReviews} />
                                <button type="button" className="button button--dark" onClick={() => navigate(`${CLIENT_ROUTE.REVIEW}/${id}`)} ><RateReviewOutlinedIcon fontSize="small" aria-hidden="true" /> Add your review</button>
                            </div>
                        </div>
                        {filteredReviews.length > 0 ? (
                            <div className="product-reviews__grid">
                                {filteredReviews.map((review) => (
                                    <article className="product-review" key={review.id}>
                                        <ReviewSummary reviews={[review]} compact />
                                        <p>{review.review}</p>
                                        <strong>{review.firstname} {review.lastname}</strong>
                                    </article>
                                ))}
                            </div>
                        ) : <p className="product-reviews__empty">No published reviews yet. Be the first to share your experience.</p>}
                    </section>
                </>
            )}
        </main>
        <StoreFooter />
    </>;
}

export default StoreProductDetail;