import { getUsers } from '../api/users';
import ObjectTable from '../components/ObjectViewTable';
import UserCreationForm from '../components/UserCreationForm';
import useFetchList from '../hooks/useFetchList';

const columns = [
    { key: 'id', label: 'ID' },
    { key: 'username', label: 'Username' }
];

export default function Users() {
    const users = useFetchList(getUsers, 'users');

    return (
        <div>
            <h2>Users</h2>
            <ObjectTable data={users} columns={columns} />
            <h3>Create New User</h3>
            <UserCreationForm />
        </div>
    );
}