import FormField from "./FormField";

export default function UserCreationForm() {
    return(
        <form className="user-creation-form">
            <FormField
                label="Username:"
                id="username"
                type="text"
                name="username"
                required
            />
            {/* <FormField
                label="Email:"
                id="email"
                type="email"
                name="email"
                required
            /> */}
            <FormField
                label="Password:"
                id="password"
                type="password"
                name="password"
                required
            />
            <button type="submit">Create User</button>
        </form>
    );
}