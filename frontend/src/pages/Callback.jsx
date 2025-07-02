import React, { useEffect, useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";

export default function Callback() {
    const { isLoading, isAuthenticated, error, getAccessTokenSilently } = useAuth0();
    const [backendUser, setBackendUser] = useState(null);

    useEffect(() => {
        const fetchBackendUser = async () => {
            try {
                const token = await getAccessTokenSilently();
                const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/myaccount`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    },
                });
                const data = await res.json();
                setBackendUser(data);
            } catch (err) {
                setBackendUser({ error: err.message });
            }
        };

        if (isAuthenticated && !isLoading) {
            fetchBackendUser();
        }
    }, [isAuthenticated, isLoading, getAccessTokenSilently]);

    if (isLoading) return <div>Loading authentication...</div>;
    if (error) return <div>Auth error: {error.message}</div>;
    if (!isAuthenticated) return <div>Not authenticated</div>;
    if (!backendUser) return <div>Loading user info...</div>;
    if (backendUser.error) return <div>Backend error: {backendUser.error}</div>;

    return (
        <div>
            <h2>Welcome!</h2>
            {/* <pre>{JSON.stringify(backendUser, null, 2)}</pre> */}
        </div>
    );
}