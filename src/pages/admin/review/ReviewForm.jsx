import { useFormik } from 'formik';
import React, { useEffect, useRef } from 'react';
import { REVIEW_FORM_INIT_DATA } from '../../../utils/InitFormData';
import { REVIEW_YUP_SCHEMA } from '../../../utils/YupValidationSchema';
import { ADMIN_ROUTE } from '../../../constants/RoutesConstant';
import { useNavigate, useParams } from 'react-router-dom';
import Input from '../../../components/common/Input';
import ReviewFormFields from '../../../components/common/ReviewFormFields';
import AdminFormHeader from '../../../components/admin/AdminFormHeader';
import AdminButton from '../../../components/admin/AdminButton';
import { GenerateMetaData } from '../../../helper/DataGenrateHelper';
import { useAuth } from '../../../helper/AuthHelper';
import { useDispatch, useSelector } from 'react-redux';
import { createReview, fetchReviews, updateReview } from '../../../redux/actions/reviewActions';
import { showToast } from '../../../helper/UiHelper';

function ReviewForm() {
    const navigate = useNavigate();
    const { user } = useAuth();
    const dispatch = useDispatch();
    const { id, pid } = useParams();
    const { data: reviews, loading: reviewsLoading } = useSelector((state) => state.reviews);
    const selectedReview = reviews.find((review) => review.id === id);
    const isEditMode = Boolean(id);
    const reviewFetchStarted = useRef(false);

    const formik = useFormik({
        enableReinitialize: true,
        initialValues: selectedReview || { ...REVIEW_FORM_INIT_DATA, pid: pid || '' },
        validationSchema: REVIEW_YUP_SCHEMA,
        onSubmit: async (values) => {
            const productId = values.pid?.trim();
            const reviewData = {
                ...(selectedReview || GenerateMetaData()),
                ...values,
                pid: productId,
                role: selectedReview?.role || user.role,
                isActive: selectedReview?.isActive ?? false,
            };

            try {
                await dispatch(isEditMode ? updateReview(reviewData) : createReview({ ...reviewData, isActive: false, isDeleted: false }));
                navigate(ADMIN_ROUTE.REVIEW_LIST);
            } catch (error) {
                showToast('error', error.message);
            }
        }
    });

    useEffect(() => {
        if (id && !selectedReview && !reviewFetchStarted.current) {
            reviewFetchStarted.current = true;
            dispatch(fetchReviews()).catch(() => null);
            return;
        }

        if (id && !selectedReview && reviewsLoading) return;

        if (id && !selectedReview) {
            navigate(ADMIN_ROUTE.REVIEW_LIST);
            return;
        }

    }, [id, selectedReview, reviewsLoading, dispatch, navigate]);

    return (
        <main className="admin-form-page">
            <AdminFormHeader eyebrow="Review management" title={isEditMode ? 'Edit review' : 'Add a review'} description="Capture customer feedback for a product." mode={isEditMode ? 'Edit review' : 'New review'} />
            <div className="admin-form-layout">
                <form className="admin-form" onSubmit={formik.handleSubmit}>
                    <div className="admin-form__section">
                        <ReviewFormFields formik={formik} />
                        <div className="row">
                            <div className="col-8 mb-3">
                                <label className="form-label" htmlFor="pid">Product ID</label>
                                <Input name="pid" type="text" placeholder="Product ID" formik={formik} />
                            </div>
                        </div>
                    </div>
                    <div className="admin-form__actions text-end">
                        <AdminButton type="submit">{isEditMode ? 'Save changes' : 'Add review'}</AdminButton>
                    </div>
                </form>
            </div>
        </main >
    );
}

export default ReviewForm;