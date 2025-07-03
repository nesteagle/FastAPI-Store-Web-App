import { useState, useEffect, useMemo } from "react";
import ItemCreationForm from "../components/ItemCreationForm";
import ResourceSearch from "../components/ResourceSearch";
import { getItems } from "../api/itemsApi";

export default function Items() {
    const columns = useMemo(
        () => [
            { key: "id", label: "ID" },
            { key: "name", label: "Name" },
            { key: "description", label: "Description" },
            { key: "price", label: "Price" },
            { key: "image_src", label: "Image SRC" },
        ],
        []
    );

    const [items, setItems] = useState([]);

    useEffect(() => {
        async function fetchItems() {
            try {
                const data = await getItems();
                console.log(data);
                setItems(data);
            } catch (error) {
                console.error("Failed to fetch items:", error);
            }
        }
        fetchItems();
    }, []);

    return (
        <section className="max-w-4xl mx-auto p-6 color-bg text-text-high">
            <h2 className="text-3xl font-bold mb-6">Items</h2>
            <div className="mb-10">
                <ResourceSearch
                    resource="items"
                    dataKey="items"
                    columns={columns}
                />
            </div>
            <h3 className="text-2xl font-semibold mb-4">Create New Item</h3>
            <div className="space-y-8">
                <ItemCreationForm />
            </div>
        </section>
    );
}