import { USER_ACTION } from "../../constants/ActionConstant";
import { DEFAULT_ADMIN, ROLES } from "../../constants/CommonConstant";
import { USER_API } from "../../constants/ApiConstant";
import { createData, deleteData, getData, updateData } from "../../helper/ApiHelper";
import { GenerateMetaData } from "../../helper/DataGenrateHelper";

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

export const loginExternalUser = (profile) => async (dispatch) => {
    try {
        dispatch({ type: USER_ACTION.LOGIN_LOADING });

        const identity = profile.email
            ? { field: "email", value: profile.email }
            : { field: "phone", value: profile.phone };

        if (!identity.value) {
            throw new Error("The sign-in provider did not return an email address or phone number.");
        }

        const response = await getData(
            `${USER_API}?${identity.field}=${encodeURIComponent(identity.value)}`
        );
        const existingUser = response.data[0];

        if (existingUser?.isDeleted) {
            throw new Error("Your account is inactive. Contact an administrator.");
        }

        const timestamp = new Date().toISOString();
        const userData = existingUser
            ? {
                ...existingUser,
                name: existingUser.name || profile.name,
                email: existingUser.email || profile.email || "",
                phone: existingUser.phone || profile.phone || "",
                photoURL: existingUser.photoURL || profile.photoURL || "",
                authProvider: profile.authProvider,
                updatedAt: timestamp
            }
            : {
                ...GenerateMetaData(),
                name: profile.name,
                email: profile.email || "",
                phone: profile.phone || "",
                photoURL: profile.photoURL || "",
                authProvider: profile.authProvider,
                role: ROLES.USER
            };

        const result = existingUser
            ? await updateData(`${USER_API}/${existingUser.id}`, userData)
            : await createData(USER_API, userData);

        dispatch({ type: USER_ACTION.LOGIN_SUCCESS, payload: result.data });
        return result.data;
    } catch (error) {
        return dispatchError(dispatch, USER_ACTION.LOGIN_ERROR, error);
    }
};

export const ensureDefaultAdmin = () => async () => {
    const response = await getData(`${USER_API}?email=${encodeURIComponent(DEFAULT_ADMIN.email)}`);
    if (!response.data.length) await createData(USER_API, DEFAULT_ADMIN);
};