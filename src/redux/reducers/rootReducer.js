import { combineReducers } from "redux";
import couponReducer from "./couponReducer";
import reviewReducer from "./reviewReducer";
import productReducer from "./productReducer";
import userReducer from "./userReducer";

const rootReducer = combineReducers({
    coupons: couponReducer,
    reviews: reviewReducer,
    products: productReducer,
    users: userReducer
});

export default rootReducer;