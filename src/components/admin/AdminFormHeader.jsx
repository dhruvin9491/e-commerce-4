import React from 'react';

function AdminFormHeader({ eyebrow, title, description, mode }) {
    return (
        <div className="admin-form-page__heading">
            <div>
                <span className="eyebrow">{eyebrow}</span>
                <h1>{title}</h1>
                <p>{description}</p>
            </div>
            <span className="admin-form-page__mode">{mode}</span>
        </div>
    );
}

export default AdminFormHeader;