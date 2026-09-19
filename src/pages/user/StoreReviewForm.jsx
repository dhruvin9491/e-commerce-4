import { useFormik } from 'formik';
import React, { useEffect, useState } from 'react';
import { REVIEW_FORM_INIT_DATA } from '../../utils/InitFormData';
import { REVIEW_CLIENT_YUP_SCHEMA } from '../../utils/YupValidationSchema';
import { useNavigate, useParams } from 'react-router-dom';
import ReviewFormFields from '../../components/common/ReviewFormFields';
import AdminButton from '../../components/admin/AdminButton';
import { GenerateMetaData } from '../../helper/DataGenrateHelper';
import { useAuth } from '../../helper/AuthHelper';
import { useDispatch } from 'react-redux';
import { createReview } from '../../redux/actions/reviewActions';
import Header from '../../components/user/Header';
import StoreFooter from '../../components/user/StoreFooter';
import { AUTH_ROUTE, CLIENT_ROUTE } from '../../constants/RoutesConstant';
import { showToast } from '../../helper/UiHelper';

function StoreReviewForm() {
    const navigate = useNavigate();
    const { user } = useAuth();
    const dispatch = useDispatch();
    const { pid } = useParams();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const formik = useFormik({
        initialValues: REVIEW_FORM_INIT_DATA,
        validationSchema: REVIEW_CLIENT_YUP_SCHEMA,
        onSubmit: (values) => {
            if (!user || isSubmitting) {
                return;
            }

            setIsSubmitting(true);
            const reviewData = {
                ...GenerateMetaData(),
                ...values,
                pid,
                role: user.role,
                isActive: false,
            };

            dispatch(createReview(reviewData));
            showToast('success', 'Review submitted for approval');
            navigate(`${CLIENT_ROUTE.PRODUCT}/${pid}`);
        }
    });

    useEffect(() => {
        if (!user) {
            navigate(AUTH_ROUTE.LOGIN);
            return;
        }

        formik.setValues((values) => ({
            ...values,
            firstname: user.firstname || '',
            lastname: user.lastname || '',
            pid,
        }));
    }, [user, pid, navigate]);

    return (
        <>
            <Header />
            <main className="admin-form-page">
                <div className="admin-form-layout">
                    <form className="admin-form" onSubmit={formik.handleSubmit}>
                        <div className="admin-form__section">
                            <ReviewFormFields formik={formik} disableAuthor />
                        </div>
                        <div className="admin-form__actions text-end">
                            <AdminButton type="submit" disabled={isSubmitting}>
                                {isSubmitting ? 'Submitting...' : 'Submit review'}
                            </AdminButton>
                        </div>
                    </form>
                </div>
            </main >
            <StoreFooter />
        </>


    );
}

export default StoreReviewForm;