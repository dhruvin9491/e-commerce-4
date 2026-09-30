import { COUPON_ACTION } from "../../constants/ActionConstant";

const initialValue = {
    data: [],
    loading: false,
    error: null
}

const couponReducer = (state = initialValue, action) => {
    switch (action.type) {
        case COUPON_ACTION.CREATE_LOADING: 
        case COUPON_ACTION.FETCH_LOADING:
        case COUPON_ACTION.VISIBILITY_LOADING:
        case COUPON_ACTION.UPDATE_LOADING:
        case COUPON_ACTION.STATUS_LOADING:
            return {
                ...state,
                loading: true,
                error: null
            }
        case COUPON_ACTION.CREATE_ERROR:
        case COUPON_ACTION.FETCH_ERROR:
        case COUPON_ACTION.VISIBILITY_ERROR:
        case COUPON_ACTION.UPDATE_ERROR:
        case COUPON_ACTION.STATUS_ERROR:
            return {
                ...state,
                loading: false,
                error: action.payload
            }
        case COUPON_ACTION.FETCH_SUCCESS:
            return {
                ...state,
                loading: false,
                data: action.payload?.data || action.payload,
            }
        case COUPON_ACTION.CREATE_SUCCESS:
            return {
                ...state,
                loading: false,
                data: [...state.data, action.payload]
            }
        case COUPON_ACTION.UPDATE_SUCCESS:
        case COUPON_ACTION.STATUS_SUCCESS:
        case COUPON_ACTION.VISIBILITY_SUCCESS: 
            return {
                ...state,
                loading: false,
                data: state.data.map((e) => e.id === action.payload.id ? action.payload : e)
            }
        default:
            return state;
    }
}

export default couponReducer;