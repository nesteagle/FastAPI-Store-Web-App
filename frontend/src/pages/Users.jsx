import { useMemo } from "react";
import UserCreationForm from '../components/UserCreationForm';
import ResourceSearch from '../components/ResourceSearch';

export default function Users() {
    const columns = useMemo(() => [
        { key: 'id', label: 'ID' },
        { key: 'username', label: 'Username' }
    ], []);

    return (
        <div>
            <h2>Users</h2>
            <ResourceSearch resource="users" dataKey="users" columns={columns} />
            <h3>Create New User</h3>
            <UserCreationForm />
        </div>
    );
}