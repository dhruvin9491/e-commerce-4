import React from 'react';

function AuthPageHeader({ title, description }) {
    return (
        <header className="auth-page-header">
            <span className="eyebrow">Shoplane account</span>
            <h1>{title}</h1>
            <p>{description}</p>
        </header>
    );
}

export default AuthPageHeader;
