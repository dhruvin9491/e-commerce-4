import React, { useEffect, useState } from 'react';
import { PRODUCT_API } from '../../../constants/ApiConstant';
import { deleteData, getData, updateData } from '../../../helper/ApiHelper';
import { useNavigate } from 'react-router-dom';
import { ADMIN_ROUTE } from '../../../constants/RoutesConstant';
import { confirmAction, showToast } from '../../../helper/UiHelper';
import { CONFIRM_TEXT, PRODUCT_TEXT, TOAST_TEXT } from '../../../constants/UiTextConstant';

function ProductList(props) {
    const [products, setProducts] = useState([]);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const [search, setSearch] = useState(null);
    const [sortMode, setSortMode] = useState("default");

    const getProduct = async () => {
        getData(PRODUCT_API)
            .then((res) => setProducts(res.data))
            .catch((error) => setError(error.message))
            .finally(() => setLoading(false));
    };

    const manageVisibility = async (id, visibility) => {
        const isConfirmed = await confirmAction({
            ...(visibility ? CONFIRM_TEXT.product.deactivate : CONFIRM_TEXT.product.activate)
        });

        if (!isConfirmed) return;

        setLoading(true);
        updateData(`${PRODUCT_API}/${id}`, { updatedAt: crypto.randomUUID(), isActive: !visibility })
            .then(() => {
                showToast("success", TOAST_TEXT.product.updateSuccess);
                getProduct()
            })
            .catch(() => showToast("error", TOAST_TEXT.product.updateError))
            .finally(() => setLoading(false));
    }

    const deleteProduct = async (p) => {
        const isConfirmed = await confirmAction({
            ...(p.isDeleted ? CONFIRM_TEXT.product.recover : CONFIRM_TEXT.product.delete)
        });

        if (!isConfirmed) return;

        setLoading(true);
        deleteData(`${PRODUCT_API}/${p.id}`, p)
            .then(() => {
                showToast("success", p.isDeleted ? TOAST_TEXT.product.recoveredSuccess : TOAST_TEXT.product.deletedSuccess);
                getProduct()
            })
            .catch(() => showToast("error", TOAST_TEXT.product.statusError))
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

    if (loading) return <h1 className='my-5 text-center text-success'>{PRODUCT_TEXT.list.loading}</h1>;

    if (error) return <h1 className='my-5 text-center text-danger'>{error || PRODUCT_TEXT.list.error}</h1>

    return (
        <main className='product-list-page'>
            <div className='product-list-page__heading'>
                <div>
                    <p className='text-uppercase text-primary small mb-1'>{PRODUCT_TEXT.list.eyebrow}</p>
                    <h1 className='h2 mb-0'>{PRODUCT_TEXT.list.title}
                        <span className='catalog-count'>{filteredProducts.length || 0} {PRODUCT_TEXT.list.shown}</span>
                    </h1>
                </div>
                <div className='product-list-page__controls'>
                    {search && <button type='button' onClick={() => { setSearch(null); setSortMode("default") }} className='btn btn-outline-secondary text-nowrap'>{PRODUCT_TEXT.list.reset}</button>}
                    <input type='search' placeholder={PRODUCT_TEXT.list.searchPlaceholder} onChange={(e) => setSearch(e.target.value.toLowerCase())} className='form-control' value={search || ""} />
                    <select value={sortMode} onChange={(e) => setSortMode(e.target.value)} className='form-control form-select'>
                            <option value={"default"}>Default</option>
                            <option value={"asce"}>Price: Low to High</option>
                            <option value={"dsce"}>Price: High to Low</option>
                    </select>
                    <button className='btn btn-primary text-nowrap' onClick={() => navigate(ADMIN_ROUTE.PRODUCT_CREATE)}>{PRODUCT_TEXT.list.add}</button>
                </div>
            </div>
            <div className="product-table-wrap">
            <table className="table align-middle mb-0 product-table">
                <thead>
                    <tr>
                        <th>Id</th>
                        <th>{PRODUCT_TEXT.list.image}</th>
                        <th>{PRODUCT_TEXT.list.titleColumn}</th>
                        <th>{PRODUCT_TEXT.list.stock}</th>
                        <th>{PRODUCT_TEXT.list.price}</th>
                        <th width={150}>{PRODUCT_TEXT.list.action}</th>
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
                            <td><strong>{p.title}</strong><small>{p.isDeleted ? PRODUCT_TEXT.list.archived : p.isActive ? PRODUCT_TEXT.list.visible : PRODUCT_TEXT.list.hidden}</small></td>
                            <td><span className="stock-badge">{p.stock} units</span></td>
                            <td><strong>₹{Number(p.price || 0).toLocaleString("en-IN")}</strong></td>
                            <td>
                                <div className='btn-group'>
                                    <button className='btn btn-info'
                                        onClick={() => manageVisibility(p.id, p.isActive)}
                                        disabled={p.isDeleted}
                                    >{p.isActive ? "De-Active" : "Active"}</button>
                                    <button className='btn btn-success'
                                        onClick={() => navigate(`${ADMIN_ROUTE.PRODUCT_UPDATE}/${p.id}`)}
                                        disabled={p.isDeleted}
                                    >Edit</button>
                                    <button className='btn btn-danger' onClick={() => deleteProduct(p)} >{p.isDeleted ? "Recover" : "Delete"}</button>
                                </div>
                            </td>

                        </tr>)}
                </tbody>
            </table>
            </div>
        </main>
    );
}

export default ProductList;