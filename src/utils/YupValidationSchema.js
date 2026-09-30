import * as Yup from "yup";

export const REGISTER_YUP_SCHEMA = Yup.object({
    firstname: Yup.string().min(2).max(56).required(),
    lastname: Yup.string().min(2).max(56).required(),
    email: Yup.string().email().required(),
    password: Yup.string().min(6).max(12).required()
});

export const LOGIN_YUP_SCHEMA = Yup.object({
    email: Yup.string().email().required(),
    password: Yup.string().min(6).max(12).required()
})

export const PRODUCT_YUP_SCHEMA = Yup.object({
    title: Yup.string().min(10).max(100).required(),
    stock: Yup.number().min(1).required(),
    price: Yup.number().min(1).required(),
    thumbnail: Yup.string().url().matches(
        /\.(jpeg|jpg|gif|png|webp|svg)$/i,
        'Must be a valid image URL (jpg, jpeg, png, gif, webp, svg)'
    ).required(),
})

export const COUPON_YUP_SCHEMA = Yup.object({
    code: Yup.string().trim().matches(/^[A-Z0-9_-]+$/i, "Use letters, numbers, hyphens, or underscores").min(3).max(24).required(),
    discountType: Yup.string().oneOf(["percentage", "fixed"]).required(),
    discountValue: Yup.number().positive().when("discountType", {
        is: "percentage",
        then: (schema) => schema.max(100, "Percentage cannot exceed 100"),
    }).required(),
    minimumOrder: Yup.number().min(0).required(),
    startsAt: Yup.date().typeError("Start date is required").required("Start date is required"),
    expiresAt: Yup.date().typeError("Expiry date is required").min(Yup.ref("startsAt"), "Expiry must be after the start date").required("Expiry date is required"),
    usageLimit: Yup.number().integer().min(1).required(),
    usageCount: Yup.number().integer().min(0).required(),
    perUserLimit: Yup.number().integer().min(1).required(),
})

export const REVIEW_FIELDS_YUP_SCHEMA = Yup.object({
    firstname: Yup.string().min(2).max(16).required(),
    lastname: Yup.string().min(2).max(16).required(),
    review: Yup.string().min(10).max(100).required(),
    ratting: Yup.number().min(0).max(5).required(),
});

export const REVIEW_YUP_SCHEMA = REVIEW_FIELDS_YUP_SCHEMA.shape({
    pid: Yup.string().trim().required('Product ID is required'),
});

export const REVIEW_CLIENT_YUP_SCHEMA = REVIEW_FIELDS_YUP_SCHEMA.shape({
    pid: Yup.string().trim().required('Product is required'),
});