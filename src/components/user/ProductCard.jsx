import React from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { CLIENT_ROUTE } from "../../constants/RoutesConstant";
import ReviewSummary from "./ReviewSummary";

function ProductCard({ product }) {
    const reviews = useSelector((state) => state.reviews)
        .filter((review) => review.pid === product.id && !review.isDeleted && review.isActive);

    return <article className={`product-card ${product.isDeleted ? "product-card--muted" : ""}`}>
        <div className="product-card__image-wrap">
            <img src={product.thumbnail} alt={product.title} className="product-card__image" />
            {!product.isDeleted && product.stock < 10 && <span className="status-pill status-pill--low">Low stock</span>}
        </div>
        <div className="product-card__body">
            <span className="product-card__category">Featured product</span>
            <h3>{product.title}</h3>
            <ReviewSummary reviews={reviews} compact />
            <div className="product-card__footer">
                <strong>₹{Number(product.price || 0).toLocaleString("en-IN")}</strong>
                <span>{product.stock || 0} in stock</span>
            </div>
            <Link className="product-card__link" to={`${CLIENT_ROUTE.PRODUCT}/${product.id}`}>
                View details <span aria-hidden="true">→</span>
            </Link>
        </div>
    </article>;
}

export default ProductCard;