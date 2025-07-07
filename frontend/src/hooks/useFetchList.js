import { useState, useEffect } from "react";
import { useAuthenticatedApi } from "./useApi";

export default function useFetchList(fetchFunction, dataKey, cacheKey, cacheDuration = 15 * 60 * 1000) {
    const { callApi } = useAuthenticatedApi();
    const [data, setData] = useState([]);
    const [isDataLoading, setIsDataLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        async function fetchData() {
            setIsDataLoading(true);
            setError(null);

            const cached = localStorage.getItem(cacheKey);
            const cacheTime = localStorage.getItem(`${cacheKey}_time`);
            const now = Date.now();

            if (cached && cacheTime && now - Number(cacheTime) < cacheDuration) {
                setData(JSON.parse(cached));
                setIsDataLoading(false);
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
                setIsDataLoading(false);
            }
        }
        fetchData();
    }, [callApi, fetchFunction, dataKey, cacheKey]);

    return { data, isDataLoading, error };
}