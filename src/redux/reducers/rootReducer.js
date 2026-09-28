import { combineReducers } from "redux";
import couponReducer from "./couponReducer";
import reviewReducer from "./reviewReducer";

const rootReducer = combineReducers({
    coupons: couponReducer,
    reviews: reviewReducer
});

export default rootReducer;