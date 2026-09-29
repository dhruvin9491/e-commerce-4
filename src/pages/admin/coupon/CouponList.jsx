import React, { useEffect, useMemo, useState } from 'react';
import { IconButton, Tooltip } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import RestoreFromTrashIcon from '@mui/icons-material/RestoreFromTrash';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import AdminButton from '../../../components/admin/AdminButton';
import AdminPageHeader from '../../../components/admin/AdminPageHeader';
import AdminToolbar from '../../../components/admin/AdminToolbar';
import { ADMIN_ROUTE } from '../../../constants/RoutesConstant';
import { fetchCoupons, toggleCouponVisibility } from '../../../redux/actions/couponActions';

function CouponList() {
    const coupons = useSelector((state) => state.coupons.data);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [search, setSearch] = useState('');
    const [status, setStatus] = useState('all');

    const filteredCoupons = useMemo(() => coupons
        .filter((coupon) => coupon.code.toLowerCase().includes(search.toLowerCase()))
        .filter((coupon) => status === 'all' || (status === 'archived' ? coupon.isDeleted : !coupon.isDeleted && String(coupon.isActive) === status)), [coupons, search, status]);

    const formatDiscount = (coupon) => coupon.discountType === 'percentage'
        ? `${coupon.discountValue}%`
        : `₹${Number(coupon.discountValue).toLocaleString('en-IN')}`;
    
    useEffect(() => {
        dispatch(fetchCoupons());
    }, []);

    return (
        <main className="admin-list-page">
            <AdminPageHeader eyebrow="Promotions" title="Coupons" description="Create and manage discount codes for your store." count={filteredCoupons.length} action={(
                <AdminToolbar
                    search={search}
                    onSearch={setSearch}
                    placeholder="Search coupon codes..."
                    hasFilters={Boolean(search || status !== 'all')}
                    onReset={() => { setSearch(''); setStatus('all'); }}
                >
                    <select value={status} onChange={(event) => setStatus(event.target.value)} className="form-control form-select">
                        <option value="all">All coupons</option>
                        <option value="true">Active</option>
                        <option value="false">Inactive</option>
                        <option value="archived">Archived</option>
                    </select>
                    <AdminButton onClick={() => navigate(ADMIN_ROUTE.COUPON_CREATE)}><AddIcon fontSize="small" /> Add coupon</AdminButton>
                </AdminToolbar>
            )} />
            <div className="admin-table-wrap">
                <table className="table align-middle mb-0 admin-table">
                    <thead>
                        <tr><th>Code</th><th>Discount</th><th>Minimum order</th><th>Usage limit</th><th>Expires</th><th>Status</th><th className="admin-table__actions">Actions</th></tr>
                    </thead>
                    <tbody>
                        {filteredCoupons.length ? filteredCoupons.map((coupon) => (
                            <tr key={coupon.id} className={coupon.isDeleted ? 'text-muted' : ''}>
                                <td><strong>{coupon.code}</strong></td>
                                <td>{formatDiscount(coupon)}</td>
                                <td>₹{Number(coupon.minimumOrder).toLocaleString('en-IN')}</td>
                                <td>{coupon.usageLimit} uses</td>
                                <td>{new Date(`${coupon.expiresAt}T00:00:00`).toLocaleDateString('en-IN')}</td>
                                <td><span className={`status-badge ${coupon.isDeleted ? 'status-badge--inactive' : coupon.isActive ? 'status-badge--visible' : 'status-badge--hidden'}`}>
                                    {coupon.isDeleted ? 'Archived' : coupon.isActive ? 'Active' : 'Inactive'}
                                </span></td>
                                <td className="admin-table__actions">
                                    <button type='button' onClick={() => dispatch(toggleCouponVisibility(coupon))}>{coupon.isDeleted ? "restore" : "delete"}</button>
                                    {/* <div className="admin-table__action-tools">
                                        <Tooltip title={coupon.isActive ? 'Deactivate coupon' : 'Activate coupon'}>
                                            <span><IconButton size="small" disabled aria-label={coupon.isActive ? 'Deactivate coupon' : 'Activate coupon'}>{coupon.isActive ? <VisibilityOffIcon fontSize="small" /> : <VisibilityIcon fontSize="small" />}</IconButton></span>
                                        </Tooltip>
                                        <Tooltip title="Edit coupon">
                                            <span><IconButton size="small" disabled aria-label="Edit coupon"><EditIcon fontSize="small" /></IconButton></span>
                                        </Tooltip>
                                        <Tooltip onClick={dispatch(toggleCouponVisibility(coupon))} title={coupon.isDeleted ? 'Restore coupon' : 'Archive coupon'}>
                                            <span><IconButton size="small" disabled aria-label={coupon.isDeleted ? 'Restore coupon' : 'Archive coupon'}>{coupon.isDeleted ? <RestoreFromTrashIcon fontSize="small" /> : <DeleteIcon fontSize="small" />}</IconButton></span>
                                        </Tooltip>
                                    </div> */}
                                </td>
                            </tr>
                        )) : <tr><td colSpan="7" className="review-table__empty">{coupons.length ? 'No coupons match the current filters.' : 'No coupons yet. Create one to start your next promotion.'}</td></tr>}
                    </tbody>
                </table>
            </div>
        </main>
    );
}

export default CouponList;