import React from 'react';
import { getInputClass } from '../../helper/UiHelper';

function Input({ name, type, placeholder, formik, label, step }) {
    return (
        <>
            {label && <label className="form-label" htmlFor={name}>{label}</label>}
            <input id={name} name={name} type={type} step={step} placeholder={placeholder}
                className={getInputClass(formik, name)}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values[name] ?? ''}
            />
            {formik.touched[name] && formik.errors[name] &&
                <span className="invalid-feedback">{formik.errors[name]}</span>}
        </>
    );
}

export default Input;