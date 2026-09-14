import { createStore } from "redux";
import reviewReducer from "./reducers/reviewReducer";

const store = createStore(reviewReducer);

export default store;