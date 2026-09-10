import { useFormik } from 'formik';
import React from 'react';
import Input from '../../components/common/Input';
import { Link, useNavigate } from 'react-router-dom';
import { ADMIN_ROUTE, AUTH_ROUTE, CLIENT_ROUTE } from '../../constants/RoutesConstant';
import { ROLES } from '../../constants/CommonConstant';
import { LOGIN_FORM_INIT_DATA } from '../../utils/InitFormData';
import { LOGIN_YUP_SCHEMA } from '../../utils/YupValidationSchema';
import { getData } from '../../helper/ApiHelper';
import { USER_API } from '../../constants/ApiConstant';
import { useAuth } from '../../helper/AuthHelper';
import { showToast } from '../../helper/UiHelper';
import { useTranslation } from 'react-i18next';

function Login() {
    const navigate = useNavigate();
    const { login } = useAuth();
    const { t } = useTranslation();

    const formik = useFormik({
        initialValues: LOGIN_FORM_INIT_DATA,
        validationSchema: LOGIN_YUP_SCHEMA,
        onSubmit: async (values) => {
            try {
                const { data } = await getData(`${USER_API}?email=${encodeURIComponent(values.email)}`);
                const foundUser = data[0];

                if (!foundUser || foundUser.password !== values.password) {
                    return showToast('error', t('invalidCredentials'));
                }

                if (foundUser.isDeleted) {
                    return showToast('warning', t('inactiveAccount'));
                }

                login(foundUser);
                showToast('success', t('loginSuccess'));
                navigate(foundUser.role === ROLES.ADMIN ? ADMIN_ROUTE.DASHBOARD : CLIENT_ROUTE.HOME);
            } catch (error) {
                showToast('error', error.message);
            }
        }
    });

    return (
        <main className="auth-screen">
            <section className="auth-panel">
                <form onSubmit={formik.handleSubmit}>
                    <div className="mb-3">
                        <Input name="email" type="email" placeholder={t('email')} formik={formik} />
                    </div>

                    <div className="mb-3">
                        <Input name="password" type="password" placeholder={t('password')} formik={formik} />
                    </div>

                    <button className="btn btn-primary btn-block" type="submit">
                        {t('login')}
                    </button>

                    <p className="my-3 text-center">
                        {t('notMember')}
                        <Link to={AUTH_ROUTE.REGISTER}> {t('signup')}</Link>
                    </p>
                </form>
            </section>
        </main>
    );
}

export default Login;