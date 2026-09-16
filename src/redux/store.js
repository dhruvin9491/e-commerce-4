import { applyMiddleware, createStore } from "redux";
import reviewReducer from "./reducers/reviewReducer";

const thunkMiddleware = ({ dispatch }) => (next) => (action) =>
	typeof action === 'function' ? action(dispatch) : next(action);

const store = createStore(reviewReducer, applyMiddleware(thunkMiddleware));

export default store;