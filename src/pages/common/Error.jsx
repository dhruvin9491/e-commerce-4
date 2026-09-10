import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

function Error(props) {
    const navigate = useNavigate();
    const { t } = useTranslation();
    return (
        <div className='py-5 my-5 text-center'>
            <h1>404</h1>
            <p>{t('message')}</p>
            <button onClick={() => navigate(-1)} className='btn btn-primary' type='button'>{t('errorBack')}</button>
        </div>
    );
}

export default Error;