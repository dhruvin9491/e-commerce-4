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
import { useTranslation } from 'react-i18next';

function ProductForm(props) {
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { id } = useParams();
    const { t } = useTranslation();

    const formik = useFormik({
        initialValues: PRODUCT_FORM_INIT_DATA,
        validationSchema: PRODUCT_YUP_SCHEMA,
        onSubmit: async (values) => {
            const isConfirmed = await confirmAction({
                title: t(id ? 'confirm.updateTitle' : 'confirm.createTitle'),
                text: t(id ? 'confirm.updateText' : 'confirm.createText'),
                confirmButtonText: t(id ? 'confirm.updateButton' : 'confirm.createButton'),
                icon: "question"
            });

            if (!isConfirmed) return;

            setLoading(true);

            if (id) {
                updateData(`${PRODUCT_API}/${id}`, { updatedAt: crypto.randomUUID(), ...values })
                    .then(() => {
                        showToast("success", t('updateSuccess'));
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
                        showToast("success", t('createSuccess'));
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

    if (loading) return <h1 className='my-5 text-center text-success'>{t('loadingProduct')}</h1>;

    return (
        <main className="product-form-page">
            <div className="product-form-page__heading">
                <div>
                    <span className="eyebrow">{t('management')}</span>
                    <h1>{id ? t('update') : t('create')}</h1>
                    <p>{id ? t('updateDescription') : t('createDescription')}</p>
                </div>
                <span className="product-form-page__mode">{id ? t('editing') : t('newListing')}</span>
            </div>
            <div className="product-form-layout">
                <form className="product-form" onSubmit={formik.handleSubmit}>
                    <div className="product-form__section">
                        <span className="product-form__kicker">{t('basics')}</span>
                        <h2>{t('basicsTitle')}</h2>
                        <div className="mb-3">
                            <Input name="title" type='text' label={t('titleLabel')} placeholder={t('titlePlaceholder')} formik={formik} />
                        </div>
                    </div>
                    <div className="product-form__section">
                        <span className="product-form__kicker">{t('inventory')}</span>
                        <h2>{t('inventoryTitle')}</h2>
                        <div className="row g-3">
                            <div className="col-sm-6"><Input name="stock" type='number' step="1" label={t('stockLabel')} placeholder='0' formik={formik} /></div>
                            <div className="col-sm-6"><Input name="price" type='number' step="0.01" label={t('priceLabel')} placeholder='0.00' formik={formik} /></div>
                        </div>
                    </div>
                    <div className="product-form__section">
                        <span className="product-form__kicker">{t('presentation')}</span>
                        <h2>{t('presentationTitle')}</h2>
                        <Input name="thumbnail" type='url' label={t('imageLabel')} placeholder={t('imagePlaceholder')} formik={formik} />
                    </div>
                    <div className="product-form__actions">
                        <button className='btn btn-primary' type='submit'>{id ? t('productUpdateButton') : t('productCreateButton')}</button>
                    </div>
                </form>
                <aside className="product-form__preview">
                    <span className="eyebrow">{t('preview')}</span>
                    <div className="product-form__preview-image-wrap">
                        <img src={formik.values.thumbnail} alt={t('productPreview')} className="product-form__preview-image" />
                    </div>
                    <span className="product-card__category">{t('productCategory')}</span>
                    <h3>{formik.values.title || t('previewTitle')}</h3>
                    <div className="product-form__preview-meta">
                        <strong>₹{Number(formik.values.price || 0).toLocaleString("en-IN")}</strong>
                        <span>{formik.values.stock || 0} {t('inStock')}</span>
                    </div>
                </aside>
            </div>
        </main >
    );
}

export default ProductForm;