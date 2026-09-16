import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

import Header from "../../components/user/Header";
import StoreFooter from "../../components/user/StoreFooter";
import Loader from "../../components/common/Loader";
import { PageState } from "../../components/common/PageState";
import { PRODUCT_API } from "../../constants/ApiConstant";
import { CLIENT_ROUTE } from "../../constants/RoutesConstant";
import { getData } from "../../helper/ApiHelper";

function StoreProductDetail() {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        getData(`${PRODUCT_API}/${id}`)
            .then(({ data }) => setProduct(data))
            .catch((requestError) => setError(requestError.message))
            .finally(() => setLoading(false));
    }, [id]);

    return <>
        <Header />
        <main className="product-detail">
            {loading && <Loader label="Loading products" />}
            {!loading && error && <PageState title="Product unavailable" message={error} action={<Link className="button button--dark" to={CLIENT_ROUTE.STORE}>Back to store</Link>} />}
            {!loading && !error && product && (
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
            )}
        </main>
        <StoreFooter />
    </>;
}

export default StoreProductDetail;