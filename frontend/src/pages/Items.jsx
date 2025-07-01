import {useMemo} from "react";
import ItemCreationForm from "../components/ItemCreationForm";
import ResourceSearch from "../components/ResourceSearch";

export default function Items() {
    const columns = useMemo(() => [
        { key: "id", label: "ID" },
        { key: "name", label: "Name" },
        { key: "description", label: "Description" },
        { key: "price", label: "Price" },
        { key: "image_src", label: "Image SRC" },
    ], []);

    return (
        <div>
            <h2>Items</h2>
            <ResourceSearch resource="items" dataKey="items" columns={columns} />
            <h3>Create New Item</h3>
            <ItemCreationForm />
        </div>
    );
}