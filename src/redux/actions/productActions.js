import { PRODUCT_ACTION } from "../../constants/ActionConstant";
import { PRODUCT_API } from "../../constants/ApiConstant";
import { createData, deleteData, getData, updateData } from "../../helper/ApiHelper";
import { createDocument, getCollection } from "../../helper/FirestoreHelper";

const dispatchError = (dispatch, type, error) => {
    dispatch({ type, payload: error.message || "Internal server error" });
    throw error;
};

export const fetchProducts = () => async (dispatch) => {
    try {
        dispatch({ type: PRODUCT_ACTION.FETCH_LOADING });
        // const response = await getData(PRODUCT_API);
        const response = await getCollection("products")
        dispatch({ type: PRODUCT_ACTION.FETCH_SUCCESS, payload: response });
        return response.data;
    } catch (error) {
        return dispatchError(dispatch, PRODUCT_ACTION.FETCH_ERROR, error);
    }
};

export const fetchProduct = (id) => async (dispatch) => {
    try {
        dispatch({ type: PRODUCT_ACTION.DETAIL_LOADING });
        const response = await getData(`${PRODUCT_API}/${id}`);
        dispatch({ type: PRODUCT_ACTION.DETAIL_SUCCESS, payload: response.data });
        return response.data;
    } catch (error) {
        return dispatchError(dispatch, PRODUCT_ACTION.DETAIL_ERROR, error);
    }
};

export const createProduct = (product) => async (dispatch) => {
    try {
        dispatch({ type: PRODUCT_ACTION.CREATE_LOADING });
        // const response = await createData(PRODUCT_API, product);
        const response = await createDocument("products", product);
        dispatch({ type: PRODUCT_ACTION.CREATE_SUCCESS, payload: response });
        // return response.data;
    } catch (error) {
        return dispatchError(dispatch, PRODUCT_ACTION.CREATE_ERROR, error);
    }
};

export const updateProduct = (product) => async (dispatch) => {
    try {
        dispatch({ type: PRODUCT_ACTION.UPDATE_LOADING });
        const payload = { ...product, updatedAt: new Date().toISOString() };
        const response = await updateData(`${PRODUCT_API}/${product.id}`, payload);
        dispatch({ type: PRODUCT_ACTION.UPDATE_SUCCESS, payload: response.data });
        return response.data;
    } catch (error) {
        return dispatchError(dispatch, PRODUCT_ACTION.UPDATE_ERROR, error);
    }
};

export const toggleProductVisibility = (product) => async (dispatch) => {
    try {
        dispatch({ type: PRODUCT_ACTION.VISIBILITY_LOADING });
        const payload = { ...product, isActive: !product.isActive, updatedAt: new Date().toISOString() };
        const response = await updateData(`${PRODUCT_API}/${product.id}`, payload);
        dispatch({ type: PRODUCT_ACTION.VISIBILITY_SUCCESS, payload: response.data });
        return response.data;
    } catch (error) {
        return dispatchError(dispatch, PRODUCT_ACTION.VISIBILITY_ERROR, error);
    }
};

export const toggleProductDeleted = (product) => async (dispatch) => {
    try {
        dispatch({ type: PRODUCT_ACTION.STATUS_LOADING });
        const response = await deleteData(`${PRODUCT_API}/${product.id}`, product);
        dispatch({ type: PRODUCT_ACTION.STATUS_SUCCESS, payload: response.data });
        return response.data;
    } catch (error) {
        return dispatchError(dispatch, PRODUCT_ACTION.STATUS_ERROR, error);
    }
};