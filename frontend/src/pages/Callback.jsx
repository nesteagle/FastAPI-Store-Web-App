import { useEffect, useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { Navigate } from "react-router-dom";
import { useAuthenticatedApi } from "../hooks/useApi";
import { useNotification } from "../context/NotificationContext";


export default function Callback() {
    const { isLoading, isAuthenticated, error, getAccessTokenSilently } = useAuth0();
    const [backendUser, setBackendUser] = useState(null);
    const { callApi } = useAuthenticatedApi();
    const { showToast } = useNotification();
    useEffect(() => {
        const fetchBackendUser = async () => {
            try {
                const data = await callApi("/myaccount");
            } catch (err) {
                setBackendUser({ error: err.message });
            }
        };

        if (isAuthenticated && !isLoading) {
            fetchBackendUser();
        }
    }, [isAuthenticated, isLoading, getAccessTokenSilently]);

    if (isLoading) return <div>Loading authentication...</div>;
    if (!isAuthenticated) return handleError("Not authenticated");
    if (!backendUser) return <div>Loading user info...</div>;
    if (error) return handleError(`Auth error: ${error.message}`);
    if (backendUser.error) return handleError(`Backend error: ${backendUser.error}`);

    function handleError(message) {
        showToast(message, "error");
        return <div>{message}</div>
    }

    showToast("Logged in successfully!");
    localStorage.clear();

    return (
        <Navigate to="/" replace />
    );
}