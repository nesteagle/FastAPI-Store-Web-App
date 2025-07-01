import { useState, useEffect } from "react";
import { useApi } from "../hooks/useApi";
import ObjectViewTable from "./ObjectViewTable";

export default function ResourceSearch({ resource, dataKey, columns }) {
    const { callApi } = useApi();
    const [query, setQuery] = useState("");
    const [data, setData] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        async function fetchData() {
            setIsLoading(true);
            try {
                // If a query is provided, append it as a search query; otherwise, fetch all resources.
                const endpoint =
                    query.trim() !== ""
                        ? `/${resource}/?search=${encodeURIComponent(query)}`
                        : `/${resource}/`;
                const response = await callApi(endpoint);
                setData(response[dataKey]);
            } catch (err) {
                setError(err);
            } finally {
                setIsLoading(false);
            }
        }
        fetchData();
    }, [query, callApi, resource, dataKey]);

    return (
        <div>
            <input
                type="text"
                placeholder={`Search ${resource}...`}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                style={{ marginBottom: "1rem", padding: "0.5rem" }}
            />
            {isLoading && <div>Loading...</div>}
            {error && <div>Error: {error.message}</div>}
            {!(error || isLoading) && <ObjectViewTable data={data} columns={columns} />}
        </div>
    );
}