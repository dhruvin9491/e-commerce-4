import { COUPON_ACTION } from "../../constants/ActionConstant";
import { COUPON_API } from "../../constants/ApiConstant";
import { createData, getData, updateData } from "../../helper/ApiHelper";

const dispatchError = (dispatch, type, error) => {
    dispatch({ type, payload: error.message || "Internal server error" });
    throw error;
};

const isCouponExpired = (coupon) => coupon.expiresAt && Date.parse(coupon.expiresAt) <= Date.now();

const normalizeCoupon = (coupon) => {
    const normalizeDate = (value, endOfDay = false) => {
        if (!value) return "";
        const dateValue = /^\d{4}-\d{2}-\d{2}$/.test(value)
            ? `${value}T${endOfDay ? "23:59:59.999" : "00:00:00.000"}Z`
            : value;
        return new Date(dateValue).toISOString();
    };

    return {
        id: coupon.id,
        code: coupon.code,
        discountType: coupon.discountType,
        discountValue: Number(coupon.discountValue),
        minimumOrder: Number(coupon.minimumOrder ?? 0),
        startsAt: normalizeDate(coupon.startsAt || coupon.createdAt),
        expiresAt: normalizeDate(coupon.expiresAt, true),
        usageLimit: Number(coupon.usageLimit ?? 0),
        usageCount: Number(coupon.usageCount ?? 0),
        perUserLimit: Number(coupon.perUserLimit ?? 1),
        isActive: coupon.isActive ?? !coupon.isDeleted,
        isDeleted: coupon.isDeleted ?? false,
        createdAt: coupon.createdAt,
        updatedAt: coupon.updatedAt,
    };
};

export const fetchCoupons = () => {
    return async (dispatch) => {
        try {
            dispatch({ type: COUPON_ACTION.FETCH_LOADING });

            const response = await getData(COUPON_API);
            const coupons = response.data.map(normalizeCoupon);
            const expiredCoupons = coupons.filter((coupon) => coupon.isActive && !coupon.isDeleted && isCouponExpired(coupon));
            const deactivatedCoupons = await Promise.all(expiredCoupons.map(async (coupon) => {
                const payload = { ...coupon, isActive: false, updatedAt: new Date().toISOString() };
                const updateResponse = await updateData(`${COUPON_API}/${coupon.id}`, payload);
                return updateResponse.data;
            }));
            const deactivatedById = new Map(deactivatedCoupons.map((coupon) => [coupon.id, coupon]));
            const updatedCoupons = coupons.map((coupon) => deactivatedById.get(coupon.id) || coupon);

            dispatch({ type: COUPON_ACTION.FETCH_SUCCESS, payload: updatedCoupons });
            return updatedCoupons;

        } catch (error) {
            return dispatchError(dispatch, COUPON_ACTION.FETCH_ERROR, error);
        }
    };
};

export const createCoupon = (coupon) => {
    return async (dispatch) => {
        try {
            dispatch({ type: COUPON_ACTION.CREATE_LOADING });

            const response = await createData(COUPON_API, coupon);

            dispatch({ type: COUPON_ACTION.CREATE_SUCCESS, payload: response.data });

        } catch (error) {
            return dispatchError(dispatch, COUPON_ACTION.CREATE_ERROR, error);
        }
    };
};


export const toggleCouponVisibility = (coupon) => {
    if (!coupon.isActive && isCouponExpired(coupon)) {
        return async (dispatch) => dispatchError(dispatch, COUPON_ACTION.VISIBILITY_ERROR, new Error("Expired coupons cannot be activated"));
    }
    const payload = {
        ...coupon,
        isActive: !coupon.isActive,
        updatedAt: new Date().toISOString()
    }
    return async (dispatch) => {
        try {
            dispatch({ type: COUPON_ACTION.VISIBILITY_LOADING });

            const response = await updateData(`${COUPON_API}/${payload.id}`, payload);

            dispatch({ type: COUPON_ACTION.VISIBILITY_SUCCESS, payload: response.data });

        } catch (error) {
            return dispatchError(dispatch, COUPON_ACTION.VISIBILITY_ERROR, error);
        }
    };
};

export const updateCoupon = (coupon) => async (dispatch) => {
    try {
        dispatch({ type: COUPON_ACTION.UPDATE_LOADING });
        const payload = {
            ...coupon,
            isActive: isCouponExpired(coupon) ? false : coupon.isActive,
            updatedAt: new Date().toISOString()
        };
        const response = await updateData(`${COUPON_API}/${coupon.id}`, payload);
        dispatch({ type: COUPON_ACTION.UPDATE_SUCCESS, payload: response.data });
        return response.data;
    } catch (error) {
        return dispatchError(dispatch, COUPON_ACTION.UPDATE_ERROR, error);
    }
};

export const toggleCouponDeleted = (coupon) => async (dispatch) => {
    const payload = { ...coupon, isDeleted: !coupon.isDeleted, isActive: false, updatedAt: new Date().toISOString() };
    try {
        dispatch({ type: COUPON_ACTION.STATUS_LOADING });
        const response = await updateData(`${COUPON_API}/${coupon.id}`, payload);
        dispatch({ type: COUPON_ACTION.STATUS_SUCCESS, payload: response.data });
        return response.data;
    } catch (error) {
        return dispatchError(dispatch, COUPON_ACTION.STATUS_ERROR, error);
    }
};
