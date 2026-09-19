import { useFormik } from 'formik';
import React, { useEffect } from 'react';
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
import { createReview, updateReview, verifyProduct } from '../../../redux/actions/reviewActions';

function ReviewForm() {
    const navigate = useNavigate();
    const { user } = useAuth();
    const dispatch = useDispatch();
    const { id, pid } = useParams();
    const reviews = useSelector((state) => state.reviews);
    const selectedReview = reviews.find((review) => review.id === id);
    const isEditMode = Boolean(id);
    const productVerification = useSelector((state) => state.productVerification);

    const formik = useFormik({
        enableReinitialize: true,
        initialValues: selectedReview || REVIEW_FORM_INIT_DATA,
        validationSchema: () => REVIEW_YUP_SCHEMA(productVerification),
        onSubmit: (values) => {
            const productId = values.pid?.trim();
            const reviewData = {
                ...(selectedReview || GenerateMetaData()),
                ...values,
                pid: productId,
                role: selectedReview?.role || user.role,
                isActive: selectedReview?.isActive ?? false,
            };

            dispatch(isEditMode ? updateReview(reviewData) : createReview({ ...reviewData, isActive: false }));

            navigate(ADMIN_ROUTE.REVIEW_LIST);
        }
    });

    useEffect(() => {
        if (id && !selectedReview) {
            navigate(ADMIN_ROUTE.REVIEW_LIST);
            return;
        }

        const productId = pid || selectedReview?.pid;
        if (!productId) return;

        if (pid) formik.setFieldValue("pid", pid);
        dispatch(verifyProduct(productId));
    }, [id, pid, selectedReview, navigate, dispatch]);

    useEffect(() => {
        const productId = formik.values.pid?.trim() || '';
        if (productVerification.id && productVerification.id !== productId) {
            dispatch(verifyProduct(''));
        }
    }, [formik.values.pid, productVerification.id, dispatch]);

    useEffect(() => {
        formik.validateField('pid');
    }, [productVerification.status, productVerification.id]);

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
                                <div className="product-id-verification">
                                    <div className="product-id-verification__input">
                                        <Input name="pid" type="text" placeholder="Product ID" formik={formik} />
                                    </div>
                                    <AdminButton
                                        type="button"
                                        variant="outline-secondary"
                                        onClick={() => {
                                            formik.setFieldTouched('pid', true, true);
                                            if (!formik.values.pid?.trim()) {
                                                dispatch(verifyProduct(''));
                                                return;
                                            }
                                            dispatch(verifyProduct(formik.values.pid));
                                        }}
                                        disabled={productVerification.status === 'checking' || !formik.values.pid?.trim()}
                                    >
                                        {productVerification.status === 'checking' ? 'Verifying...' : 'Verify product ID'}
                                    </AdminButton>
                                </div>
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