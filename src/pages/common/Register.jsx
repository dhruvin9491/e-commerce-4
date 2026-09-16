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

function Register() {
    const navigate = useNavigate();
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
                const { data } = await getData(`${USER_API}?email=${encodeURIComponent(values.email)}`);

                if (data.length) {
                    return showToast('error', 'An account with this email already exists');
                }

                await createData(USER_API, newUser);
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
                <form onSubmit={formik.handleSubmit}>
                    <div className="mb-3">
                        <Input name="firstname" type="text" placeholder="First name" formik={formik} />
                    </div>

                    <div className="mb-3">
                        <Input name="lastname" type="text" placeholder="Last name" formik={formik} />
                    </div>

                    <div className="mb-3">
                        <Input name="email" type="email" placeholder="Email" formik={formik} />
                    </div>

                    <div className="mb-3">
                        <Input name="password" type="password" placeholder="Password" formik={formik} />
                    </div>

                    <button className="btn btn-primary btn-block" type="submit">
                        Register
                    </button>

                    <p className="my-3 text-center">
                        Have an account?
                        <Link to={AUTH_ROUTE.LOGIN}> Sign in</Link>
                    </p>
                </form>
            </section>
        </main>
    );
}

export default Register;