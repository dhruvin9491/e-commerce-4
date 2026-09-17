import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

function AdminLayout() {
    return <div className="d-flex bg-light min-vh-100">
        <Sidebar />
        <div className="admin-main flex-grow-1 admin-surface">
            <Topbar />
            <Outlet />
        </div>
    </div>;
}

export default AdminLayout;