import axios from "axios";
import { COUPON_ACTION } from "../../constants/ActionConstant";

export const fetchCoupons = () => {
    return async (dispatch) => {
        try {
            dispatch({ type: COUPON_ACTION.FETCH_LOADING });
            
            const data = await axios.get("http://localhost:5000/coupons");

            if(!data) throw new Error("Faild to fetch coupons");

            dispatch({type: COUPON_ACTION.FETCH_SUCCESS, payload: data});

        } catch (error) {
            dispatch({type: COUPON_ACTION.FETCH_ERROR, payload: error.message || "Internal server error"});
        }
    };
};
