import { useState, useEffect } from "react";
import { useAuthenticatedApi } from "./useApi";

const CACHE_DURATION_MS = 15 * 60 * 1000; // 15 minutes

export default function useFetchList(fetchFunction, dataKey, cacheKey) {
    const { callApi } = useAuthenticatedApi();
    const [data, setData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        async function fetchData() {
            setIsLoading(true);
            setError(null);

            // Check cache
            const cached = localStorage.getItem(cacheKey);
            const cacheTime = localStorage.getItem(`${cacheKey}_time`);
            const now = Date.now();

            if (cached && cacheTime && now - Number(cacheTime) < CACHE_DURATION_MS) {
                setData(JSON.parse(cached));
                setIsLoading(false);
                return;
            }

            try {
                const response = await callApi(fetchFunction.endpoint, fetchFunction.method, fetchFunction.data);
                const result = response[dataKey];
                setData(result);
                localStorage.setItem(cacheKey, JSON.stringify(result));
                localStorage.setItem(`${cacheKey}_time`, now.toString());
            } catch (err) {
                setError(err);
            } finally {
                setIsLoading(false);
            }
        }
        fetchData();
    }, [callApi, fetchFunction, dataKey, cacheKey]);

    return { data, isLoading, error };
}