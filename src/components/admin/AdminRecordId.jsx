import React from 'react';

function AdminRecordId({ id }) {
    return (
        <code className="admin-record-id" title={id} aria-label={`Record ID: ${id}`}>
            {id}
        </code>
    );
}

export default AdminRecordId;
