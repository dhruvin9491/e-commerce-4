import React, { useEffect, useRef, useState } from 'react';
import { RecaptchaVerifier, signInWithPhoneNumber, signOut } from 'firebase/auth';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { auth } from '../../firebase';
import AuthPageHeader from '../../components/common/AuthPageHeader';
import { AUTH_PROVIDER, ROLES } from '../../constants/CommonConstant';
import { ADMIN_ROUTE, AUTH_ROUTE, CLIENT_ROUTE } from '../../constants/RoutesConstant';
import { useAuth } from '../../helper/AuthHelper';
import { showToast } from '../../helper/UiHelper';
import { loginExternalUser } from '../../redux/actions/userActions';

const PHONE_NUMBER_PATTERN = /^\+[1-9]\d{7,14}$/;
const OTP_LENGTH = 6;

export default function PhoneAuth() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { login } = useAuth();
    const recaptchaContainer = useRef(null);
    const recaptchaVerifier = useRef(null);
    const [phone, setPhone] = useState('');
    const [otp, setOtp] = useState('');
    const [confirmation, setConfirmation] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => () => {
        recaptchaVerifier.current?.clear();
        recaptchaVerifier.current = null;
    }, []);

    const getRecaptchaVerifier = () => {
        if (!recaptchaVerifier.current) {
            recaptchaVerifier.current = new RecaptchaVerifier(auth, recaptchaContainer.current, {
                size: 'invisible'
            });
        }
        return recaptchaVerifier.current;
    };

    const sendOtp = async (event) => {
        event.preventDefault();
        const normalizedPhone = phone.trim();

        if (!PHONE_NUMBER_PATTERN.test(normalizedPhone)) {
            showToast('warning', 'Enter a valid phone number with country code, for example +14155552671.');
            return;
        }

        setLoading(true);
        try {
            const result = await signInWithPhoneNumber(auth, normalizedPhone, getRecaptchaVerifier());
            setPhone(normalizedPhone);
            setConfirmation(result);
            showToast('success', 'A verification code was sent to your phone.');
        } catch (error) {
            recaptchaVerifier.current?.clear();
            recaptchaVerifier.current = null;
            showToast('error', error.message || 'Could not send the verification code.');
        } finally {
            setLoading(false);
        }
    };

    const verifyOtp = async (event) => {
        event.preventDefault();
        if (!confirmation || otp.length !== OTP_LENGTH) return;

        setLoading(true);
        let hasAuthenticatedWithPhone = false;
        try {
            const result = await confirmation.confirm(otp);
            hasAuthenticatedWithPhone = true;
            const firebaseUser = result.user;
            const appUser = await dispatch(loginExternalUser({
                name: firebaseUser.displayName || firebaseUser.phoneNumber,
                phone: firebaseUser.phoneNumber || phone,
                email: firebaseUser.email || '',
                photoURL: firebaseUser.photoURL || '',
                authProvider: AUTH_PROVIDER.PHONE
            }));

            login(appUser);
            showToast('success', 'Login successful.');
            navigate(appUser.role === ROLES.ADMIN ? ADMIN_ROUTE.DASHBOARD : CLIENT_ROUTE.HOME);
        } catch (error) {
            showToast('error', error.message || 'Could not verify the code.');
            if (hasAuthenticatedWithPhone) await signOut(auth);
        } finally {
            setLoading(false);
        }
    };

    const changePhone = () => {
        setConfirmation(null);
        setOtp('');
    };

    return (
        <main className="auth-screen">
            <section className="auth-panel">
                <AuthPageHeader
                    title={confirmation ? 'Verify your phone' : 'Sign in with phone'}
                    description={confirmation ? `We sent a one-time code to ${phone}.` : 'We will text you a one-time verification code.'}
                />
                <div ref={recaptchaContainer} />

                {!confirmation ? (
                    <form onSubmit={sendOtp}>
                        <div className="mb-3">
                            <label className="form-label" htmlFor="phone-number">Phone number</label>
                            <input
                                id="phone-number"
                                className="form-control"
                                type="tel"
                                autoComplete="tel"
                                placeholder="+14155552671"
                                value={phone}
                                onChange={(event) => setPhone(event.target.value)}
                                required
                            />
                        </div>
                        <button className="btn btn-primary w-100" type="submit" disabled={loading}>
                            {loading ? 'Sending code...' : 'Send verification code'}
                        </button>
                    </form>
                ) : (
                    <form onSubmit={verifyOtp}>
                        <div className="mb-3">
                            <label className="form-label" htmlFor="phone-otp">Verification code</label>
                            <input
                                id="phone-otp"
                                className="form-control"
                                type="text"
                                inputMode="numeric"
                                autoComplete="one-time-code"
                                pattern="[0-9]{6}"
                                maxLength={OTP_LENGTH}
                                value={otp}
                                onChange={(event) => setOtp(event.target.value.replace(/\D/g, '').slice(0, OTP_LENGTH))}
                                required
                            />
                        </div>
                        <button
                            className="btn btn-primary w-100"
                            type="submit"
                            disabled={loading || otp.length !== OTP_LENGTH}
                        >
                            {loading ? 'Verifying...' : 'Verify and sign in'}
                        </button>
                        <button className="btn btn-link w-100 mt-2" type="button" onClick={changePhone} disabled={loading}>
                            Use a different phone number
                        </button>
                    </form>
                )}

                <p className="auth-form__footer">
                    <Link to={AUTH_ROUTE.LOGIN}>Back to login</Link>
                </p>
            </section>
        </main>
    );
}
