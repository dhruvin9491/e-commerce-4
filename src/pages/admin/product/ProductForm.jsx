import { useFormik } from 'formik';
import React, { useEffect, useState } from 'react';
import { PRODUCT_FORM_INIT_DATA } from '../../../utils/InitFormData';
import { PRODUCT_YUP_SCHEMA } from '../../../utils/YupValidationSchema';
import { ADMIN_ROUTE } from '../../../constants/RoutesConstant';
import { useNavigate, useParams } from 'react-router-dom';
import Input from '../../../components/common/Input';
import { GenerateMetaData } from '../../../helper/DataGenrateHelper';
import { createData, getData, updateData } from '../../../helper/ApiHelper';
import { PRODUCT_API } from '../../../constants/ApiConstant';
import { confirmAction, showToast } from '../../../helper/UiHelper';
import { CONFIRM_TEXT, PRODUCT_TEXT, TOAST_TEXT } from '../../../constants/UiTextConstant';

function ProductForm(props) {
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { id } = useParams();

    const formik = useFormik({
        initialValues: PRODUCT_FORM_INIT_DATA,
        validationSchema: PRODUCT_YUP_SCHEMA,
        onSubmit: async (values) => {
            const isConfirmed = await confirmAction({
                ...(id ? CONFIRM_TEXT.product.update : CONFIRM_TEXT.product.create),
                icon: "question"
            });

            if (!isConfirmed) return;

            setLoading(true);

            if (id) {
                updateData(`${PRODUCT_API}/${id}`, { updatedAt: crypto.randomUUID(), ...values })
                    .then(() => {
                        showToast("success", TOAST_TEXT.product.updateSuccess);
                        navigate(ADMIN_ROUTE.PRODUCT_LIST);
                        formik.resetForm();
                    })
                    .catch((error) => showToast("error", error.message))
                    .finally(() => setLoading(false));
            } else {
                createData(PRODUCT_API, {
                    ...GenerateMetaData(),
                    isActive: false,
                    ...values
                })
                    .then(() => {
                        showToast("success", TOAST_TEXT.product.createSuccess);
                        navigate(ADMIN_ROUTE.PRODUCT_LIST);
                        formik.resetForm();
                    })
                    .catch((error) => showToast("error", error.message))
                    .finally(() => setLoading(false));
            }
        }
    });

    const getProduct = async (id) => {
        getData(`${PRODUCT_API}/${id}`)
            .then((res) => formik.setValues(res.data))
            .catch((error) => showToast("error", error.message))
            .finally(() => setLoading(false));
    }

    useEffect(() => {
        if (!id) return;
        getProduct(id);
    }, []);

    if (loading) return <h1 className='my-5 text-center text-success'>{PRODUCT_TEXT.form.loading}</h1>;

    return (
        <main className="product-form-page">
            <div className="product-form-page__heading">
                <div>
                    <span className="eyebrow">{PRODUCT_TEXT.form.eyebrow}</span>
                    <h1>{id ? PRODUCT_TEXT.form.updateTitle : PRODUCT_TEXT.form.createTitle}</h1>
                    <p>{id ? PRODUCT_TEXT.form.updateDescription : PRODUCT_TEXT.form.createDescription}</p>
                </div>
                <span className="product-form-page__mode">{id ? PRODUCT_TEXT.form.editing : PRODUCT_TEXT.form.newListing}</span>
            </div>
            <div className="product-form-layout">
                <form className="product-form" onSubmit={formik.handleSubmit}>
                    <div className="product-form__section">
                        <span className="product-form__kicker">{PRODUCT_TEXT.form.basics}</span>
                        <h2>{PRODUCT_TEXT.form.basicsTitle}</h2>
                        <div className="mb-3">
                            <Input name="title" type='text' label={PRODUCT_TEXT.form.titleLabel} placeholder={PRODUCT_TEXT.form.titlePlaceholder} formik={formik} />
                        </div>
                    </div>
                    <div className="product-form__section">
                        <span className="product-form__kicker">{PRODUCT_TEXT.form.inventory}</span>
                        <h2>{PRODUCT_TEXT.form.inventoryTitle}</h2>
                        <div className="row g-3">
                            <div className="col-sm-6"><Input name="stock" type='number' step="1" label={PRODUCT_TEXT.form.stockLabel} placeholder='0' formik={formik} /></div>
                            <div className="col-sm-6"><Input name="price" type='number' step="0.01" label={PRODUCT_TEXT.form.priceLabel} placeholder='0.00' formik={formik} /></div>
                        </div>
                    </div>
                    <div className="product-form__section">
                        <span className="product-form__kicker">{PRODUCT_TEXT.form.presentation}</span>
                        <h2>{PRODUCT_TEXT.form.presentationTitle}</h2>
                        <Input name="thumbnail" type='url' label={PRODUCT_TEXT.form.imageLabel} placeholder={PRODUCT_TEXT.form.imagePlaceholder} formik={formik} />
                    </div>
                    <div className="product-form__actions">
                        <button className='btn btn-primary' type='submit'>{id ? PRODUCT_TEXT.form.updateButton : PRODUCT_TEXT.form.createButton}</button>
                    </div>
                </form>
                <aside className="product-form__preview">
                    <span className="eyebrow">{PRODUCT_TEXT.form.preview}</span>
                    <div className="product-form__preview-image-wrap">
                        <img src={formik.values.thumbnail} alt="Product preview" className="product-form__preview-image" />
                    </div>
                    <span className="product-card__category">{PRODUCT_TEXT.form.category}</span>
                    <h3>{formik.values.title || PRODUCT_TEXT.form.previewTitle}</h3>
                    <div className="product-form__preview-meta">
                        <strong>₹{Number(formik.values.price || 0).toLocaleString("en-IN")}</strong>
                        <span>{formik.values.stock || 0} in stock</span>
                    </div>
                </aside>
            </div>
        </main >
    );
}

export default ProductForm;