import { REVIEW_ACTION } from "../../constants/ActionConstant";

const initialValue = {
    reviews: JSON.parse(localStorage.getItem("reviews") || "[]"),
    productVerification: {
        status: 'idle',
        id: '',
        product: null,
        error: ''
    }
}

const reviewReducer = (state = initialValue, action) => {
    switch (action.type) {
        case REVIEW_ACTION.CREATE:
            const createdReviews = {
                ...state,
                reviews: [...state.reviews, action.payload]
            }

            localStorage.setItem("reviews", JSON.stringify(createdReviews.reviews));

            return createdReviews;
            
        case REVIEW_ACTION.UPDATE:
        case REVIEW_ACTION.VISIBILITY_UPDATED:
        case REVIEW_ACTION.STATUS_UPDATED:
            const updatedReview = {
                ...state,
                reviews: state.reviews.map((review) =>
                    review.id === action.payload.id ? action.payload : review
                )
            };

            localStorage.setItem("reviews", JSON.stringify(updatedReview.reviews));

            return updatedReview;

        case REVIEW_ACTION.GET_ALL:
            return state;

        case REVIEW_ACTION.VERIFY_PRODUCT:
            if (
                ['verified', 'not-found'].includes(action.payload.status) &&
                state.productVerification.id !== action.payload.id
            ) {
                return state;
            }
            return {
                ...state,
                productVerification: action.payload
            };

        default:
            return state;
    }
}

export default reviewReducer;