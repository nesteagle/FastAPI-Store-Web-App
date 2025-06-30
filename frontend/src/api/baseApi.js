const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export async function apiRequest(endpoint, method = 'GET', data = null) {
    const options = {
        method: method,
        headers: {
            'Content-Type': 'application/json'
        }
    };

    if (data) {
        options.body = JSON.stringify(data);
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, options);
    if (!response.ok) {
        throw new Error(`Error ${response.status}: ${await response.text()}`);
    }
    return response.json();
}