import { useEffect, useState } from "react";

export default function useFetchList(fetchFunction, dataKey) {
    const [data, setData] = useState([]);
    useEffect(() => {
        fetchFunction().then(res => setData(dataKey ? res[dataKey] || [] : res || []));
    }, [fetchFunction, dataKey]);
    return data;
}