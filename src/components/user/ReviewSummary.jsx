import React from "react";

function ReviewSummary({ reviews = [], compact = false }) {
    const reviewCount = reviews.length;
    const averageRating = reviewCount
        ? reviews.reduce((total, review) => total + Number(review.ratting || 0), 0) / reviewCount
        : 0;
    const roundedRating = Math.round(averageRating);

    return (
        <div className={`review-summary ${compact ? "review-summary--compact" : ""}`} aria-label={`${averageRating.toFixed(1)} out of 5 stars from ${reviewCount} reviews`}>
            <span className="review-summary__stars" aria-hidden="true">
                {Array.from({ length: 5 }, (_, index) => index < roundedRating ? "★" : "☆").join("")}
            </span>
            <strong>{averageRating ? averageRating.toFixed(1) : "New"}</strong>
            <span>({reviewCount} {reviewCount === 1 ? "review" : "reviews"})</span>
        </div>
    );
}

export default ReviewSummary;