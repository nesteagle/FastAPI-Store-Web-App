import { useEffect, useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { Navigate } from "react-router-dom";
import { useAuthenticatedApi } from "../hooks/useApi";


export default function Callback() {
    const { isLoading, isAuthenticated, error, getAccessTokenSilently } = useAuth0();
    const [backendUser, setBackendUser] = useState(null);
    const { callApi } = useAuthenticatedApi();
    useEffect(() => {
        const fetchBackendUser = async () => {
            try {
                const data = await callApi("/myaccount");
                console.log(data);
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

    // TODO: consider adding toast here

    return (
        <Navigate to="/" replace />
    );
}