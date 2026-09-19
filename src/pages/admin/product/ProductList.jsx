import React, { useEffect, useState } from 'react';
import { PRODUCT_API } from '../../../constants/ApiConstant';
import { deleteData, getData, updateData } from '../../../helper/ApiHelper';
import { useNavigate } from 'react-router-dom';
import { ADMIN_ROUTE } from '../../../constants/RoutesConstant';
import { showToast } from '../../../helper/UiHelper';
import AdminPageHeader from '../../../components/admin/AdminPageHeader';
import AdminToolbar from '../../../components/admin/AdminToolbar';
import AdminButton from '../../../components/admin/AdminButton';
import { IconButton, Tooltip } from '@mui/material';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import EditIcon from '@mui/icons-material/Edit';
import RateReviewIcon from '@mui/icons-material/RateReview';
import DeleteIcon from '@mui/icons-material/Delete';
import RestoreFromTrashIcon from '@mui/icons-material/RestoreFromTrash';
import AddIcon from '@mui/icons-material/Add';

function ProductList() {
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
        setLoading(true);
        updateData(`${PRODUCT_API}/${id}`, { updatedAt: new Date().toISOString(), isActive: !visibility })
            .then(() => {
                showToast("success", 'Product status updated');
                getProduct()
            })
            .catch(() => showToast("error", 'Failed to update product'))
            .finally(() => setLoading(false));
    }

    const deleteProduct = async (p) => {
        setLoading(true);
        deleteData(`${PRODUCT_API}/${p.id}`, p)
            .then(() => {
                showToast("success", p.isDeleted ? 'Product recovered successfully' : 'Product deleted successfully');
                getProduct()
            })
            .catch(() => showToast("error", 'Failed to update product status'))
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

    if (loading) return <h1 className='my-5 text-center text-success'>Loading products</h1>;

    if (error) return <h1 className='my-5 text-center text-danger'>{error || 'We could not load products'}</h1>

    return (
        <main className='admin-list-page'>
            <AdminPageHeader eyebrow="Catalog" title="Products" description="Manage what customers can discover in your store." count={filteredProducts.length || 0} action={(
                <AdminToolbar
                    search={search || ''}
                    onSearch={(value) => setSearch(value.toLowerCase())}
                    placeholder="Search products..."
                    hasFilters={Boolean(search || sortMode !== 'default')}
                    onReset={() => { setSearch(null); setSortMode('default'); }}
                >
                    <select value={sortMode} onChange={(event) => setSortMode(event.target.value)} className='form-control form-select'>
                        <option value="default">Default</option>
                        <option value="asce">Price: Low to High</option>
                        <option value="dsce">Price: High to Low</option>
                    </select>
                    <AdminButton onClick={() => navigate(ADMIN_ROUTE.PRODUCT_CREATE)}><AddIcon fontSize="small" /> Add product</AdminButton>
                </AdminToolbar>
            )} />
            <div className="admin-table-wrap">
            <table className="table align-middle mb-0 admin-table">
                <thead>
                    <tr>
                        <th>Id</th><th>Image</th><th>Title</th><th>Stock</th><th>Price</th><th className="admin-table__actions">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredProducts.length ? filteredProducts.map((p) =>
                        <tr key={p.id} className={p.isDeleted ? "text-muted" : ""}>
                            <td className="fw-semibold">{p.id}</td>
                            <td><div className="admin-table__image-wrap">
                                <img src={p.thumbnail} alt={p.title} className="admin-table__image" />
                            </div>
                            </td>
                            <td><strong>{p.title}</strong><small><span className={`status-badge ${p.isDeleted ? 'status-badge--inactive' : p.isActive ? 'status-badge--visible' : 'status-badge--hidden'}`}>{p.isDeleted ? 'Archived' : p.isActive ? 'Visible in store' : 'Hidden from store'}</span></small></td>
                            <td><span className="stock-badge">{p.stock} units</span></td>
                            <td><strong>₹{Number(p.price || 0).toLocaleString("en-IN")}</strong></td>
                            <td className="admin-table__actions">
                                <div className="admin-table__action-drawer">
                                    <Tooltip title="Actions">
                                        <IconButton className="admin-table__action-trigger" size="small" aria-label={`Actions for ${p.title}`}>
                                            <MoreHorizIcon fontSize="small" />
                                        </IconButton>
                                    </Tooltip>
                                    <div className="admin-table__action-tools">
                                        <Tooltip title={p.isActive ? 'Hide product' : 'Show product'}>
                                            <span><IconButton size="small" onClick={() => manageVisibility(p.id, p.isActive)} disabled={p.isDeleted} aria-label={p.isActive ? 'Hide product' : 'Show product'}>{p.isActive ? <VisibilityOffIcon fontSize="small" /> : <VisibilityIcon fontSize="small" />}</IconButton></span>
                                        </Tooltip>
                                        <Tooltip title="Edit product">
                                            <span><IconButton size="small" onClick={() => navigate(`${ADMIN_ROUTE.PRODUCT_UPDATE}/${p.id}`)} disabled={p.isDeleted} aria-label="Edit product"><EditIcon fontSize="small" /></IconButton></span>
                                        </Tooltip>
                                        <Tooltip title="Add review">
                                            <IconButton size="small" onClick={() => navigate(`${ADMIN_ROUTE.REVIEW_CREATE}/${p.id}`)} aria-label="Add review"><RateReviewIcon fontSize="small" /></IconButton>
                                        </Tooltip>
                                        <Tooltip title={p.isDeleted ? 'Restore product' : 'Delete product'}>
                                            <IconButton className="admin-table__icon--danger" size="small" onClick={() => deleteProduct(p)} aria-label={p.isDeleted ? 'Restore product' : 'Delete product'}>{p.isDeleted ? <RestoreFromTrashIcon fontSize="small" /> : <DeleteIcon fontSize="small" />}</IconButton>
                                        </Tooltip>
                                    </div>
                                </div>
                            </td>

                        </tr>) : <tr><td colSpan="6" className="review-table__empty">No products match the current filters.</td></tr>}
                </tbody>
            </table>
            </div>
        </main>
    );
}

export default ProductList;