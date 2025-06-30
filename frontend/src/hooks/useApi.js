import { useAuth0 } from "@auth0/auth0-react";
import { useCallback } from "react";
import { apiRequest } from "../api/baseApi";

const AUDIENCE = import.meta.env.VITE_AUTH0_AUDIENCE;


export function useApi() {
    const { getAccessTokenSilently, isAuthenticated } = useAuth0();

    const callApi = useCallback(
        async (endpoint, method = "GET", data = null) => {
            let token = null;
            if (isAuthenticated) {
                token = await getAccessTokenSilently();
            }
            return apiRequest(endpoint, method, data, token);
        },
        [isAuthenticated, getAccessTokenSilently]
    );

    return { callApi };
}