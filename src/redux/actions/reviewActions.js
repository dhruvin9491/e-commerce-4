import { REVIEW_ACTION } from "../../constants/ActionConstant";

export const createReview = (review) => ({
    type: REVIEW_ACTION.CREATE,
    payload: review
});

export const updateReview = (review) => ({
    type: REVIEW_ACTION.UPDATE,
    payload: { ...review, updatedAt: new Date().toISOString() }
});

export const toggleReviewVisibility = (review) => ({
    type: REVIEW_ACTION.VISIBILITY_UPDATED,
    payload: {
        ...review,
        isActive: !review.isActive,
        updatedAt: new Date().toISOString()
    }
});

export const toggleReviewDeleted = (review) => ({
    type: REVIEW_ACTION.STATUS_UPDATED,
    payload: {
        ...review,
        isDeleted: !review.isDeleted,
        isActive: false,
        updatedAt: new Date().toISOString()
    }
});