import FormField from "./FormField";
import { useAuthenticatedApi } from "../hooks/useApi";
import { useMemo } from "react";
import useCreationForm from "../hooks/useCreationForm";

export default function ItemCreationForm() {
    const { callApi } = useAuthenticatedApi();

    async function createItemUsingApi(data) {
        await callApi('/items/', 'POST', data);
    }

    const initialState = useMemo(
        () => ({ name: "", price: "", description: "", image_src: "" }),
        []
    );
    const { formData, handleChange, handleSubmit } = useCreationForm(
        initialState,
        createItemUsingApi
    );

    return (
        <form
            className="bg-surface p-6 rounded-lg shadow-md text-text"
            onSubmit={handleSubmit}
        >
            <h3 className="text-2xl font-semibold mb-4">Create New Item</h3>
            <FormField
                label="Name:"
                id="name"
                type="text"
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                width="w-full"
            />
            <FormField
                label="Price:"
                id="price"
                type="number"
                name="price"
                step="0.01"
                min="0.01"
                value={formData.price}
                onChange={handleChange} 
                width="w-full"

            />
            <FormField
                label="Description:"
                id="description"
                type="text"
                name="description"
                value={formData.description}
                onChange={handleChange} 
                width="w-full"

            />
            <FormField
                label="Image Link (must start with https:// or http://):"
                id="image_src"
                type="text"
                name="image_src"
                required
                value={formData.image_src}
                onChange={handleChange} 
                width="w-full"

            />
            <button
                type="submit"
                className="w-full py-2 bg-accent hover:bg-accent-hover text-white font-bold rounded"
            >
                Create Item
            </button>
        </form>
    );
}