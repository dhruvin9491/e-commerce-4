import Swal from "sweetalert2";
import { toast } from "react-toastify";
import i18n from "../i18n";

export const getInputClass = (formik, name) => {
    if (!formik.touched[name]) return "form-control";
    return formik.errors[name]
        ? "form-control is-invalid"
        : "form-control is-valid";
};

export const showToast = (type, message) => toast[type](message);

export const confirmAction = async ({
    title,
    text,
    confirmButtonText = i18n.t('confirm'),
    icon = "warning"
}) => {
    const result = await Swal.fire({
        title,
        text,
        icon,
        showCancelButton: true,
        confirmButtonText,
        cancelButtonText: i18n.t('cancel'),
        confirmButtonColor: "#e65d45",
        cancelButtonColor: "#71807b",
        customClass: {
            popup: "shoplane-alert",
            title: "shoplane-alert__title",
            htmlContainer: "shoplane-alert__text"
        },
        reverseButtons: true,
        focusCancel: true
    });

    return result.isConfirmed;
};