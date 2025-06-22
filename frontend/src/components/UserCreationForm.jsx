import FormField from "./FormField";
import { createUser } from "../api/users";
import useCreationForm from "../hooks/useCreationForm";

export default function UserCreationForm() {
    const initialState = { username: ""};
    const { formData, handleChange, handleSubmit } = useCreationForm(initialState, createUser);

    return (
        <form className="user-creation-form" onSubmit={handleSubmit}>
            <FormField
                label="(User)name:"
                id="username"
                type="text"
                name="username"
                required
                onChange={handleChange}
            />
            {/* <FormField
                label="Email:"
                id="email"
                type="email"
                name="email"
                required
                onChange={handleChange}
            /> */}
            {/* <FormField
                label="Password:"
                id="password"
                type="password"
                name="password"
                required
                onChange={handleChange}
            /> */}
            <button type="submit">Create User</button>
        </form>
    );
}