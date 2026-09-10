import { Navigate, Outlet } from "react-router-dom";
import { AUTH_ROUTE, ADMIN_ROUTE, CLIENT_ROUTE } from "../constants/RoutesConstant";
import { ROLES } from "../constants/CommonConstant";
import { useAuth } from "../helper/AuthHelper";
import { useTranslation } from 'react-i18next';

function PrivateRoute({ roles = [] }) {
    const { user, ready } = useAuth();
    const { t } = useTranslation();

    if (!ready) return <div className="p-5 text-center">{t('commonLoading')}...</div>;
    if (!user) return <Navigate to={AUTH_ROUTE.LOGIN} replace />;

    if (roles.length && !roles.includes(user.role)) {
        return (
            <Navigate
                to={
                    user.role === ROLES.ADMIN
                        ? ADMIN_ROUTE.DASHBOARD
                        : CLIENT_ROUTE.HOME
                }
                replace
            />
        );
    }

    return <Outlet />;
}

export default PrivateRoute;