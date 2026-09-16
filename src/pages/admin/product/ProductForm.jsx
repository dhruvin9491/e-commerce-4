import { useFormik } from 'formik';
import React, { useEffect, useState } from 'react';
import { PRODUCT_FORM_INIT_DATA } from '../../../utils/InitFormData';
import { PRODUCT_YUP_SCHEMA } from '../../../utils/YupValidationSchema';
import { ADMIN_ROUTE } from '../../../constants/RoutesConstant';
import { useNavigate, useParams } from 'react-router-dom';
import Input from '../../../components/common/Input';
import AdminFormHeader from '../../../components/admin/AdminFormHeader';
import AdminButton from '../../../components/admin/AdminButton';
import { GenerateMetaData } from '../../../helper/DataGenrateHelper';
import { createData, getData, updateData } from '../../../helper/ApiHelper';
import { PRODUCT_API } from '../../../constants/ApiConstant';
import { showToast } from '../../../helper/UiHelper';

function ProductForm() {
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { id } = useParams();

    const formik = useFormik({
        initialValues: PRODUCT_FORM_INIT_DATA,
        validationSchema: PRODUCT_YUP_SCHEMA,
        onSubmit: async (values) => {
            setLoading(true);

            if (id) {
                updateData(`${PRODUCT_API}/${id}`, { updatedAt: crypto.randomUUID(), ...values })
                    .then(() => {
                        showToast("success", 'Product updated successfully');
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
                        showToast("success", 'Product listed successfully.');
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

    if (loading) return <h1 className='my-5 text-center text-success'>Loading product</h1>;

    return (
        <main className="admin-form-page">
            <AdminFormHeader
                eyebrow="Catalog management"
                title={id ? 'Refine a product' : 'Add a product'}
                description={id ? 'Keep the catalog details accurate and useful.' : 'Give your next catalog item a clear, considered home.'}
                mode={id ? 'Editing' : 'New listing'}
            />
            <div className="admin-form-layout">
                <form className="admin-form" onSubmit={formik.handleSubmit}>
                    <div className="product-form__section">
                        <span className="product-form__kicker">01 / Basics</span>
                        <h2>What are you offering?</h2>
                        <div className="mb-3">
                            <Input name="title" type='text' label="Product title" placeholder="e.g. Daily ritual cleanser" formik={formik} />
                        </div>
                    </div>
                    <div className="product-form__section">
                        <span className="product-form__kicker">02 / Inventory</span>
                        <h2>Keep the numbers clear.</h2>
                        <div className="row g-3">
                            <div className="col-sm-6"><Input name="stock" type='number' step="1" label="Stock quantity" placeholder='0' formik={formik} /></div>
                            <div className="col-sm-6"><Input name="price" type='number' step="0.01" label="Price (₹)" placeholder='0.00' formik={formik} /></div>
                        </div>
                    </div>
                    <div className="product-form__section">
                        <span className="product-form__kicker">03 / Presentation</span>
                        <h2>Give it a strong first impression.</h2>
                        <Input name="thumbnail" type='url' label="Product image URL" placeholder="https://..." formik={formik} />
                    </div>
                    <div className="product-form__actions">
                        <AdminButton type="submit">{id ? 'Update product' : 'Create product'}</AdminButton>
                    </div>
                </form>
                <aside className="product-form__preview">
                    <span className="eyebrow">Live preview</span>
                    <div className="product-form__preview-image-wrap">
                        <img src={formik.values.thumbnail} alt="Product preview" className="product-form__preview-image" />
                    </div>
                    <span className="product-card__category">Featured product</span>
                    <h3>{formik.values.title || 'Your product title'}</h3>
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