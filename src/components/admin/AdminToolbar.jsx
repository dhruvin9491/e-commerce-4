import React from 'react';
import AdminButton from './AdminButton';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import ClearIcon from '@mui/icons-material/Clear';

function AdminToolbar({ search, onSearch, placeholder, hasFilters, onReset, children }) {
    return (
        <div className="admin-list-page__controls">
            {onSearch && <label className="admin-search">
                <SearchOutlinedIcon fontSize="small" aria-hidden="true" />
                <span className="visually-hidden">Search</span>
                <input type="search" placeholder={placeholder} aria-label={placeholder} onChange={(event) => onSearch(event.target.value)} className="form-control" value={search} />
            </label>}
            {hasFilters && <AdminButton variant="outline-secondary" onClick={onReset}><ClearIcon fontSize="small" /> Clear filters</AdminButton>}
            {children}
        </div>
    );
}

export default AdminToolbar;