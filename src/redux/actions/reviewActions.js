import { REVIEW_ACTION } from "../../constants/ActionConstant";
import { REVIEW_API } from "../../constants/ApiConstant";
import { createData, getData, updateData } from "../../helper/ApiHelper";

const dispatchError = (dispatch, type, error) => {
    dispatch({ type, payload: error.message || "Internal server error" });
    throw error;
};

export const fetchReviews = () => async (dispatch) => {
    try {
        dispatch({ type: REVIEW_ACTION.FETCH_LOADING });
        const response = await getData(REVIEW_API);
        dispatch({ type: REVIEW_ACTION.FETCH_SUCCESS, payload: response.data });
        return response.data;
    } catch (error) {
        return dispatchError(dispatch, REVIEW_ACTION.FETCH_ERROR, error);
    }
};

export const createReview = (review) => async (dispatch) => {
    try {
        dispatch({ type: REVIEW_ACTION.CREATE_LOADING });
        const response = await createData(REVIEW_API, review);
        dispatch({ type: REVIEW_ACTION.CREATE_SUCCESS, payload: response.data });
        return response.data;
    } catch (error) {
        return dispatchError(dispatch, REVIEW_ACTION.CREATE_ERROR, error);
    }
};

export const updateReview = (review) => async (dispatch) => {
    try {
        dispatch({ type: REVIEW_ACTION.UPDATE_LOADING });
        const payload = { ...review, updatedAt: new Date().toISOString() };
        const response = await updateData(`${REVIEW_API}/${review.id}`, payload);
        dispatch({ type: REVIEW_ACTION.UPDATE_SUCCESS, payload: response.data });
        return response.data;
    } catch (error) {
        return dispatchError(dispatch, REVIEW_ACTION.UPDATE_ERROR, error);
    }
};

export const toggleReviewVisibility = (review) => async (dispatch) => {
    try {
        dispatch({ type: REVIEW_ACTION.VISIBILITY_LOADING });
        const payload = { ...review, isActive: !review.isActive, updatedAt: new Date().toISOString() };
        const response = await updateData(`${REVIEW_API}/${review.id}`, payload);
        dispatch({ type: REVIEW_ACTION.VISIBILITY_SUCCESS, payload: response.data });
        return response.data;
    } catch (error) {
        return dispatchError(dispatch, REVIEW_ACTION.VISIBILITY_ERROR, error);
    }
};

export const toggleReviewDeleted = (review) => async (dispatch) => {
    try {
        dispatch({ type: REVIEW_ACTION.STATUS_LOADING });
        const payload = { ...review, isDeleted: !review.isDeleted, isActive: false, updatedAt: new Date().toISOString() };
        const response = await updateData(`${REVIEW_API}/${review.id}`, payload);
        dispatch({ type: REVIEW_ACTION.STATUS_SUCCESS, payload: response.data });
        return response.data;
    } catch (error) {
        return dispatchError(dispatch, REVIEW_ACTION.STATUS_ERROR, error);
    }
};