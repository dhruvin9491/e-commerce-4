import React from 'react';
import { useTranslation } from 'react-i18next';

import Header from '../../components/user/Header';
import StoreFooter from '../../components/user/StoreFooter';
import { useAuth } from '../../helper/AuthHelper';
import { useDispatch, useSelector } from 'react-redux';
import { decrement, increment, reset } from '../../redux/actions/CounterActions';

// function StoreHome() {
//     const { user } = useAuth();
//     const { t } = useTranslation();
//     return (
//         <>
//             <Header />

//             <main className="user-home">
//                 <section className="user-home__card">
//                     <span className="eyebrow">{t('homeWelcome')}</span>
//                     <h1>
//                         {
//                             t('hello')
//                         }, 
//                         {user?.name || 'shopper'}
//                         <br />
//                         <em>{t('welcomeBack')}</em>
//                     </h1>

//                     <p>
//                         {t('homeDescription')}
//                     </p>

//                     <div className="user-home__meta">
//                         <div className="user-home__meta-item">
//                             <label>{t('account')}</label>
//                             <strong>{user?.role || t('user')}</strong>
//                         </div>

//                         <div className="user-home__meta-item">
//                             <label>{t('status')}</label>
//                             <strong>{user?.isDeleted ? t('inactive') : t('active')}</strong>
//                         </div>
//                     </div>
//                 </section>
//             </main>

//             <StoreFooter />
//         </>
//     );
// }

// export default StoreHome;

function StoreHome(props) {
    const dispatch = useDispatch();
    const count = useSelector((state) => state.count);

    return (
        <div>
            <h1>{count}</h1>
            <button onClick={() => dispatch(increment)} className='btn btn-primary' type='button'>+</button>
            <button onClick={() => dispatch(decrement)} className='btn btn-success' type='button'>-</button>
            <button onClick={() => dispatch(reset)} className='btn btn-danger' type='button'>0</button>
        </div>
    );
}

export default StoreHome;