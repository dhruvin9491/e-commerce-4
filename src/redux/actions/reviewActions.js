import { REVIEW_ACTION } from "../../constants/ActionConstant";

export const createReview = (product) => {
    return {
        payload: product,
        type: REVIEW_ACTION.CREATE
    }
}