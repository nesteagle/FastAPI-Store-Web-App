import { useState } from 'react'
import { createItem } from './script'
import './App.css'

const FormField = ({ label, id, type, name, value, onChange, required = false }) => (
    <div className="form-group">
        <label htmlFor={id}>{label}</label>
        <input
            id={id}
            type={type}
            name={name}
            value={value}
            onChange={onChange}
            required={required}
        />
    </div>
);

function App() {
    const [formData, setFormData] = useState({ name: '', price: '', description: '' });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const dataToSubmit = {
            ...formData,
            price: formData.price ? parseFloat(formData.price) : 0,
        };
        createItem(dataToSubmit)
            .then((result) => {
                console.log('Item created successfully:', result);
                setFormData({ name: '', price: '', description: '' });
            })
            .catch((error) => {
                console.error('Error creating item:', error);
            });
    };

    return (
        <form onSubmit={handleSubmit} className="product-form">
            <FormField
                label="Name:"
                id="name"
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
            />
            <FormField
                label="Price:"
                id="price"
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                required
            />
            <FormField
                label="Description (optional):"
                id="description"
                type="text"
                name="description"
                value={formData.description}
                onChange={handleChange}
            />
            <button type="submit">Submit</button>
        </form>
    );
}

export default App