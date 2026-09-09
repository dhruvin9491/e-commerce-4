import React, { useContext } from 'react';

import Header from '../../components/user/Header';
import StoreFooter from '../../components/user/StoreFooter';
import { useAuth } from '../../helper/AuthHelper';
import { langContext } from '../../context/LangContext';
import { LANG_VALUE } from '../../constants/CommonConstant';

function StoreHome() {
    const { user } = useAuth();
    const {lang} = useContext(langContext);
    return (
        <>
            <Header />

            <main className="user-home">
                <section className="user-home__card">
                    <span className="eyebrow">Welcome</span>
                    <h1>
                        {
                            lang === LANG_VALUE.GJ ? "નમસ્તે" :
                            lang === LANG_VALUE.HI ? "नमस्ते" :
                            "Hello"
                        }, 
                        {user?.name || 'shopper'}
                        <br />
                        <em>Welcome back.</em>
                    </h1>

                    <p>
                        This is your personal home page. You can view your profile and keep
                        the experience simple and clean.
                    </p>

                    <div className="user-home__meta">
                        <div className="user-home__meta-item">
                            <label>Account</label>
                            <strong>{user?.role || 'user'}</strong>
                        </div>

                        <div className="user-home__meta-item">
                            <label>Status</label>
                            <strong>{user?.isDeleted ? 'Inactive' : 'Active'}</strong>
                        </div>
                    </div>
                </section>
            </main>

            <StoreFooter />
        </>
    );
}

export default StoreHome;

// import React, { useReducer } from 'react';
// import { COUNTER_ACTION } from '../../constants/ActionConstant';

// const initValue = 0;

// function reducer(state, action) {
//     console.log(state, action);
//     switch (action) {
//         case COUNTER_ACTION.INCREMENT:
//             return state + 1;
//         case COUNTER_ACTION.DECREMENT:
//             return state - 1;
//         case COUNTER_ACTION.RESET:
//             return 0;
//         default:
//             return state;
//     }
// }

// function StoreHome(props) {
//     const [value, dispatch] = useReducer(reducer, initValue);
//     return (
//         <div>
//             <h1>{value}</h1>
//             <button onClick={() => dispatch(COUNTER_ACTION.INCREMENT)} className='btn btn-primary' type='button'>+</button>
//             <button onClick={() => dispatch(COUNTER_ACTION.DECREMENT)} className='btn btn-success' type='button'>-</button>
//             <button onClick={() => dispatch(COUNTER_ACTION.RESET)} className='btn btn-danger' type='button'>0</button>
//         </div>
//     );
// }

// export default StoreHome;