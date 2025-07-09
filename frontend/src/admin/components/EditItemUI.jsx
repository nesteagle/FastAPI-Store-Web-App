import { useState } from "react";
import FormField from "../../components/FormField"; // Adjust the import path as needed

export default function EditItemUI({ item, onClose, onSave }) {
    const [form, setForm] = useState({
        name: item.name || "",
        description: item.description || "",
        price: item.price || "",
        image_src: item.image_src || "",
    });

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave({ ...item, ...form });
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
            <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md relative">
                <button
                    className="absolute top-2 right-2 text-gray-400 hover:text-gray-700 text-2xl"
                    onClick={onClose}
                    aria-label="Close"
                >
                    ×
                </button>
                <h2 className="text-xl font-bold mb-4">Edit Item</h2>
                <form onSubmit={handleSubmit} className="space-y-2">
                    <FormField
                        label="Name"
                        id="edit-name"
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        required
                        width="w-full"
                    />
                    <FormField
                        label="Description"
                        id="edit-description"
                        name="description"
                        value={form.description}
                        onChange={handleChange}
                        width="w-full"
                    />
                    <FormField
                        label="Price"
                        id="edit-price"
                        name="price"
                        type="number"
                        value={form.price}
                        onChange={handleChange}
                        required
                        width="w-full"
                        min="0"
                        step="any"
                    />
                    <FormField
                        label="Image SRC"
                        id="edit-image-src"
                        name="image_src"
                        value={form.image_src}
                        onChange={handleChange}
                        width="w-full"
                    />
                    <div className="flex justify-end space-x-2 pt-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
                        >
                            Save
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
