import { useFormik } from 'formik';
import React, { useEffect } from 'react';
import { REVIEW_FORM_INIT_DATA } from '../../../utils/InitFormData';
import { REVIEW_YUP_SCHEMA } from '../../../utils/YupValidationSchema';
import { ADMIN_ROUTE } from '../../../constants/RoutesConstant';
import { useNavigate, useParams } from 'react-router-dom';
import Input from '../../../components/common/Input';
import AdminFormHeader from '../../../components/admin/AdminFormHeader';
import RatingInput from '../../../components/admin/RatingInput';
import AdminButton from '../../../components/admin/AdminButton';
import { GenerateMetaData } from '../../../helper/DataGenrateHelper';
import { useAuth } from '../../../helper/AuthHelper';
import { useDispatch, useSelector } from 'react-redux';
import { createReview, verifyProduct } from '../../../redux/actions/reviewActions';

function ReviewForm() {
    const navigate = useNavigate();
    const { user } = useAuth();
    const dispatch = useDispatch();
    const { pid } = useParams();
    const productVerification = useSelector((state) => state.productVerification);

    const formik = useFormik({
        initialValues: REVIEW_FORM_INIT_DATA,
        validationSchema: () => REVIEW_YUP_SCHEMA(productVerification),
        onSubmit: (values) => {
            const productId = values.pid?.trim();

            dispatch(createReview({
                ...GenerateMetaData(),
                isActive: false,
                role: user.role,
                ...values,
                pid: productId
            }));

            navigate(ADMIN_ROUTE.REVIEW_LIST);
        }
    });

    useEffect(() => {
        if (!pid) return;

        formik.setFieldValue("pid", pid);
        dispatch(verifyProduct(pid));
    }, []);

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
            <AdminFormHeader eyebrow="Review management" title="Add a review" description="Capture customer feedback for a product." mode="New review" />
            <div className="admin-form-layout">
                <form className="admin-form" onSubmit={formik.handleSubmit}>
                    <div className="admin-form__section">
                        <div className='row'>
                            <div className="col-6 mb-3">
                                <Input name="firstname" type="text" label="First name" placeholder="First name" formik={formik} />
                            </div>
                            <div className="col-6 mb-3">
                                <Input name="lastname" type="text" label="Last name" placeholder="Last name" formik={formik} />
                            </div>
                            <div className="col-12 mb-3">
                                <Input name="review" textarea label="Review" placeholder="Share feedback..." formik={formik} />
                            </div>
                            <div className='col-4'>
                                <RatingInput value={formik.values.ratting} onChange={(rating) => formik.setFieldValue('ratting', rating)} error={formik.touched.ratting && formik.errors.ratting} />
                            </div>
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
                        <AdminButton type="submit">Add review</AdminButton>
                    </div>
                </form>
            </div>
        </main >
    );
}

export default ReviewForm;