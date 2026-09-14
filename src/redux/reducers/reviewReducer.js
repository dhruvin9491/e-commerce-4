import { REVIEW_ACTION } from "../../constants/ActionConstant";

const initialValue = {
    reviews: []
}

const reviewReducer = (state = initialValue, action) => {
    switch (action.type) {
        case REVIEW_ACTION.CREATE:
            return {
                ...state,
                reviews: [...state.reviews, action.payload]
            }
        default:
            return state;
    }
}

export default reviewReducer;