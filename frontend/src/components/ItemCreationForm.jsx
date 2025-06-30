import FormField from "./FormField";
import { createItem } from "../api/items";
import useCreationForm from "../hooks/useCreationForm";

export default function ItemCreationForm() {
    const initialState = { name: "", price: "", description: "" };
    const { formData, handleChange, handleSubmit } = useCreationForm(initialState, createItem);

    return (
        <form className="product-form" onSubmit={handleSubmit}>
            <FormField
                label="Name:"
                id="name"
                type="text"
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
            />
            <FormField
                label="Price:"
                id="price"
                type="number"
                name="price"
                step="0.01"
                min = "0.01"
                value={formData.price}
                onChange={handleChange}
            />
            <FormField
                label="Description:"
                id="description"
                type="text"
                name="description"
                value={formData.description}
                onChange={handleChange}
            />
            <button type="submit">Create Item</button>
        </form>
    );
}