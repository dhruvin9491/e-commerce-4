import { REVIEW_ACTION } from "../../constants/ActionConstant";

const initialValue = {
    data: [],
    loading: false,
    error: null
};

const reviewReducer = (state = initialValue, action) => {
    switch (action.type) {
        case REVIEW_ACTION.FETCH_LOADING:
        case REVIEW_ACTION.CREATE_LOADING:
        case REVIEW_ACTION.UPDATE_LOADING:
        case REVIEW_ACTION.VISIBILITY_LOADING:
        case REVIEW_ACTION.STATUS_LOADING:
            return { ...state, loading: true, error: null };
        case REVIEW_ACTION.FETCH_ERROR:
        case REVIEW_ACTION.CREATE_ERROR:
        case REVIEW_ACTION.UPDATE_ERROR:
        case REVIEW_ACTION.VISIBILITY_ERROR:
        case REVIEW_ACTION.STATUS_ERROR:
            return { ...state, loading: false, error: action.payload };
        case REVIEW_ACTION.FETCH_SUCCESS:
            return { ...state, data: action.payload?.data || action.payload, loading: false };
        case REVIEW_ACTION.CREATE_SUCCESS:
            return { ...state, data: [...state.data, action.payload], loading: false };
        case REVIEW_ACTION.UPDATE_SUCCESS:
        case REVIEW_ACTION.VISIBILITY_SUCCESS:
        case REVIEW_ACTION.STATUS_SUCCESS:
            return {
                ...state,
                data: state.data.map((review) => review.id === action.payload.id ? action.payload : review),
                loading: false
            };

        default:
            return state;
    }
};

export default reviewReducer;