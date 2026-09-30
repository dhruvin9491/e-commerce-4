import { USER_ACTION } from "../../constants/ActionConstant";
import { DEFAULT_ADMIN } from "../../constants/CommonConstant";
import { USER_API } from "../../constants/ApiConstant";
import { createData, deleteData, getData } from "../../helper/ApiHelper";

const dispatchError = (dispatch, type, error) => {
    dispatch({ type, payload: error.message || "Internal server error" });
    throw error;
};

export const fetchUsers = () => async (dispatch) => {
    try {
        dispatch({ type: USER_ACTION.FETCH_LOADING });
        const response = await getData(USER_API);
        dispatch({ type: USER_ACTION.FETCH_SUCCESS, payload: response.data });
        return response.data;
    } catch (error) {
        return dispatchError(dispatch, USER_ACTION.FETCH_ERROR, error);
    }
};

export const toggleUserStatus = (user) => async (dispatch) => {
    try {
        dispatch({ type: USER_ACTION.STATUS_LOADING });
        const response = await deleteData(`${USER_API}/${user.id}`, user);
        dispatch({ type: USER_ACTION.STATUS_SUCCESS, payload: response.data });
        return response.data;
    } catch (error) {
        return dispatchError(dispatch, USER_ACTION.STATUS_ERROR, error);
    }
};

export const registerUser = (user) => async (dispatch) => {
    try {
        dispatch({ type: USER_ACTION.REGISTER_LOADING });
        const existingUsers = await getData(`${USER_API}?email=${encodeURIComponent(user.email)}`);
        if (existingUsers.data.length) throw new Error("An account with this email already exists");
        const response = await createData(USER_API, user);
        dispatch({ type: USER_ACTION.REGISTER_SUCCESS, payload: response.data });
        return response.data;
    } catch (error) {
        return dispatchError(dispatch, USER_ACTION.REGISTER_ERROR, error);
    }
};

export const loginUser = (credentials) => async (dispatch) => {
    try {
        dispatch({ type: USER_ACTION.LOGIN_LOADING });
        const response = await getData(`${USER_API}?email=${encodeURIComponent(credentials.email)}`);
        const user = response.data[0];
        if (!user || user.password !== credentials.password) throw new Error("Invalid email or password");
        if (user.isDeleted) throw new Error("Your account is inactive. Contact an administrator.");
        dispatch({ type: USER_ACTION.LOGIN_SUCCESS, payload: user });
        return user;
    } catch (error) {
        return dispatchError(dispatch, USER_ACTION.LOGIN_ERROR, error);
    }
};

export const ensureDefaultAdmin = () => async () => {
    const response = await getData(`${USER_API}?email=${encodeURIComponent(DEFAULT_ADMIN.email)}`);
    if (!response.data.length) await createData(USER_API, DEFAULT_ADMIN);
};