import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { ADMIN_ROUTE } from '../../../constants/RoutesConstant';
import { getReviews, toggleReviewDeleted, toggleReviewVisibility } from '../../../redux/actions/reviewActions';
import AdminPageHeader from '../../../components/admin/AdminPageHeader';
import AdminToolbar from '../../../components/admin/AdminToolbar';
import AdminButton from '../../../components/admin/AdminButton';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import DeleteIcon from '@mui/icons-material/Delete';
import RestoreFromTrashIcon from '@mui/icons-material/RestoreFromTrash';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import EditIcon from '@mui/icons-material/Edit';
import { IconButton, Tooltip } from '@mui/material';

function ReviewList() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { reviews } = useSelector((state) => state);
    const [search, setSearch] = useState('');
    const [dateFrom, setDateFrom] = useState('');
    const [dateTo, setDateTo] = useState('');

    const formatDate = (date) => date
        ? new Date(date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
        : 'No date';

    useEffect(() => {
        dispatch(getReviews());
    }, [dispatch]);

    const filteredReviews = reviews.filter((review) => {
        const searchText = search.toLowerCase();
        const matchesSearch = [review.firstname, review.lastname, review.review, review.pid]
            .some((value) => String(value || '').toLowerCase().includes(searchText));
        const createdAt = review.createdAt ? new Date(review.createdAt) : null;
        const matchesFrom = !dateFrom || (createdAt && createdAt >= new Date(`${dateFrom}T00:00:00`));
        const matchesTo = !dateTo || (createdAt && createdAt <= new Date(`${dateTo}T23:59:59.999`));
        return matchesSearch && matchesFrom && matchesTo;
    });

    return (
        <main className='admin-list-page'>
            <AdminPageHeader eyebrow="Feedback" title="Reviews" count={filteredReviews.length} action={(
                <AdminToolbar
                    search={search}
                    onSearch={setSearch}
                    placeholder="Search reviews..."
                    hasFilters={Boolean(search || dateFrom || dateTo)}
                    onReset={() => { setSearch(''); setDateFrom(''); setDateTo(''); }}
                >
                    <label className="admin-date-filter">From <input className='form-control' type="date" value={dateFrom} onChange={(event) => setDateFrom(event.target.value)} /></label>
                    <label className="admin-date-filter">To <input className='form-control' type="date" value={dateTo} onChange={(event) => setDateTo(event.target.value)} /></label>
                    <AdminButton onClick={() => navigate(ADMIN_ROUTE.REVIEW_CREATE)}>Add review</AdminButton>
                </AdminToolbar>
            )} />
            <div className="admin-table-wrap">
                <table className="table align-middle mb-0 admin-table">
                    <thead>
                        <tr>
                            <th>Id</th><th>Reviewer</th><th>Feedback</th><th>Author</th><th>Rating</th><th>Product ID</th><th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredReviews.length ? filteredReviews.map((r) =>
                            <tr key={r.id} className={r.isDeleted ? 'text-muted' : ''}>
                                <td>
                                    <strong className="review-table__id">{r.id}</strong>
                                    <small>{formatDate(r.createdAt)}</small>
                                </td>
                                <td>
                                    <strong>{r.firstname} {r.lastname}</strong>
                                    <small>{r.role || 'Customer'}</small>
                                </td>
                                <td className="review-table__feedback" title={r.review}>{r.review || 'No feedback provided'}</td>
                                <td><span className="badge bg-light text-dark text-capitalize">{r.role || 'Customer'}</span></td>
                                <td><span className="review-table__rating">{r.ratting || 0}<small>/5</small></span></td>
                                <td><code className="review-table__product-id">{r.pid || 'N/A'}</code></td>
                                <td className="admin-table__actions">
                                    <div className="admin-table__action-drawer">
                                        <Tooltip title="Actions">
                                            <IconButton className="admin-table__action-trigger" size="small" aria-label={`Actions for ${r.pid}`}>
                                                <MoreHorizIcon fontSize="small" />
                                            </IconButton>
                                        </Tooltip>
                                        <div className="admin-table__action-tools">
                                            <Tooltip title={r.isActive ? 'Hide review' : 'Show review'}>
                                                <span><IconButton size="small" onClick={() => dispatch(toggleReviewVisibility(r))} disabled={r.isDeleted} aria-label={r.isActive ? 'Hide review' : 'Show review'}>{r.isActive ? <VisibilityOffIcon fontSize="small" /> : <VisibilityIcon fontSize="small" />}</IconButton></span>
                                            </Tooltip>
                                            <Tooltip title="Edit Review">
                                                <span><IconButton size="small" onClick={() => navigate(`${ADMIN_ROUTE.REVIEW_UPDATE}/${r.id}`)} disabled={r.isDeleted} aria-label="Edit review"><EditIcon fontSize="small" /></IconButton></span>
                                            </Tooltip>
                                            <Tooltip title={r.isDeleted ? 'Restore review' : 'Delete review'}>
                                                <IconButton onClick={() => dispatch(toggleReviewDeleted(r))} className="admin-table__icon--danger" size="small" aria-label={r.isDeleted ? 'Restore review' : 'Delete review'}>{r.isDeleted ? <RestoreFromTrashIcon fontSize="small" /> : <DeleteIcon fontSize="small" />}</IconButton>
                                            </Tooltip>
                                        </div>
                                    </div>
                                </td>
                            </tr>
                        ) : (
                            <tr>
                                <td colSpan="7" className="review-table__empty">No reviews match the current filters.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </main>
    );
}

export default ReviewList;