import React from 'react';
import { useNavigate } from 'react-router-dom';

function Error(props) {
    const navigate = useNavigate();
    return (
        <div className='py-5 my-5 text-center'>
            <h1>404</h1>
            <p>Something went wrong</p>
            <button onClick={() => navigate(-1)} className='btn btn-primary' type='button'>Go back</button>
        </div>
    );
}

export default Error;