import { useMemo } from "react";
import UserCreationForm from '../components/UserCreationForm';
import ResourceSearch from '../components/ResourceSearch';

export default function Users() {
    // ADMIN ONLY viewable
    const columns = useMemo(() => [
        { key: 'id', label: 'ID' },
        { key: 'auth0_sub', label: 'Auth0 ID' }
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