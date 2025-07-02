import { apiRequest } from "./baseApi";

export async function getItems(query = null) {
    const endpoint =
        query && query.trim() !== ""
            ? `/items/?search=${encodeURIComponent(query)}`
            : `/items/`;
    const response = await apiRequest(endpoint, "GET");
    return response.items;
}