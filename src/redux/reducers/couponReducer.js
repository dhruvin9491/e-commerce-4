import { COUPON_ACTION } from "../../constants/ActionConstant";

const initialValue = {
    data: [],
    loading: false,
    error: null
}

const couponReducer = (state = initialValue, action) => {
    switch (action.type) {
        case COUPON_ACTION.FETCH_LOADING:
            return {
                ...state,
                loading: true,
                error: null
            }
        case COUPON_ACTION.FETCH_ERROR:
            return {
                ...state,
                loading: false,
                error: action.payload
            }
        case COUPON_ACTION.FETCH_SUCCESS: {
            return {
                ...state,
                loading: false,
                data: [...state.data, action.payload]
            }
        }
        default:
            return state;
    }
}

export default couponReducer;