import React, { useEffect } from 'react';
import { Route, Routes } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';

import Error from './pages/common/Error';
import Login from './pages/common/Login';
import Register from './pages/common/Register';
import Dashboard from './pages/admin/Dashboard';
import ProductList from './pages/admin/product/ProductList';
import ProductForm from './pages/admin/product/ProductForm';
import ReviewList from './pages/admin/review/ReviewList';
import ReviewForm from './pages/admin/review/ReviewForm';
import UserList from './pages/admin/UserList';
import AdminLayout from './components/admin/AdminLayout';
import StoreHome from './pages/user/StoreHome';
import StoreProfile from './pages/user/Profile';
import PrivateRoute from './routes/PrivateRoute';
import { AuthProvider } from './context/AuthContext';
import { ADMIN_ROUTE, AUTH_ROUTE, CLIENT_ROUTE } from './constants/RoutesConstant';
import { ROLES } from './constants/CommonConstant';
import LangProvider from './context/LangContext';
import StoreProductList from './pages/user/StoreProductList';
import StoreProductDetail from './pages/user/StoreProductDetail';
import StoreAbout from './pages/user/StoreAbout';
import StoreReviewForm from './pages/user/StoreReviewForm';
import Checkout from './pages/user/Checkout';
import CouponList from './pages/admin/coupon/CouponList';
import CouponForm from './pages/admin/coupon/CouponForm';
import PhoneAuth from './pages/common/Phone';
import { useAuth } from './helper/AuthHelper';
import { showToast } from './helper/UiHelper';

function AuthInitializationNotice() {
    const { initializationError } = useAuth();

    useEffect(() => {
        if (initializationError) {
            showToast('error', `Account server unavailable: ${initializationError}`);
        }
    }, [initializationError]);

    return null;
}

function App() {
    return (
        <AuthProvider>
            <LangProvider>
                <AuthInitializationNotice />
                <ToastContainer position="top-right" autoClose={3000} newestOnTop closeOnClick pauseOnHover />
                <Routes>
                    <Route path={AUTH_ROUTE.REGISTER} element={<Register />} />
                    <Route path={AUTH_ROUTE.LOGIN} element={<Login />} />
                    <Route path={AUTH_ROUTE.PHONE} element={<PhoneAuth />} />
                    <Route element={<PrivateRoute roles={[ROLES.ADMIN, ROLES.USER]} />}>
                        <Route path={CLIENT_ROUTE.HOME} element={<StoreHome />} />
                        <Route path={CLIENT_ROUTE.PROFILE} element={<StoreProfile />} />
                        <Route path={CLIENT_ROUTE.ABOUT} element={<StoreAbout />} />
                        <Route path={CLIENT_ROUTE.CHECKOUT} element={<Checkout />} />
                        <Route path={CLIENT_ROUTE.STORE} element={<StoreProductList />} />
                        <Route path={`${CLIENT_ROUTE.PRODUCT}/:id`} element={<StoreProductDetail />} />
                        <Route path={`${CLIENT_ROUTE.REVIEW}/:pid`} element={<StoreReviewForm />} />
                    </Route>

                    <Route element={<PrivateRoute roles={[ROLES.ADMIN]} />}>
                        <Route element={<AdminLayout />}>
                            <Route path={ADMIN_ROUTE.DASHBOARD} element={<Dashboard />} />
                            <Route path={ADMIN_ROUTE.PRODUCT_LIST} element={<ProductList />} />
                            <Route path={ADMIN_ROUTE.PRODUCT_CREATE} element={<ProductForm />} />
                            <Route path={`${ADMIN_ROUTE.PRODUCT_UPDATE}/:id`} element={<ProductForm />} />

                            <Route path={ADMIN_ROUTE.REVIEW_LIST} element={<ReviewList />} />
                            <Route path={ADMIN_ROUTE.REVIEW_CREATE} element={<ReviewForm />} />
                            <Route path={`${ADMIN_ROUTE.REVIEW_UPDATE}/:id`} element={<ReviewForm />} />
                             <Route path={`${ADMIN_ROUTE.REVIEW_CREATE}/:pid`} element={<ReviewForm />} />

                            <Route path={ADMIN_ROUTE.USER_LIST} element={<UserList />} />
                            <Route path={ADMIN_ROUTE.COUPON_LIST} element={<CouponList />} />
                            <Route path={ADMIN_ROUTE.COUPON_CREATE} element={<CouponForm />} />
                            <Route path={`${ADMIN_ROUTE.COUPON_UPDATE}/:id`} element={<CouponForm />} />
                        </Route>
                    </Route>

                    <Route path={AUTH_ROUTE.ERROR} element={<Error />} />
                </Routes>
            </LangProvider>
        </AuthProvider>
    );
}

export default App;