import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { ADMIN_ROUTE } from '../../../constants/RoutesConstant';
import { getReviews } from '../../../redux/actions/reviewActions';
import AdminPageHeader from '../../../components/admin/AdminPageHeader';
import AdminToolbar from '../../../components/admin/AdminToolbar';
import AdminButton from '../../../components/admin/AdminButton';

function ReviewList() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const reviews = useSelector((state) => state.reviews);
    const [search, setSearch] = useState('');
    const [dateFrom, setDateFrom] = useState('');
    const [dateTo, setDateTo] = useState('');

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
                            <th>Id</th><th>Reviewer</th><th>Feedback</th><th>Author</th><th>Rating</th><th>Product ID</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredReviews.map((review) =>
                            <tr key={review.id}>
                                <td className="fw-semibold">{review.id}</td>
                                <td>{review.firstname} {review.lastname}</td>
                                <td>{review.review}</td>
                                <td>{review.role}</td>
                                <td>{review.ratting}/5</td>
                                <td>{review.pid}</td>
                            </tr>)}
                    </tbody>
                </table>
            </div>
        </main>
    );
}

export default ReviewList;