import { apiRequest } from "./baseApi";

export async function getUsers() {
    return apiRequest('/users/');
}

export async function createUser(data) {
    return apiRequest('/users/', 'POST', data);
}

export async function deleteUser(id) {
    return apiRequest(`/users/${id}`, 'DELETE');
}

export async function updateUser(id, data) {
    return apiRequest(`/users/${id}`, 'PUT', data);
}