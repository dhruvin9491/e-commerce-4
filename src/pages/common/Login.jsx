import { useFormik } from 'formik';
import React, { useState } from 'react';
import Input from '../../components/common/Input';
import AuthPageHeader from '../../components/common/AuthPageHeader';
import { Link, useNavigate } from 'react-router-dom';
import { ADMIN_ROUTE, AUTH_ROUTE, CLIENT_ROUTE } from '../../constants/RoutesConstant';
import { AUTH_PROVIDER, ROLES } from '../../constants/CommonConstant';
import { LOGIN_FORM_INIT_DATA } from '../../utils/InitFormData';
import { LOGIN_YUP_SCHEMA } from '../../utils/YupValidationSchema';
import { useAuth } from '../../helper/AuthHelper';
import { showToast } from '../../helper/UiHelper';
import { useDispatch } from 'react-redux';
import { loginExternalUser, loginUser } from '../../redux/actions/userActions';
import { signInWithPopup, signOut } from 'firebase/auth';
import { auth, googleProvider } from '../../firebase';

function Login() {
    const navigate = useNavigate();
    const { login } = useAuth();
    const dispatch = useDispatch();
    const [googleLoading, setGoogleLoading] = useState(false);

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

    const handleGoogleLogin = async () => {
        setGoogleLoading(true);
        let hasAuthenticatedWithGoogle = false;
        try {
            const { user: googleUser } = await signInWithPopup(auth, googleProvider);
            hasAuthenticatedWithGoogle = true;

            if (!googleUser.email) {
                throw new Error('Google did not provide an email address.');
            }

            const appUser = await dispatch(loginExternalUser({
                name: googleUser.displayName || googleUser.email,
                email: googleUser.email,
                photoURL: googleUser.photoURL,
                authProvider: AUTH_PROVIDER.GOOGLE
            }));

            login(appUser);
            showToast('success', 'Login successful');
            navigate(appUser.role === ROLES.ADMIN ? ADMIN_ROUTE.DASHBOARD : CLIENT_ROUTE.HOME);
        } catch (error) {
            showToast('error', error.message || 'Google login failed.');
            if (hasAuthenticatedWithGoogle) await signOut(auth);
        } finally {
            setGoogleLoading(false);
        }
    };

    return (
        <main className="auth-screen">
            <section className="auth-panel">
                <AuthPageHeader title="Welcome back" description="Sign in to continue to your account." />
                <form onSubmit={formik.handleSubmit}>
                    <div className="mb-3">
                        <Input name="email" type="email" label="Email address" placeholder="you@example.com" formik={formik} />
                    </div>

                    <div className="mb-3">
                        <Input name="password" type="password" label="Password" placeholder="Enter your password" formik={formik} />
                    </div>

                    <button className="btn btn-primary w-100" type="submit">
                        Login
                    </button>

                    <p className="auth-form__footer">
                        Not a member?
                        <Link to={AUTH_ROUTE.REGISTER}> Sign up</Link>
                    </p>
                </form>
                <div className="d-grid gap-2 border-top mt-4 pt-3">
                    <span className="small text-center text-muted">Or continue with</span>
                    <button
                        onClick={handleGoogleLogin}
                        className="btn btn-primary w-100"
                        type="button"
                        disabled={googleLoading}
                    >
                        {googleLoading ? 'Connecting...' : 'Continue with Google'}
                    </button>
                    <button
                        onClick={() => navigate(AUTH_ROUTE.PHONE)}
                        className="btn btn-primary w-100"
                        type="button"
                    >
                        Continue with Phone
                    </button>
                </div>
            </section>
        </main>
    );
}

export default Login;