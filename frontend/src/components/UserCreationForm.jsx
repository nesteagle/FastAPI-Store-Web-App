import FormField from "./FormField";
import { useAuthenticatedApi } from "../hooks/useApi";
import useCreationForm from "../hooks/useCreationForm";

export default function UserCreationForm() {
    const { callApi } = useAuthenticatedApi();

    const createUserUsingApi = async (data) => {
        return await callApi('/users/', 'POST', data);
    };

    const initialState = { username: "" };
    const { formData, handleChange, handleSubmit } = useCreationForm(initialState, createUserUsingApi);

    return (
        <form className="user-creation-form" onSubmit={handleSubmit}>
            <FormField
                label="(User)name:"
                id="username"
                type="text"
                name="username"
                required
                onChange={handleChange}
                value={formData.username}
            />
            <button type="submit">Create User</button>
        </form>
    );
}