import React from "react";
import { NavLink } from "react-router-dom";
import { ADMIN_ROUTE } from "../../constants/RoutesConstant";
import { useTranslation } from 'react-i18next';

function Sidebar() {
	const { t } = useTranslation();
	const linkClass = ({ isActive }) => `nav-link px-3 py-2 ${isActive ? "active bg-primary text-white" : "text-dark"}`;
	return <aside className="bg-white border-end p-3" style={{ minHeight: "100vh", width: 240 }}>
		<h2 className="brand">
			<span className="brand__mark">S</span>
			<span>
				shop
				<span className="brand__accent">lane</span>
			</span>
		</h2>
		<nav className="nav flex-column gap-1">
				<NavLink to={ADMIN_ROUTE.DASHBOARD} className={linkClass}>{t('dashboard')}</NavLink>
				<NavLink to={ADMIN_ROUTE.PRODUCT_LIST} className={linkClass}>{t('products')}</NavLink>
				<NavLink to={ADMIN_ROUTE.USER_LIST} className={linkClass}>{t('users')}</NavLink>
		</nav>
	</aside>;
}

export default Sidebar;
