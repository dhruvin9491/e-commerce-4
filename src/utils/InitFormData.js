export const REGISTER_FORM_INIT_DATA = {
    firstname: "",
    lastname: "",
    email: "",
    password: null
}

export const LOGIN_FORM_INIT_DATA = {
    email: "admin@gmail.com",
    password: "admin@123"
}

export const PRODUCT_FORM_INIT_DATA = {
    title: "",
    stock: null,
    price: null,
    thumbnail: "https://paystubusa.com/images/logo.webp"
}

export const COUPON_FORM_INIT_DATA = {
    code: "WELCOME100",
    discountType: "percentage",
    discountValue: 50,
    minimumOrder: 100,
    usageLimit: 10,
    expiresAt: "",
}

export const REVIEW_FORM_INIT_DATA = {
    firstname: "",
    lastname: "",
    review: "",
    ratting: 0,
    pid: "",
}