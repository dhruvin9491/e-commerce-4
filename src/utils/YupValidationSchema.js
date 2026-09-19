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

export const REVIEW_FIELDS_YUP_SCHEMA = Yup.object({
    firstname: Yup.string().min(2).max(16).required(),
    lastname: Yup.string().min(2).max(16).required(),
    review: Yup.string().min(10).max(100).required(),
    ratting: Yup.number().min(0).max(5).required(),
});

export const REVIEW_YUP_SCHEMA = (productVerification = {}) => REVIEW_FIELDS_YUP_SCHEMA.shape({
    pid: Yup.string()
        .trim()
        .required('Product ID is required')
        .test('verified-product', function (productId) {
            const isVerified = productVerification.status === 'verified' && productVerification.id === productId;

            if (isVerified) return true;
            if (productVerification.status === 'not-found') {
                return this.createError({ message: 'No product found with this ID' });
            }
            if (productVerification.status === 'checking') {
                return this.createError({ message: 'Wait for product verification to finish' });
            }
            return this.createError({ message: 'Verify the product ID before adding the review' });
        }),
});

export const REVIEW_CLIENT_YUP_SCHEMA = REVIEW_FIELDS_YUP_SCHEMA.shape({
    pid: Yup.string().trim().required('Product is required'),
});