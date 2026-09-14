import React, { useEffect, useState } from 'react';
import { PRODUCT_API } from '../../../constants/ApiConstant';
import { deleteData, getData, updateData } from '../../../helper/ApiHelper';
import { useNavigate } from 'react-router-dom';
import { ADMIN_ROUTE } from '../../../constants/RoutesConstant';
import { confirmAction, showToast } from '../../../helper/UiHelper';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';

function ReviewList(props) {
    const [products, setProducts] = useState([]);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const [search, setSearch] = useState(null);
    const [sortMode, setSortMode] = useState("default");
    const { t } = useTranslation();

    const reviews = useSelector((state) => state.reviews);
    console.log(reviews);

    const getProduct = async () => {
        getData(PRODUCT_API)
            .then((res) => setProducts(res.data))
            .catch((error) => setError(error.message))
            .finally(() => setLoading(false));
    };

    const manageVisibility = async (id, visibility) => {
        const isConfirmed = await confirmAction({
            title: t(visibility ? 'confirm.deactivateTitle' : 'confirm.activateTitle'),
            text: t(visibility ? 'confirm.deactivateText' : 'confirm.activateText'),
            confirmButtonText: t(visibility ? 'confirm.deactivateButton' : 'confirm.activateButton')
        });

        if (!isConfirmed) return;

        setLoading(true);
        updateData(`${PRODUCT_API}/${id}`, { updatedAt: crypto.randomUUID(), isActive: !visibility })
            .then(() => {
                showToast("success", t('updateSuccess'));
                getProduct()
            })
            .catch(() => showToast("error", t('updateError')))
            .finally(() => setLoading(false));
    }

    const deleteProduct = async (p) => {
        const isConfirmed = await confirmAction({
            title: t(p.isDeleted ? 'confirm.recoverTitle' : 'confirm.deleteTitle'),
            text: t(p.isDeleted ? 'confirm.recoverText' : 'confirm.deleteText'),
            confirmButtonText: t(p.isDeleted ? 'confirm.recoverButton' : 'confirm.deleteButton')
        });

        if (!isConfirmed) return;

        setLoading(true);
        deleteData(`${PRODUCT_API}/${p.id}`, p)
            .then(() => {
                showToast("success", p.isDeleted ? t('recoveredSuccess') : t('deletedSuccess'));
                getProduct()
            })
            .catch(() => showToast("error", t('statusError')))
            .finally(() => setLoading(false));
    };

    const filteredProducts = [...products]
        .filter((p) => !search || p.title.toLowerCase().includes(search))
        .sort((a, b) => {
            if (sortMode === "asce") return a.price - b.price;
            if (sortMode === "dsce") return b.price - a.price;
            return 0;
        });
    useEffect(() => {
        getProduct();
    }, []);

    if (loading) return <h1 className='my-5 text-center text-success'>{t('productLoading')}</h1>;

    if (error) return <h1 className='my-5 text-center text-danger'>{error || t('productError')}</h1>

    return (
        <main className='product-list-page'>
            <div className='product-list-page__heading'>
                <div>
                    <p className='text-uppercase text-primary small mb-1'>{t('feedback')}</p>
                    <h1 className='h2 mb-0'>{t('Reviews')}
                        <span className='catalog-count'>{filteredProducts.length || 0} {t('shown')}</span>
                    </h1>
                </div>
                <div className='product-list-page__controls'>
                    {search && <button type='button' onClick={() => { setSearch(null); setSortMode("default") }} className='btn btn-outline-secondary text-nowrap'>{t('reset')}</button>}
                    <input type='search' placeholder={t('productSearch')} onChange={(e) => setSearch(e.target.value.toLowerCase())} className='form-control' value={search || ""} />
                    <button className='btn btn-primary text-nowrap' onClick={() => navigate(ADMIN_ROUTE.REVIEW_CREATE)}>{t('Add Review')}</button>
                </div>
            </div>
            <div className="product-table-wrap">
            <table className="table align-middle mb-0 product-table">
                <thead>
                    <tr>
                        <th>{t('id')}</th>
                        <th>{t('image')}</th>
                        <th>{t('productTitle')}</th>
                        <th>{t('stock')}</th>
                        <th>{t('price')}</th>
                        <th width={150}>{t('action')}</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredProducts.map((p) =>
                        <tr key={p.id} className={p.isDeleted ? "text-muted" : ""}>
                            <td className="fw-semibold">{p.id}</td>
                            <td><div className="product-table__image-wrap">
                                <img src={p.thumbnail} alt={p.title} className="product-table__image" />
                            </div>
                            </td>
                            <td><strong>{p.title}</strong><small>{p.isDeleted ? t('archived') : p.isActive ? t('visible') : t('hidden')}</small></td>
                            <td><span className="stock-badge">{p.stock} {t('units')}</span></td>
                            <td><strong>₹{Number(p.price || 0).toLocaleString("en-IN")}</strong></td>
                            <td>
                                <div className='btn-group'>
                                    <button className='btn btn-info'
                                        onClick={() => manageVisibility(p.id, p.isActive)}
                                        disabled={p.isDeleted}
                                    >{p.isActive ? t('deactivate') : t('active')}</button>
                                    <button className='btn btn-success'
                                        onClick={() => navigate(`${ADMIN_ROUTE.PRODUCT_UPDATE}/${p.id}`)}
                                        disabled={p.isDeleted}
                                    >{t('edit')}</button>
                                    <button className='btn btn-danger' onClick={() => deleteProduct(p)} >{p.isDeleted ? t('recover') : t('delete')}</button>
                                </div>
                            </td>

                        </tr>)}
                </tbody>
            </table>
            </div>
        </main>
    );
}

export default ReviewList;