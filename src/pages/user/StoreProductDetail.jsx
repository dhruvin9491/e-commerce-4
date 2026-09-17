import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

import Header from "../../components/user/Header";
import StoreFooter from "../../components/user/StoreFooter";
import Loader from "../../components/common/Loader";
import { PageState } from "../../components/common/PageState";
import { PRODUCT_API } from "../../constants/ApiConstant";
import { CLIENT_ROUTE } from "../../constants/RoutesConstant";
import { getData } from "../../helper/ApiHelper";
import { useSelector } from "react-redux";

function StoreProductDetail() {
    const { id } = useParams();
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
                            <p className="product-detail__description">A considered everyday essential, selected for its simple utility and easy place in your routine.</p>
                            <div className="product-detail__facts">
                                <div><span>Availability</span><strong>{product.stock > 0 ? 'In stock' : 'Out of stock'}</strong></div>
                                <div><span>Quantity available</span><strong>{product.stock || 0}</strong></div>
                            </div>
                            <Link className="button button--dark" to={CLIENT_ROUTE.STORE}>Continue browsing <span aria-hidden="true">→</span></Link>
                        </div>
                    </section>
                    <section className="py-5">
                        {
                            filteredReviews && filteredReviews.length > 0 ?
                                <div className="row">
                                    {
                                        filteredReviews.map((r) => (
                                            <div className="col-6">
                                                <p>{r.review}</p>
                                                <h3>{r.firstname} {r.lastname}</h3>
                                                <h1>{r.ratting}</h1>
                                            </div>
                                        ))
                                    }
                                </div>
                                :
                                <p>No Reviews for this product</p>
                        }
                    </section>
                </>
            )}
        </main>
        <StoreFooter />
    </>;
}

export default StoreProductDetail;