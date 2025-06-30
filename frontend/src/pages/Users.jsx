import { getUsers } from '../api/users';
import {useMemo} from "react";
import ObjectTable from '../components/ObjectViewTable';
import UserCreationForm from '../components/UserCreationForm';
import useFetchList from '../hooks/useFetchList';
import LoginButton from '../components/LoginButton';
import LogoutButton from '../components/LogoutButton';
import Profile from '../components/Profile';


export default function Users() {
    const {data: users, isLoading, error} = useFetchList(getUsers, 'users');
    const columns = useMemo (() => [
        { key: 'id', label: 'ID' },
        { key: 'username', label: 'Username' }
    ], []);

    if (isLoading) return <div>Loading...</div>;
    if (error) return <div>Error: {error.message}</div>;

    return (
        <div>
            <h2>Users</h2>
            <ObjectTable data={users} columns={columns} />
            <h3>Create New User</h3>
            <UserCreationForm />
            <LoginButton />
            <LogoutButton />
            <Profile />
        </div>
    );
}