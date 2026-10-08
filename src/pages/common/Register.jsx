import { useFormik } from 'formik';
import React from 'react';
import Input from '../../components/common/Input';
import AuthPageHeader from '../../components/common/AuthPageHeader';
import { Link, useNavigate } from 'react-router-dom';
import { AUTH_ROUTE } from '../../constants/RoutesConstant';
import { ROLES } from '../../constants/CommonConstant';
import { REGISTER_FORM_INIT_DATA } from '../../utils/InitFormData';
import { REGISTER_YUP_SCHEMA } from '../../utils/YupValidationSchema';
import { GenerateMetaData } from '../../helper/DataGenrateHelper';
import { showToast } from '../../helper/UiHelper';
import { useDispatch } from 'react-redux';
import { registerUser } from '../../redux/actions/userActions';

function Register() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const formik = useFormik({
        initialValues: REGISTER_FORM_INIT_DATA,
        validationSchema: REGISTER_YUP_SCHEMA,
        onSubmit: async (values) => {
            const newUser = {
                ...values,
                name: `${values.firstname} ${values.lastname}`,
                role: ROLES.USER,
                ...GenerateMetaData()
            };

            try {
                await dispatch(registerUser(newUser));
                showToast('success', 'Registration successful');
                navigate(AUTH_ROUTE.LOGIN);
            } catch (error) {
                showToast('error', error.message);
            }
        }
    });

    return (
        <main className="auth-screen">
            <section className="auth-panel">
                <AuthPageHeader title="Create your account" description="Sign up to shop and keep track of your orders." />
                <form onSubmit={formik.handleSubmit}>
                    <div className="mb-3">
                        <Input name="firstname" type="text" label="First name" placeholder="First name" formik={formik} />
                    </div>

                    <div className="mb-3">
                        <Input name="lastname" type="text" label="Last name" placeholder="Last name" formik={formik} />
                    </div>

                    <div className="mb-3">
                        <Input name="email" type="email" label="Email address" placeholder="you@example.com" formik={formik} />
                    </div>

                    <div className="mb-3">
                        <Input name="password" type="password" label="Password" placeholder="Create a password" formik={formik} />
                    </div>

                    <button className="btn btn-primary w-100" type="submit">
                        Register
                    </button>

                    <p className="auth-form__footer">
                        Have an account?
                        <Link to={AUTH_ROUTE.LOGIN}> Sign in</Link>
                    </p>
                </form>
            </section>
        </main>
    );
}

export default Register;