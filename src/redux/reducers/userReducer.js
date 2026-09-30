import { USER_ACTION } from "../../constants/ActionConstant";

const initialValue = {
    data: [],
    loading: false,
    error: null
};

const userReducer = (state = initialValue, action) => {
    switch (action.type) {
        case USER_ACTION.FETCH_LOADING:
        case USER_ACTION.STATUS_LOADING:
        case USER_ACTION.REGISTER_LOADING:
        case USER_ACTION.LOGIN_LOADING:
            return { ...state, loading: true, error: null };
        case USER_ACTION.FETCH_ERROR:
        case USER_ACTION.STATUS_ERROR:
        case USER_ACTION.REGISTER_ERROR:
        case USER_ACTION.LOGIN_ERROR:
            return { ...state, loading: false, error: action.payload };
        case USER_ACTION.FETCH_SUCCESS:
            return { ...state, data: action.payload?.data || action.payload, loading: false };
        case USER_ACTION.STATUS_SUCCESS:
            return {
                ...state,
                data: state.data.map((user) => user.id === action.payload.id ? action.payload : user),
                loading: false
            };
        case USER_ACTION.REGISTER_SUCCESS:
            return { ...state, data: [...state.data, action.payload], loading: false };
        case USER_ACTION.LOGIN_SUCCESS:
            return { ...state, loading: false };
        default:
            return state;
    }
};

export default userReducer;