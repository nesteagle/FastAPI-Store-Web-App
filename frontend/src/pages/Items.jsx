import { useEffect, useState } from "react";
import { getItems } from "../api/items";
import ObjectTable from "../components/ObjectViewTable";
import ItemCreationForm from "../components/ItemCreationForm";

const columns = [
    { key: "id", label: "ID" },
    { key: "name", label: "Name" },
    { key: "description", label: "Description" },
    { key: "price", label: "Price" }
];

export default function Items() {
    const [items, setItems] = useState([]);

    useEffect(() => {
        getItems().then(res => setItems(res.items || []));
    }, []);

    return (
        <div>
            <h2>Items</h2>
            <ObjectTable data={items} columns={columns} />
            <h3>Create New Item</h3>
            <ItemCreationForm />
        </div>
    );
}