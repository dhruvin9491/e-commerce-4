import { useFormik } from 'formik';
import React from 'react';
import Input from '../../components/common/Input';
import { Link, useNavigate } from 'react-router-dom';
import { AUTH_ROUTE } from '../../constants/RoutesConstant';
import { ROLES } from '../../constants/CommonConstant';
import { REGISTER_FORM_INIT_DATA } from '../../utils/InitFormData';
import { REGISTER_YUP_SCHEMA } from '../../utils/YupValidationSchema';
import { GenerateMetaData } from '../../helper/DataGenrateHelper';
import { createData, getData } from '../../helper/ApiHelper';
import { USER_API } from '../../constants/ApiConstant';
import { showToast } from '../../helper/UiHelper';
import { useTranslation } from 'react-i18next';

function Register() {
    const navigate = useNavigate();
    const { t } = useTranslation();
    const formik = useFormik({
        initialValues: REGISTER_FORM_INIT_DATA,
        validationSchema: REGISTER_YUP_SCHEMA,
        onSubmit: async (values) => {
            const newUser = {
                ...values,
                role: ROLES.USER,
                ...GenerateMetaData()
            };

            try {
                const { data } = await getData(`${USER_API}?email=${encodeURIComponent(values.email)}`);

                if (data.length) {
                    return showToast('error', t('duplicateAccount'));
                }

                await createData(USER_API, newUser);
                showToast('success', t('registrationSuccess'));
                navigate(AUTH_ROUTE.LOGIN);
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
                        <Input name="name" type="text" placeholder={t('name')} formik={formik} />
                    </div>

                    <div className="mb-3">
                        <Input name="email" type="email" placeholder={t('email')} formik={formik} />
                    </div>

                    <div className="mb-3">
                        <Input name="password" type="password" placeholder={t('password')} formik={formik} />
                    </div>

                    <button className="btn btn-primary btn-block" type="submit">
                        {t('register')}
                    </button>

                    <p className="my-3 text-center">
                        {t('haveAccount')}
                        <Link to={AUTH_ROUTE.LOGIN}> {t('signin')}</Link>
                    </p>
                </form>
            </section>
        </main>
    );
}

export default Register;