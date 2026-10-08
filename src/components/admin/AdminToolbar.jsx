import React from 'react';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';

function AdminToolbar({ search, onSearch, placeholder, children }) {
    return (
        <div className="admin-list-page__controls">
            {onSearch && <label className="admin-search">
                <SearchOutlinedIcon fontSize="small" aria-hidden="true" />
                <span className="visually-hidden">Search</span>
                <input type="search" placeholder={placeholder} aria-label={placeholder} onChange={(event) => onSearch(event.target.value)} className="form-control" value={search} />
            </label>}
            {children}
        </div>
    );
}

export default AdminToolbar;