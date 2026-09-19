import React from 'react';
import { getInputClass } from '../../helper/UiHelper';

function Input({ name, type, placeholder, formik, label, step, textarea, mkDisabled }) {
    const fieldProps = {
        id: name,
        name,
        placeholder,
        className: getInputClass(formik, name),
        onChange: formik.handleChange,
        onBlur: formik.handleBlur,
        value: formik.values[name] ?? '',
        disabled: mkDisabled || false
    };

    return (
        <>
            {label && <label className="form-label" htmlFor={name}>{label}</label>}
            {textarea ? <textarea {...fieldProps} rows="5" /> : <input {...fieldProps} type={type} step={step} />}
            {formik.touched[name] && formik.errors[name] &&
                <span className="invalid-feedback">{formik.errors[name]}</span>}
        </>
    );
}

export default Input;