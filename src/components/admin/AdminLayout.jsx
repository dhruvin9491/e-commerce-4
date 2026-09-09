import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

function AdminLayout() {
    return <div className="d-flex bg-light">
        <Sidebar />
        <div className="flex-grow-1 admin-surface">
            <Topbar />
            <Outlet />
        </div>
    </div>;
}

export default AdminLayout;