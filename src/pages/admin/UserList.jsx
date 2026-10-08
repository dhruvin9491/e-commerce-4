import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { showToast } from "../../helper/UiHelper";
import AdminPageHeader from '../../components/admin/AdminPageHeader';
import AdminToolbar from '../../components/admin/AdminToolbar';
import { IconButton, Tooltip } from '@mui/material';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import PersonOffIcon from '@mui/icons-material/PersonOff';
import RestoreIcon from '@mui/icons-material/Restore';
import AdminRecordId from '../../components/admin/AdminRecordId';
import { fetchUsers, toggleUserStatus } from "../../redux/actions/userActions";

function UserList() {
    const dispatch = useDispatch();
    const { data: users, loading, error } = useSelector((state) => state.users);
    const [search, setSearch] = useState('');
    const [role, setRole] = useState('all');
    const [roleSort, setRoleSort] = useState('default');

    useEffect(() => {
        dispatch(fetchUsers()).catch((requestError) => showToast("error", requestError.message));
    }, [dispatch]);

    const toggleUser = async (user) => {
        try {
            await dispatch(toggleUserStatus(user));
            showToast("success", user.isDeleted ? 'User restored' : 'User deactivated');
        } catch (error) { showToast("error", error.message); }
    };

    const filteredUsers = users
        .filter((user) => {
            const query = search.toLowerCase();
            const matchesSearch = [user.name, user.firstname, user.lastname, user.email].some((value) => String(value || '').toLowerCase().includes(query));
            return matchesSearch && (role === 'all' || user.role === role);
        })
        .sort((firstUser, secondUser) => {
            if (roleSort === 'asc') return firstUser.role.localeCompare(secondUser.role);
            if (roleSort === 'desc') return secondUser.role.localeCompare(firstUser.role);
            return 0;
        });

    if (loading && !users.length) return <div className="p-5 text-center">Loading users...</div>;
    return <main className="admin-list-page">
        <AdminPageHeader eyebrow="Administration" title="Users" description="Review customer accounts and access status." count={filteredUsers.length} action={(
            <AdminToolbar
                search={search}
                onSearch={setSearch}
                placeholder="Search users..."
            >
                <select value={role} onChange={(event) => setRole(event.target.value)} className="form-control form-select">
                    <option value="all">All roles</option>
                    <option value="admin">Admin</option>
                    <option value="user">User</option>
                </select>
                <select value={roleSort} onChange={(event) => setRoleSort(event.target.value)} className="form-control form-select">
                    <option value="default">Role order</option>
                    <option value="asc">Role: A to Z</option>
                    <option value="desc">Role: Z to A</option>
                </select>
            </AdminToolbar>
        )} />
        <div className="admin-table-wrap">
            <table className="table align-middle mb-0 admin-table"><thead><tr><th className="admin-table__id-column">User ID</th><th>Name</th><th>Email</th><th>Role</th><th>Status</th><th className="admin-table__actions">Actions</th></tr></thead>
                <tbody>{filteredUsers.length ? filteredUsers.map((user) => <tr key={user.id} className={user.isDeleted ? "text-muted" : ""}>
                    <td className="admin-table__id-column"><AdminRecordId id={user.id} /></td><td className="fw-semibold">{user.name || `${user.firstname || ''} ${user.lastname || ''}`.trim() || 'Unnamed user'}</td><td>{user.email}</td><td><span className="badge bg-light text-dark text-capitalize">{user.role}</span></td>
                    <td><span className={`status-badge ${user.isDeleted ? 'status-badge--inactive' : 'status-badge--active'}`}>{user.isDeleted ? 'Inactive' : 'Active'}</span></td><td className="admin-table__actions"><div className="admin-table__action-drawer"><Tooltip title="Actions"><IconButton className="admin-table__action-trigger" size="small" aria-label={`Actions for ${user.name || user.email}`}><MoreHorizIcon fontSize="small" /></IconButton></Tooltip><div className="admin-table__action-tools"><Tooltip title={user.isDeleted ? 'Restore user' : 'Deactivate user'}><IconButton className={user.isDeleted ? 'admin-table__icon--success' : 'admin-table__icon--danger'} size="small" onClick={() => toggleUser(user)} aria-label={user.isDeleted ? 'Restore user' : 'Deactivate user'}>{user.isDeleted ? <RestoreIcon fontSize="small" /> : <PersonOffIcon fontSize="small" />}</IconButton></Tooltip></div></div></td>
                </tr>) : <tr><td colSpan="6" className="review-table__empty">No users match the current filters.</td></tr>}</tbody>
            </table>
        </div>
        {error && <p className="text-danger mt-3">{error}</p>}
    </main>;
}

export default UserList;