import { toast } from "react-toastify";

export const getInputClass = (formik, name) => {
    if (!formik.touched[name]) return "form-control";
    return formik.errors[name]
        ? "form-control is-invalid"
        : "form-control is-valid";
};

export const showToast = (type, message) => toast[type](message);