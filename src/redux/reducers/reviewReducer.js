import { REVIEW_ACTION } from "../../constants/ActionConstant";

const initialValue = {
    reviews: [],
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
            return {
                ...state,
                reviews: [...state.reviews, action.payload]
            }
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