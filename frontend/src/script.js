const API_BASE_URL = 'http://localhost:8000';

export async function createItem(data) {
    const response = await fetch(`${API_BASE_URL}/items/`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    });
    return response.json();
}

export async function deleteItem(data) {
    const response = await fetch(`${API_BASE_URL}/items/${data.id.value}`, {
        method: 'DELETE'
    });
    return response.json();
}

export async function putItem(data) {
    const response = await fetch(`${API_BASE_URL}/items/${data.id.value}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    });
    return response.json();
}