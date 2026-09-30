import { useFormik } from 'formik';
import React from 'react';
import Input from '../../components/common/Input';
import { Link, useNavigate } from 'react-router-dom';
import { ADMIN_ROUTE, AUTH_ROUTE, CLIENT_ROUTE } from '../../constants/RoutesConstant';
import { ROLES } from '../../constants/CommonConstant';
import { LOGIN_FORM_INIT_DATA } from '../../utils/InitFormData';
import { LOGIN_YUP_SCHEMA } from '../../utils/YupValidationSchema';
import { useAuth } from '../../helper/AuthHelper';
import { showToast } from '../../helper/UiHelper';
import { useDispatch } from 'react-redux';
import { loginUser } from '../../redux/actions/userActions';

function Login() {
    const navigate = useNavigate();
    const { login } = useAuth();
    const dispatch = useDispatch();

    const formik = useFormik({
        initialValues: LOGIN_FORM_INIT_DATA,
        validationSchema: LOGIN_YUP_SCHEMA,
        onSubmit: async (values) => {
            try {
                const foundUser = await dispatch(loginUser(values));
                login(foundUser);
                showToast('success', 'Login successful');
                navigate(foundUser.role === ROLES.ADMIN ? ADMIN_ROUTE.DASHBOARD : CLIENT_ROUTE.HOME);
            } catch (error) {
                showToast(error.message.includes('inactive') ? 'warning' : 'error', error.message);
            }
        }
    });

    return (
        <main className="auth-screen">
            <section className="auth-panel">
                <form onSubmit={formik.handleSubmit}>
                    <div className="mb-3">
                        <Input name="email" type="email" placeholder="Email" formik={formik} />
                    </div>

                    <div className="mb-3">
                        <Input name="password" type="password" placeholder="Password" formik={formik} />
                    </div>

                    <button className="btn btn-primary btn-block" type="submit">
                        Login
                    </button>

                    <p className="my-3 text-center">
                        Not a member?
                        <Link to={AUTH_ROUTE.REGISTER}> Sign up</Link>
                    </p>
                </form>
            </section>
        </main>
    );
}

export default Login;