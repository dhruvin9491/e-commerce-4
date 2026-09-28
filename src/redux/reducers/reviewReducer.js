import { REVIEW_ACTION } from "../../constants/ActionConstant";

const initialValue = {
    data: JSON.parse(localStorage.getItem("reviews") || "[]")
};

const reviewReducer = (state = initialValue, action) => {
    switch (action.type) {
        case REVIEW_ACTION.CREATE:
            const createdReviews = {
                ...state,
                reviews: [...state.reviews.data, action.payload]
            };

            localStorage.setItem("reviews", JSON.stringify(createdReviews.reviews));

            return createdReviews;

        case REVIEW_ACTION.UPDATE:
        case REVIEW_ACTION.VISIBILITY_UPDATED:
        case REVIEW_ACTION.STATUS_UPDATED:
            const updatedReview = {
                ...state,
                reviews: state.reviews.data.map((review) =>
                    review.id === action.payload.id ? action.payload : review
                )
            };

            localStorage.setItem("reviews", JSON.stringify(updatedReview.reviews));

            return updatedReview;

        default:
            return state;
    }
};

export default reviewReducer;