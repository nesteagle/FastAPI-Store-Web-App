import { useState, useEffect } from "react";
import { useAuthenticatedApi } from "../hooks/useApi";
import { getItems } from "../api/itemsApi";
import ObjectViewTable from "./ObjectViewTable";

export default function ResourceSearch({ resource, dataKey, columns }) {
    const { callApi } = useAuthenticatedApi();
    const [query, setQuery] = useState("");
    const [data, setData] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        async function fetchData() {
            setIsLoading(true);
            try {
                if (resource === "items") {
                    setData(getItems(query));
                } else {
                    const endpoint =
                        query.trim() !== ""
                            ? `/${resource}/?search=${encodeURIComponent(query)}`
                            : `/${resource}/`;
                    const response = await callApi(endpoint);
                    setData(response[dataKey]);
                }
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