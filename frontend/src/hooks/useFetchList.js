import { useState, useEffect, useCallback } from "react";
import { useAuthenticatedApi } from "./useApi";

export default function useFetchList(fetchFunction, dataKey, cacheKey, cacheDuration = 15 * 60 * 1000) {
    const { callApi } = useAuthenticatedApi();
    const [data, setData] = useState([]);
    const [isDataLoading, setIsDataLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchData = useCallback(async () => {
        setIsDataLoading(true);
        setError(null);

        const now = Date.now();

        if (cacheKey) {
            const cached = localStorage.getItem(cacheKey);
            const cacheTime = localStorage.getItem(`${cacheKey}_time`);
            if (cached && cacheTime && now - Number(cacheTime) < cacheDuration) {
                setData(JSON.parse(cached));
                setIsDataLoading(false);
                return;
            }
        }

        try {
            const response = await callApi(
                fetchFunction.endpoint,
                fetchFunction.method,
                fetchFunction.data
            );
            const result = dataKey ? response[dataKey] : response;
            setData(result);

            if (cacheKey) {
                localStorage.setItem(cacheKey, JSON.stringify(result));
                localStorage.setItem(`${cacheKey}_time`, now.toString());
            }
        } catch (err) {
            setError(err);
        } finally {
            setIsDataLoading(false);
        }
    }, [callApi, fetchFunction, dataKey, cacheKey, cacheDuration]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    return { data, isDataLoading, error };
}