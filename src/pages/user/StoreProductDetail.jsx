import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

import Header from "../../components/user/Header";
import StoreFooter from "../../components/user/StoreFooter";
import Loader from "../../components/common/Loader";
import { PageState } from "../../components/common/PageState";
import { PRODUCT_API } from "../../constants/ApiConstant";
import { CLIENT_ROUTE } from "../../constants/RoutesConstant";
import { getData } from "../../helper/ApiHelper";
import { STORE_TEXT } from "../../constants/UiTextConstant";

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
            {loading && <Loader label={STORE_TEXT.detail.loading} />}
            {!loading && error && <PageState title={STORE_TEXT.detail.unavailable} message={error} action={<Link className="button button--dark" to={CLIENT_ROUTE.STORE}>{STORE_TEXT.detail.back}</Link>} />}
            {!loading && !error && product && (
                <section className="product-detail__layout">
                    <div className="product-detail__image-wrap">
                        <img src={product.thumbnail} alt={product.title} className="product-detail__image" />
                    </div>
                    <div className="product-detail__content">
                        <span className="eyebrow">{STORE_TEXT.detail.category}</span>
                        <h1>{product.title}</h1>
                        <p className="product-detail__price">₹{Number(product.price || 0).toLocaleString("en-IN")}</p>
                        <p className="product-detail__description">{STORE_TEXT.detail.description}</p>
                        <div className="product-detail__facts">
                            <div><span>{STORE_TEXT.detail.availability}</span><strong>{product.stock > 0 ? STORE_TEXT.detail.inStock : STORE_TEXT.detail.outOfStock}</strong></div>
                            <div><span>{STORE_TEXT.detail.quantity}</span><strong>{product.stock || 0}</strong></div>
                        </div>
                        <Link className="button button--dark" to={CLIENT_ROUTE.STORE}>{STORE_TEXT.detail.continue} <span aria-hidden="true">→</span></Link>
                    </div>
                </section>
            )}
        </main>
        <StoreFooter />
    </>;
}

export default StoreProductDetail;