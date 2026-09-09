import React, { useEffect, useState } from "react";
import { USER_API } from "../../constants/ApiConstant";
import { getData, deleteData } from "../../helper/ApiHelper";
import { confirmAction, showToast } from "../../helper/UiHelper";
import { COMMON_TEXT, CONFIRM_TEXT, TOAST_TEXT } from "../../constants/UiTextConstant";

function UserList() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    const loadUsers = () => getData(USER_API)
        .then(({ data }) => setUsers(data))
        .catch((error) => showToast("error", error.message))
        .finally(() => setLoading(false));

    useEffect(() => {
        loadUsers();
    }, []);

    const toggleUser = async (user) => {
        const isConfirmed = await confirmAction({
            ...(user.isDeleted ? CONFIRM_TEXT.user.restore : CONFIRM_TEXT.user.deactivate)
        });

        if (!isConfirmed) return;

        try {
            await deleteData(`${USER_API}/${user.id}`, user);
            showToast("success", user.isDeleted ? TOAST_TEXT.user.restored : TOAST_TEXT.user.deactivated);
            loadUsers();
        } catch (error) { showToast("error", error.message); }
    };

    if (loading) return <div className="p-5 text-center">{COMMON_TEXT.loadingUsers}</div>;
    return <main className="container py-4">
        <div className="d-flex justify-content-between align-items-center mb-4">
            <div><p className="text-uppercase text-primary small mb-1">Administration</p><h1 className="h2 mb-0">Users</h1></div>
            <span className="badge bg-secondary">{users.length} accounts</span>
        </div>
        <div className="table-responsive bg-white shadow-sm">
            <table className="table align-middle mb-0"><thead><tr><th>Name</th><th>Email</th><th>Role</th><th>Status</th><th className="text-end">Action</th></tr></thead>
                <tbody>{users.map((user) => <tr key={user.id} className={user.isDeleted ? "text-muted" : ""}>
                    <td className="fw-semibold">{user.name}</td><td>{user.email}</td><td><span className="badge bg-light text-dark">{user.role}</span></td>
                    <td>{user.isDeleted ? "Inactive" : "Active"}</td><td className="text-end"><button className={`btn btn-sm ${user.isDeleted ? "btn-outline-success" : "btn-outline-danger"}`} onClick={() => toggleUser(user)}>{user.isDeleted ? "Restore" : "Deactivate"}</button></td>
                </tr>)}</tbody>
            </table>
        </div>
    </main>;
}

export default UserList;