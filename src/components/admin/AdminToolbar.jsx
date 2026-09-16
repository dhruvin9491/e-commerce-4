import React from 'react';
import AdminButton from './AdminButton';

function AdminToolbar({ search, onSearch, placeholder, hasFilters, onReset, children }) {
    return (
        <div className="admin-list-page__controls">
            {hasFilters && <AdminButton variant="outline-secondary" onClick={onReset}>Reset</AdminButton>}
            {onSearch && <input type="search" placeholder={placeholder} onChange={(event) => onSearch(event.target.value)} className="form-control" value={search} />}
            {children}
        </div>
    );
}

export default AdminToolbar;