import React from 'react';

function AdminPageHeader({ eyebrow, title, description, count, action }) {
    return (
        <div className="admin-list-page__heading">
            <div>
                <p className="eyebrow mb-1">{eyebrow}</p>
                <h1 className="h2 mb-0">
                    {title}
                    {count !== undefined && <span className="admin-list-count">{count} {count === 1 ? 'record' : 'records'}</span>}
                </h1>
                {description && <p className="admin-page-header__description">{description}</p>}
            </div>
            {action}
        </div>
    );
}

export default AdminPageHeader;