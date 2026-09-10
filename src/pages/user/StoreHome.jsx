import React from 'react';
import { useTranslation } from 'react-i18next';

import Header from '../../components/user/Header';
import StoreFooter from '../../components/user/StoreFooter';
import { useAuth } from '../../helper/AuthHelper';

function StoreHome() {
    const { user } = useAuth();
    const { t } = useTranslation();
    return (
        <>
            <Header />

            <main className="user-home">
                <section className="user-home__card">
                    <span className="eyebrow">{t('homeWelcome')}</span>
                    <h1>
                        {
                            t('hello')
                        }, 
                        {user?.name || 'shopper'}
                        <br />
                        <em>{t('welcomeBack')}</em>
                    </h1>

                    <p>
                        {t('homeDescription')}
                    </p>

                    <div className="user-home__meta">
                        <div className="user-home__meta-item">
                            <label>{t('account')}</label>
                            <strong>{user?.role || t('user')}</strong>
                        </div>

                        <div className="user-home__meta-item">
                            <label>{t('status')}</label>
                            <strong>{user?.isDeleted ? t('inactive') : t('active')}</strong>
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