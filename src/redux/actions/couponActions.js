import axios from "axios";
import { COUPON_ACTION } from "../../constants/ActionConstant";
import { COUPON_API } from "../../constants/ApiConstant";

export const fetchCoupons = () => {
    return async (dispatch) => {
        try {
            dispatch({ type: COUPON_ACTION.FETCH_LOADING });

            const response = await axios.get(COUPON_API);

            dispatch({ type: COUPON_ACTION.FETCH_SUCCESS, payload: response.data });

        } catch (error) {
            dispatch({ type: COUPON_ACTION.FETCH_ERROR, payload: error.message || "Internal server error" });
        }
    };
};

export const createCoupon = (coupon) => {
    return async (dispatch) => {
        try {
            dispatch({ type: COUPON_ACTION.CREATE_LOADING });

            const response = await axios.post(COUPON_API, coupon);

            dispatch({ type: COUPON_ACTION.CREATE_SUCCESS, payload: response.data });

        } catch (error) {
            dispatch({ type: COUPON_ACTION.CREATE_ERROR, payload: error.message || "Internal server error" });
        }
    };
};


export const toggleCouponVisibility = (coupon) => {
    const payload = {
        ...coupon,
        isDeleted: !coupon.isDeleted,
        updatedAt: new Date().toISOString()
    }
    return async (dispatch) => {
        try {
            dispatch({ type: COUPON_ACTION.VISIBILITY_LOADING });

            const response = await axios.patch(`${COUPON_API}/${payload.id}`, payload);

            dispatch({ type: COUPON_ACTION.VISIBILITY_SUCCESS, payload: response.data });

        } catch (error) {
            dispatch({ type: COUPON_ACTION.VISIBILITY_ERROR, payload: error.message || "Internal server error" });
        }
    };
};

// {
//     type: COUPON_ACTION.VISIBILITY_UPDATED,
//     payload: { ...coupon, isActive: !coupon.isActive, updatedAt: new Date().toISOString() },
// }
export const toggleCouponDeleted = (coupon) => ({
    type: COUPON_ACTION.STATUS_UPDATED,
    payload: { ...coupon, isDeleted: !coupon.isDeleted, isActive: false, updatedAt: new Date().toISOString() },
});
