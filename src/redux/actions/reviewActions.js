import { REVIEW_ACTION } from "../../constants/ActionConstant";
import { PRODUCT_API } from "../../constants/ApiConstant";
import { getData } from "../../helper/ApiHelper";

export const createReview = (review) => {
    return {
        payload: review,
        type: REVIEW_ACTION.CREATE
    }
}

export const getReviews = () => ({
    type: REVIEW_ACTION.GET_ALL
});

export const verifyProduct = (productId) => async (dispatch) => {
    const normalizedId = productId?.trim();

    if (!normalizedId) {
        dispatch({
            type: REVIEW_ACTION.VERIFY_PRODUCT,
            payload: { status: 'idle', id: '', product: null, error: '' }
        });
        return null;
    }

    dispatch({
        type: REVIEW_ACTION.VERIFY_PRODUCT,
        payload: { status: 'checking', id: normalizedId, product: null, error: '' }
    });

    try {
        const response = await getData(`${PRODUCT_API}/${encodeURIComponent(normalizedId)}`);
        dispatch({
            type: REVIEW_ACTION.VERIFY_PRODUCT,
            payload: { status: 'verified', id: normalizedId, product: response.data, error: '' }
        });
        return response.data;
    } catch (error) {
        dispatch({
            type: REVIEW_ACTION.VERIFY_PRODUCT,
            payload: { status: 'not-found', id: normalizedId, product: null, error: error.message }
        });
        return null;
    }
};