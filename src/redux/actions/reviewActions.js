import { REVIEW_ACTION } from "../../constants/ActionConstant";
import { PRODUCT_API } from "../../constants/ApiConstant";
import { getData } from "../../helper/ApiHelper";

export const createReview = (review) => ({
    type: REVIEW_ACTION.CREATE,
    payload: review
});

export const updateReview = (review) => ({
    type: REVIEW_ACTION.UPDATE,
    payload: { ...review, updatedAt: new Date().toISOString() }
});

export const getReviews = () => ({ type: REVIEW_ACTION.GET_ALL });

export const toggleReviewVisibility = (review) => ({
    type: REVIEW_ACTION.VISIBILITY_UPDATED,
    payload: {
        ...review,
        isActive: !review.isActive,
        updatedAt: new Date().toISOString()
    }
});

export const toggleReviewDeleted = (review) => ({
    type: REVIEW_ACTION.STATUS_UPDATED,
    payload: {
        ...review,
        isDeleted: !review.isDeleted,
        isActive: false,
        updatedAt: new Date().toISOString()
    }
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