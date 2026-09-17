import React from "react";
import { NavLink } from "react-router-dom";
import { ADMIN_ROUTE } from "../../constants/RoutesConstant";
import DashboardOutlinedIcon from '@mui/icons-material/DashboardOutlined';
import Inventory2OutlinedIcon from '@mui/icons-material/Inventory2Outlined';
import PeopleOutlinedIcon from '@mui/icons-material/PeopleOutlined';
import RateReviewOutlinedIcon from '@mui/icons-material/RateReviewOutlined';

function Sidebar() {
	const links = [
		{ to: ADMIN_ROUTE.DASHBOARD, label: 'Dashboard', icon: DashboardOutlinedIcon },
		{ to: ADMIN_ROUTE.PRODUCT_LIST, label: 'Products', icon: Inventory2OutlinedIcon },
		{ to: ADMIN_ROUTE.USER_LIST, label: 'Users', icon: PeopleOutlinedIcon },
		{ to: ADMIN_ROUTE.REVIEW_LIST, label: 'Reviews', icon: RateReviewOutlinedIcon }
	];
	const linkClass = ({ isActive }) => `admin-sidebar__link${isActive ? ' is-active' : ''}`;

	return <aside className="admin-sidebar">
		<div className="admin-sidebar__brand">
			<span className="brand__mark">S</span>
			<span>shop<span className="brand__accent">lane</span></span>
		</div>
		<div className="admin-sidebar__label">Workspace</div>
		<nav className="admin-sidebar__nav">
			{links.map(({ to, label, icon: Icon }) => <NavLink key={to} to={to} className={linkClass}>
				<Icon fontSize="small" />
				<span>{label}</span>
			</NavLink>)}
		</nav>
		<div className="admin-sidebar__footer">Store operations<br /><span>Admin workspace</span></div>
	</aside>;
}

export default Sidebar;
