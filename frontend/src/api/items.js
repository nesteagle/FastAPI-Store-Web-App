import { apiRequest } from "./baseApi";

export async function getItems() {
    return apiRequest('/items/');
}

export async function createItem(data) {
    return apiRequest('/items/', 'POST', data);
}

export async function deleteItem(id) {
    return apiRequest(`/items/${id}`, 'DELETE');
}

export async function updateItem(id, data) {
    return apiRequest(`/items/${id}`, 'PUT', data);
}