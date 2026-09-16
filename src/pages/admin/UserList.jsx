import React, { useEffect, useState } from "react";
import { USER_API } from "../../constants/ApiConstant";
import { getData, deleteData } from "../../helper/ApiHelper";
import { showToast } from "../../helper/UiHelper";
import AdminPageHeader from '../../components/admin/AdminPageHeader';
import AdminToolbar from '../../components/admin/AdminToolbar';
import { IconButton, Tooltip } from '@mui/material';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import PersonOffIcon from '@mui/icons-material/PersonOff';
import RestoreIcon from '@mui/icons-material/Restore';

function UserList() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [role, setRole] = useState('all');
    const [roleSort, setRoleSort] = useState('default');

    const loadUsers = () => getData(USER_API)
        .then(({ data }) => setUsers(data))
        .catch((error) => showToast("error", error.message))
        .finally(() => setLoading(false));

    useEffect(() => {
        loadUsers();
    }, []);

    const toggleUser = async (user) => {
        try {
            await deleteData(`${USER_API}/${user.id}`, user);
            showToast("success", user.isDeleted ? 'User restored' : 'User deactivated');
            loadUsers();
        } catch (error) { showToast("error", error.message); }
    };

    const filteredUsers = users
        .filter((user) => {
            const query = search.toLowerCase();
            const matchesSearch = [user.name, user.email].some((value) => String(value || '').toLowerCase().includes(query));
            return matchesSearch && (role === 'all' || user.role === role);
        })
        .sort((firstUser, secondUser) => {
            if (roleSort === 'asc') return firstUser.role.localeCompare(secondUser.role);
            if (roleSort === 'desc') return secondUser.role.localeCompare(firstUser.role);
            return 0;
        });

    if (loading) return <div className="p-5 text-center">Loading users...</div>;
    return <main className="admin-list-page">
        <AdminPageHeader eyebrow="Administration" title="Users" count={filteredUsers.length} action={(
            <AdminToolbar
                search={search}
                onSearch={setSearch}
                placeholder="Search by name or email..."
                hasFilters={Boolean(search || role !== 'all' || roleSort !== 'default')}
                onReset={() => { setSearch(''); setRole('all'); setRoleSort('default'); }}
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
            <table className="table align-middle mb-0 admin-table"><thead><tr><th>Name</th><th>Email</th><th>Role</th><th>Status</th><th className="admin-table__actions">Actions</th></tr></thead>
                <tbody>{filteredUsers.map((user) => <tr key={user.id} className={user.isDeleted ? "text-muted" : ""}>
                    <td className="fw-semibold">{user.name}</td><td>{user.email}</td><td><span className="badge bg-light text-dark">{user.role}</span></td>
                    <td>{user.isDeleted ? 'Inactive' : 'Active'}</td><td className="admin-table__actions"><div className="admin-table__action-drawer"><Tooltip title="Actions"><IconButton className="admin-table__action-trigger" size="small" aria-label={`Actions for ${user.name}`}><MoreHorizIcon fontSize="small" /></IconButton></Tooltip><div className="admin-table__action-tools"><Tooltip title={user.isDeleted ? 'Restore user' : 'Deactivate user'}><IconButton className={user.isDeleted ? 'admin-table__icon--success' : 'admin-table__icon--danger'} size="small" onClick={() => toggleUser(user)} aria-label={user.isDeleted ? 'Restore user' : 'Deactivate user'}>{user.isDeleted ? <RestoreIcon fontSize="small" /> : <PersonOffIcon fontSize="small" />}</IconButton></Tooltip></div></div></td>
                </tr>)}</tbody>
            </table>
        </div>
    </main>;
}

export default UserList;