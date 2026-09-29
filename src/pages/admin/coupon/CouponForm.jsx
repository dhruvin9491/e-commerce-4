import React from 'react';
import { useFormik } from 'formik';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import AdminButton from '../../../components/admin/AdminButton';
import AdminFormHeader from '../../../components/admin/AdminFormHeader';
import Input from '../../../components/common/Input';
import { ADMIN_ROUTE } from '../../../constants/RoutesConstant';
import { createCoupon, updateCoupon } from '../../../redux/actions/couponActions';
import { COUPON_FORM_INIT_DATA } from '../../../utils/InitFormData';
import { COUPON_YUP_SCHEMA } from '../../../utils/YupValidationSchema';
import { GenerateMetaData } from '../../../helper/DataGenrateHelper';

function CouponForm() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { id } = useParams();
    const coupon = useSelector((state) => state.coupons.data.find((item) => item.id === id));
    const today = new Date();
    const minimumExpiryDate = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;

    const formik = useFormik({
        initialValues: coupon ? {
            code: coupon.code,
            discountType: coupon.discountType,
            discountValue: coupon.discountValue,
            minimumOrder: coupon.minimumOrder,
            usageLimit: coupon.usageLimit,
            expiresAt: coupon.expiresAt,
        } : COUPON_FORM_INIT_DATA,
        validationSchema: COUPON_YUP_SCHEMA,
        onSubmit: (values) => {
            dispatch(createCoupon({
                ...GenerateMetaData(),
                ...values
            }));

            formik.resetForm();
            navigate(ADMIN_ROUTE.COUPON_LIST);
        },
    });

    return (
        <main className="admin-form-page">
            <AdminFormHeader
                eyebrow="Promotion management"
                title={coupon ? 'Edit coupon' : 'Create a coupon'}
                description="Set the offer terms and keep it ready for your next campaign."
                mode={coupon ? 'Editing' : 'New offer'}
            />
            <form className="admin-form" onSubmit={formik.handleSubmit}>
                <div className="admin-form__section">
                    <span className="product-form__kicker">01 / Offer</span>
                    <h2>Define the discount.</h2>
                    <div className="row g-3">
                        <div className="col-md-6">
                            <Input name="code" type="text" label="Coupon code" placeholder="e.g. WELCOME15" formik={formik} />
                        </div>
                        <div className="col-md-3">
                            <label className="form-label" htmlFor="discountType">Discount type</label>
                            <select id="discountType" name="discountType" className="form-select" value={formik.values.discountType} onChange={formik.handleChange} onBlur={formik.handleBlur}>
                                <option value="percentage">Percentage</option>
                                <option value="fixed">Fixed amount (₹)</option>
                            </select>
                        </div>
                        <div className="col-md-3">
                            <Input name="discountValue" type="number" step="0.01" label={formik.values.discountType === 'percentage' ? 'Discount (%)' : 'Discount (₹)'} placeholder="0" formik={formik} />
                        </div>
                    </div>
                </div>
                <div className="admin-form__section">
                    <span className="product-form__kicker">02 / Conditions</span>
                    <h2>Set the limits.</h2>
                    <div className="row g-3">
                        <div className="col-md-4"><Input name="minimumOrder" type="number" step="1" label="Minimum order (₹)" placeholder="0" formik={formik} /></div>
                        <div className="col-md-4"><Input name="usageLimit" type="number" step="1" label="Total uses allowed" placeholder="100" formik={formik} /></div>
                        <div className="col-md-4"><Input name="expiresAt" type="date" min={minimumExpiryDate} label="Expiry date" formik={formik} /></div>
                    </div>
                </div>
                <div className="admin-form__actions text-end">
                    <AdminButton type="button" variant="outlined" onClick={() => navigate(ADMIN_ROUTE.COUPON_LIST)}>Cancel</AdminButton>
                    <AdminButton type="submit">{coupon ? 'Save changes' : 'Create coupon'}</AdminButton>
                </div>
            </form>
        </main>
    );
}

export default CouponForm;