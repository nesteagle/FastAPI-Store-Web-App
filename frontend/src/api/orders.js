import { apiRequest } from "./baseApi";

export async function getOrders() {
    return apiRequest('/orders/');
}

export async function createOrder(data) {
    return apiRequest('/orders/', 'POST', data);
}

export async function deleteOrder(id) {
    return apiRequest(`/orders/${id}`, 'DELETE');
}

export async function updateOrder(id, data) {
    return apiRequest(`/orders/${id}`, 'PUT', data);
}