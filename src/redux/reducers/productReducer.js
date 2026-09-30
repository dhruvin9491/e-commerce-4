import { PRODUCT_ACTION } from "../../constants/ActionConstant";

const initialValue = {
    data: [],
    loading: false,
    error: null
};

const productReducer = (state = initialValue, action) => {
    switch (action.type) {
        case PRODUCT_ACTION.FETCH_LOADING:
        case PRODUCT_ACTION.DETAIL_LOADING:
        case PRODUCT_ACTION.CREATE_LOADING:
        case PRODUCT_ACTION.UPDATE_LOADING:
        case PRODUCT_ACTION.VISIBILITY_LOADING:
        case PRODUCT_ACTION.STATUS_LOADING:
            return { ...state, loading: true, error: null };
        case PRODUCT_ACTION.FETCH_ERROR:
        case PRODUCT_ACTION.DETAIL_ERROR:
        case PRODUCT_ACTION.CREATE_ERROR:
        case PRODUCT_ACTION.UPDATE_ERROR:
        case PRODUCT_ACTION.VISIBILITY_ERROR:
        case PRODUCT_ACTION.STATUS_ERROR:
            return { ...state, loading: false, error: action.payload };
        case PRODUCT_ACTION.FETCH_SUCCESS:
            return { ...state, data: action.payload?.data || action.payload, loading: false };
        case PRODUCT_ACTION.DETAIL_SUCCESS:
            return {
                ...state,
                data: state.data.some((product) => product.id === action.payload.id)
                    ? state.data.map((product) => product.id === action.payload.id ? action.payload : product)
                    : [...state.data, action.payload],
                loading: false
            };
        case PRODUCT_ACTION.CREATE_SUCCESS:
            return { ...state, data: [...state.data, action.payload], loading: false };
        case PRODUCT_ACTION.UPDATE_SUCCESS:
        case PRODUCT_ACTION.VISIBILITY_SUCCESS:
        case PRODUCT_ACTION.STATUS_SUCCESS:
            return {
                ...state,
                data: state.data.map((product) => product.id === action.payload.id ? action.payload : product),
                loading: false
            };
        default:
            return state;
    }
};

export default productReducer;