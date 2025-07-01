import FormField from "./FormField";
import { useApi } from "../hooks/useApi";
import useCreationForm from "../hooks/useCreationForm";

export default function ItemCreationForm() {
    const { callApi } = useApi();

    const createItemUsingApi = async (data) => {
        return await callApi('/items/', 'POST', data);
    };

    const initialState = { name: "", price: "", description: "", image_src: "" };
    const { formData, handleChange, handleSubmit } = useCreationForm(initialState, createItemUsingApi);

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
                min="0.01"
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
            <FormField
                label="Image Link (must start with https:// or http://):"
                id="image_src"
                type="text"
                name="image_src"
                required
                value={formData.image_src}
                onChange={handleChange}
            />
            <button type="submit">Create Item</button>
        </form>
    );
}