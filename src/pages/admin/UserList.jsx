import React, { useEffect, useState } from "react";
import { USER_API } from "../../constants/ApiConstant";
import { getData, deleteData } from "../../helper/ApiHelper";
import { confirmAction, showToast } from "../../helper/UiHelper";
import { useTranslation } from 'react-i18next';

function UserList() {
    const [users, setUsers] = useState([]);
    const { t } = useTranslation();
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
            title: t(user.isDeleted ? 'confirm.restoreUserTitle' : 'confirm.deactivateUserTitle'),
            text: t(user.isDeleted ? 'confirm.restoreUserText' : 'confirm.deactivateUserText'),
            confirmButtonText: t(user.isDeleted ? 'confirm.restoreUserButton' : 'confirm.deactivateUserButton')
        });

        if (!isConfirmed) return;

        try {
            await deleteData(`${USER_API}/${user.id}`, user);
            showToast("success", user.isDeleted ? t('restored') : t('deactivated'));
            loadUsers();
        } catch (error) { showToast("error", error.message); }
    };

    if (loading) return <div className="p-5 text-center">{t('loadingUsers')}</div>;
    return <main className="container py-4">
        <div className="d-flex justify-content-between align-items-center mb-4">
            <div><p className="text-uppercase text-primary small mb-1">{t('administration')}</p><h1 className="h2 mb-0">{t('users')}</h1></div>
            <span className="badge bg-secondary">{users.length} {t('accounts')}</span>
        </div>
        <div className="table-responsive bg-white shadow-sm">
            <table className="table align-middle mb-0"><thead><tr><th>{t('name')}</th><th>{t('email')}</th><th>{t('role')}</th><th>{t('status')}</th><th className="text-end">{t('action')}</th></tr></thead>
                <tbody>{users.map((user) => <tr key={user.id} className={user.isDeleted ? "text-muted" : ""}>
                    <td className="fw-semibold">{user.name}</td><td>{user.email}</td><td><span className="badge bg-light text-dark">{user.role}</span></td>
                    <td>{user.isDeleted ? t('inactive') : t('active')}</td><td className="text-end"><button className={`btn btn-sm ${user.isDeleted ? "btn-outline-success" : "btn-outline-danger"}`} onClick={() => toggleUser(user)}>{user.isDeleted ? t('restore') : t('deactivate')}</button></td>
                </tr>)}</tbody>
            </table>
        </div>
    </main>;
}

export default UserList;