import React from 'react';
import { Route, Routes } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';

import Error from './pages/common/Error';
import Login from './pages/common/Login';
import Register from './pages/common/Register';
import Dashboard from './pages/admin/Dashboard';
import ProductList from './pages/admin/product/ProductList';
import ProductForm from './pages/admin/product/ProductForm';
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

function App() {
    return (
        <AuthProvider>
            <LangProvider>
                <ToastContainer position="top-right" autoClose={3000} newestOnTop closeOnClick pauseOnHover />
                <Routes>
                    <Route path={AUTH_ROUTE.REGISTER} element={<Register />} />
                    <Route path={AUTH_ROUTE.LOGIN} element={<Login />} />

                    <Route element={<PrivateRoute roles={[ROLES.ADMIN, ROLES.USER]} />}>
                        <Route path={CLIENT_ROUTE.HOME} element={<StoreHome />} />
                        <Route path={CLIENT_ROUTE.PROFILE} element={<StoreProfile />} />
                        <Route path={CLIENT_ROUTE.STORE} element={<StoreProductList />} />
                        <Route path={`${CLIENT_ROUTE.PRODUCT}/:id`} element={<StoreProductDetail />} />
                    </Route>

                    <Route element={<PrivateRoute roles={[ROLES.ADMIN]} />}>
                        <Route element={<AdminLayout />}>
                            <Route path={ADMIN_ROUTE.DASHBOARD} element={<Dashboard />} />
                            <Route path={ADMIN_ROUTE.PRODUCT_LIST} element={<ProductList />} />
                            <Route path={ADMIN_ROUTE.PRODUCT_CREATE} element={<ProductForm />} />
                            <Route path={`${ADMIN_ROUTE.PRODUCT_UPDATE}/:id`} element={<ProductForm />} />
                            <Route path={ADMIN_ROUTE.USER_LIST} element={<UserList />} />
                        </Route>
                    </Route>

                    <Route path={AUTH_ROUTE.ERROR} element={<Error />} />
                </Routes>
            </LangProvider>
        </AuthProvider>
    );
}

export default App;