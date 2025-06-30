import { useEffect, useState } from "react";

export default function useFetchList(fetchFunction, dataKey) {
    const [data, setData] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchFunction()
            .then((res) => {
                setData(dataKey ? res[dataKey] || [] : res || []);
                setLoading(false);
            })
            .catch((err) => {
                setError(err);
                setLoading(false);
            });
    }, [fetchFunction, dataKey]);
    return { data, error, loading };
}