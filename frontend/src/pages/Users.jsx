// view all users here and manage user CRUD operations

import { useEffect, useState } from 'react';
import { getUsers } from '../api/users';
import ObjectTable from '../components/ObjectViewTable';
import UserCreationForm from '../components/UserCreationForm';

const columns = [
    { key: 'id', label: 'ID' },
    { key: 'username', label: 'Username' }
];

export default function Users() {
    const [users, setUsers] = useState([]);

    useEffect(() => {
        getUsers().then(res => setUsers(res.users || []));
    }, []);

    return (
        <div>
            <h2>Users</h2>
            <ObjectTable data={users} columns={columns} />
            <h3>Create New User</h3>
            <UserCreationForm />
        </div>
    );
}