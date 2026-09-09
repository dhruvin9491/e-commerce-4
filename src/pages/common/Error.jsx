import React from 'react';
import { useNavigate } from 'react-router-dom';

function Error(props) {
    const navigate = useNavigate();
    return (
        <div className='py-5 my-5 text-center'>
            <h1>404</h1>
            <p>Hato tya paso ja</p>
            <button onClick={() => navigate(-1)} className='btn btn-primary' type='button'>Go Back</button>
        </div>
    );
}

export default Error;