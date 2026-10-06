import React, { useEffect } from 'react';
import { useFormik } from 'formik';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import AdminButton from '../../../components/admin/AdminButton';
import AdminFormHeader from '../../../components/admin/AdminFormHeader';
import Input from '../../../components/common/Input';
import { ADMIN_ROUTE } from '../../../constants/RoutesConstant';
import { createCoupon, fetchCoupons, updateCoupon } from '../../../redux/actions/couponActions';
import { COUPON_FORM_INIT_DATA } from '../../../utils/InitFormData';
import { COUPON_YUP_SCHEMA } from '../../../utils/YupValidationSchema';
import { GenerateMetaData } from '../../../helper/DataGenrateHelper';
import { showToast } from '../../../helper/UiHelper';

const toDateTimeLocal = (value, endOfDay = false) => {
    if (!value) return '';
    const dateValue = /^\d{4}-\d{2}-\d{2}$/.test(value)
        ? `${value}T${endOfDay ? '23:59:59.999' : '00:00:00.000'}Z`
        : value;
    const date = new Date(dateValue);
    return new Date(date.getTime() - date.getTimezoneOffset() * 60000).toISOString().slice(0, 16);
};

function CouponForm() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { id } = useParams();
    const coupon = useSelector((state) => state.coupons.data.find((item) => item.id === id));
    const loading = useSelector((state) => state.coupons.loading);

    useEffect(() => {
        if (id && !coupon) dispatch(fetchCoupons()).catch((error) => showToast('error', error.message));
    }, [id, coupon, dispatch]);

    const formik = useFormik({
        initialValues: coupon ? {
            code: coupon.code,
            discountType: coupon.discountType,
            discountValue: coupon.discountValue,
            minimumOrder: coupon.minimumOrder,
            startsAt: toDateTimeLocal(coupon.startsAt || coupon.createdAt),
            expiresAt: toDateTimeLocal(coupon.expiresAt, true),
            usageLimit: coupon.usageLimit,
            usageCount: coupon.usageCount ?? 0,
            perUserLimit: coupon.perUserLimit ?? 1,
        } : COUPON_FORM_INIT_DATA,
        validationSchema: COUPON_YUP_SCHEMA,
        onSubmit: async (values) => {
            try {
                const couponData = {
                    ...GenerateMetaData(),
                    ...coupon,
                    ...values,
                    code: values.code.trim().toUpperCase(),
                    discountValue: Number(values.discountValue),
                    minimumOrder: Number(values.minimumOrder),
                    startsAt: new Date(values.startsAt).toISOString(),
                    expiresAt: new Date(values.expiresAt).toISOString(),
                    usageLimit: Number(values.usageLimit),
                    usageCount: Number(coupon?.usageCount ?? values.usageCount ?? 0),
                    perUserLimit: Number(values.perUserLimit),
                    isActive: coupon?.isActive ?? false,
                    isDeleted: coupon?.isDeleted ?? false,
                };
                if (coupon) {
                    await dispatch(updateCoupon(couponData));
                } else {
                    await dispatch(createCoupon(couponData));
                }
                formik.resetForm();
                navigate(ADMIN_ROUTE.COUPON_LIST);
            } catch (error) {
                showToast('error', error.message);
            }
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
                        <div className="col-md-5">
                            <Input name="code" type="text" label="Coupon code" placeholder="e.g. WELCOME15" formik={formik} />
                        </div>
                        <div className="col-md-3">
                            <label className="form-label" htmlFor="discountType">Discount type</label>
                            <select id="discountType" name="discountType" className="form-select" value={formik.values.discountType} onChange={formik.handleChange} onBlur={formik.handleBlur}>
                                <option value="percentage">Percentage</option>
                                <option value="fixed">Fixed amount (₹)</option>
                            </select>
                        </div>
                        <div className="col-md-4">
                            <Input name="discountValue" type="number" step="0.01" label={formik.values.discountType === 'percentage' ? 'Discount (%)' : 'Discount (₹)'} placeholder="0" formik={formik} />
                        </div>
                    </div>
                </div>
                <div className="admin-form__section">
                    <span className="product-form__kicker">02 / Conditions</span>
                    <h2>Set the limits.</h2>
                    <div className="row g-3">
                        <div className="col-md-6"><Input name="minimumOrder" type="number" step="1" label="Minimum order (₹)" placeholder="0" formik={formik} /></div>
                        <div className="col-md-6"><Input name="startsAt" type="datetime-local" label="Starts at" formik={formik} /></div>
                        <div className="col-md-6"><Input name="expiresAt" type="datetime-local" label="Expires at" formik={formik} /></div>
                        <div className="col-md-2"><Input name="usageLimit" type="number" step="1" label="Total uses" placeholder="100" formik={formik} /></div>
                        <div className="col-md-2"><Input name="usageCount" type="number" step="1" label="Used" formik={formik} mkDisabled /></div>
                        <div className="col-md-2"><Input name="perUserLimit" type="number" step="1" label="Per user" placeholder="1" formik={formik} /></div>
                    </div>
                </div>
                <div className="admin-form__actions text-end">
                    <AdminButton type="button" variant="outlined" onClick={() => navigate(ADMIN_ROUTE.COUPON_LIST)}>Cancel</AdminButton>
                    <AdminButton type="submit" disabled={loading}>{coupon ? 'Save changes' : 'Create coupon'}</AdminButton>
                </div>
            </form>
        </main>
    );
}

export default CouponForm;