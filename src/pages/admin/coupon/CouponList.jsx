import React, { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import AdminButton from '../../../components/admin/AdminButton';
import AdminPageHeader from '../../../components/admin/AdminPageHeader';
import AdminToolbar from '../../../components/admin/AdminToolbar';
import { ADMIN_ROUTE } from '../../../constants/RoutesConstant';
import { fetchCoupons, toggleCouponDeleted, toggleCouponVisibility } from '../../../redux/actions/couponActions';
import { showToast } from '../../../helper/UiHelper';
import AddIcon from '@mui/icons-material/Add';
import { IconButton, Tooltip } from '@mui/material';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import RestoreFromTrashIcon from '@mui/icons-material/RestoreFromTrash';

function CouponList() {
    const { data: coupons, loading, error } = useSelector((state) => state.coupons);
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
    const formatDateTime = (value) => value
        ? new Date(value).toLocaleString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })
        : 'Not set';
    
    useEffect(() => {
        dispatch(fetchCoupons()).catch((requestError) => showToast('error', requestError.message));
    }, [dispatch]);

    useEffect(() => {
        const nextExpiry = coupons
            .filter((coupon) => coupon.isActive && !coupon.isDeleted && coupon.expiresAt && Date.parse(coupon.expiresAt) > Date.now())
            .reduce((nearest, coupon) => Math.min(nearest, Date.parse(coupon.expiresAt)), Infinity);
        if (!Number.isFinite(nextExpiry)) return;

        const delay = Math.min(Math.max(nextExpiry - Date.now() + 50, 0), 2147483647);
        const timeout = window.setTimeout(() => {
            dispatch(fetchCoupons()).catch((requestError) => showToast('error', requestError.message));
        }, delay);
        return () => window.clearTimeout(timeout);
    }, [coupons, dispatch]);

    if (loading && !coupons.length) return <h1 className="my-5 text-center text-success">Loading coupons</h1>;

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
                        <tr><th>Code</th><th>Discount</th><th>Minimum order</th><th>Validity</th><th>Usage</th><th>Status</th><th className="admin-table__actions">Actions</th></tr>
                    </thead>
                    <tbody>
                        {filteredCoupons.length ? filteredCoupons.map((coupon) => {
                            const expired = coupon.expiresAt && Date.parse(coupon.expiresAt) <= Date.now();
                            return <tr key={coupon.id} className={coupon.isDeleted || expired ? 'text-muted' : ''}>
                                <td><strong>{coupon.code}</strong></td>
                                <td><strong>{formatDiscount(coupon)}</strong></td>
                                <td>₹{Number(coupon.minimumOrder).toLocaleString('en-IN')}</td>
                                <td><small>Starts {formatDateTime(coupon.startsAt)}</small><small>Ends {formatDateTime(coupon.expiresAt)}</small></td>
                                <td><strong>{coupon.usageCount} / {coupon.usageLimit}</strong><small>{coupon.perUserLimit} per customer</small></td>
                                <td><span className={`status-badge ${coupon.isDeleted || expired ? 'status-badge--inactive' : coupon.isActive ? 'status-badge--visible' : 'status-badge--hidden'}`}>
                                    {coupon.isDeleted ? 'Archived' : expired ? 'Expired' : coupon.isActive ? 'Active' : 'Inactive'}
                                </span></td>
                                <td className="admin-table__actions">
                                    <div className="admin-table__action-drawer">
                                        <Tooltip title="Actions">
                                            <IconButton className="admin-table__action-trigger" size="small" aria-label={`Actions for ${coupon.code}`}>
                                                <MoreHorizIcon fontSize="small" />
                                            </IconButton>
                                        </Tooltip>
                                        <div className="admin-table__action-tools">
                                            <Tooltip title={expired && !coupon.isActive ? 'Expired coupons cannot be activated' : coupon.isActive ? 'Deactivate coupon' : 'Activate coupon'}>
                                                <span><IconButton size="small" disabled={coupon.isDeleted || (expired && !coupon.isActive) || loading} onClick={() => dispatch(toggleCouponVisibility(coupon)).catch((requestError) => showToast('error', requestError.message))} aria-label={coupon.isActive ? 'Deactivate coupon' : 'Activate coupon'}>{coupon.isActive ? <VisibilityOffIcon fontSize="small" /> : <VisibilityIcon fontSize="small" />}</IconButton></span>
                                            </Tooltip>
                                            <Tooltip title="Edit coupon">
                                                <span><IconButton size="small" disabled={coupon.isDeleted} onClick={() => navigate(`${ADMIN_ROUTE.COUPON_UPDATE}/${coupon.id}`)} aria-label="Edit coupon"><EditIcon fontSize="small" /></IconButton></span>
                                            </Tooltip>
                                            <Tooltip title={coupon.isDeleted ? 'Restore coupon' : 'Archive coupon'}>
                                                <IconButton className={coupon.isDeleted ? 'admin-table__icon--success' : 'admin-table__icon--danger'} size="small" disabled={loading} onClick={() => dispatch(toggleCouponDeleted(coupon)).catch((requestError) => showToast('error', requestError.message))} aria-label={coupon.isDeleted ? 'Restore coupon' : 'Archive coupon'}>{coupon.isDeleted ? <RestoreFromTrashIcon fontSize="small" /> : <DeleteIcon fontSize="small" />}</IconButton>
                                            </Tooltip>
                                        </div>
                                    </div>
                                </td>
                            </tr>;
                        }) : <tr><td colSpan="7" className="review-table__empty">{error || (coupons.length ? 'No coupons match the current filters.' : 'No coupons yet. Create one to start your next promotion.')}</td></tr>}
                    </tbody>
                </table>
            </div>
        </main>
    );
}

export default CouponList;