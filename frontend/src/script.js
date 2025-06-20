import { createRoot } from 'react-dom/client';

// Clear the existing HTML content
document.body.innerHTML = '<div id="app"></div>';

// Render your React component instead
const root = createRoot(document.getElementById('app'));
root.render(<h1>Hello, world</h1>);

async function createItem(event) {
    event.preventDefault(); // Prevent form from submitting normally
    const form = event.target;
    const data = {
        name: form.name.value,
        price: form.price.value,
        description: form.desc.value
    };
    try {
        const response = await fetch('/items/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });
        const result = await response.json();
        document.getElementById('result').innerHTML = `<p>Item created: ${result.item.name} with a price of ${result.item.price}, with description ${result.item.description}</p>`;
        console.log('Item created successfully:', result);
    } catch (error) {
        console.error('Error creating item:', error);
    }
}

async function deleteItem(event) {
    event.preventDefault(); // Prevent form from submitting normally
    const form = event.target;
    const itemId = form.id.value;
    try {
        const response = await fetch(`/items/${itemId}`, {
            method: 'DELETE'
        });
        const result = await response.json();
        document.getElementById('result').innerHTML = `<p>Item deleted: ${result.message}</p>`;
        console.log('Item deleted successfully:', result);
    } catch (error) {
        console.error('Error deleting item:', error);
    }
}

document.getElementById('postForm').addEventListener('submit', createItem);
document.getElementById('deleteForm').addEventListener('submit', deleteItem);