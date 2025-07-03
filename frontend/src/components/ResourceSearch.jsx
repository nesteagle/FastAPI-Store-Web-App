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
                    setData(await getItems(query));
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
        <div className="max-w-3xl mx-auto p-6 bg-surface rounded-xl shadow transition-colors duration-200">
            <input
                type="text"
                placeholder={`Search ${resource}...`}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full mb-4 px-4 py-2 rounded border border-surface-muted bg-surface-muted text-primary focus:outline-none focus:ring-2 focus:ring-accent/50 transition"
            />
            {isLoading && (
                <div className="flex items-center gap-2 text-text-muted animate-pulse mb-4">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24">
                        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
                    </svg>
                    Loading...
                </div>
            )}
            {error && (
                <div className="mb-4 text-error font-semibold">
                    Error: {error.message}
                </div>
            )}
            {!(error || isLoading) && (
                <ObjectViewTable data={data} columns={columns} />
            )}
        </div>
    );
}