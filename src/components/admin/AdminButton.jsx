import React from 'react';

function AdminButton({ children, type = 'button', variant = 'primary', className = '', ...props }) {
    return (
        <button type={type} className={`btn btn-${variant} text-nowrap ${className}`.trim()} {...props}>
            {children}
        </button>
    );
}

export default AdminButton;