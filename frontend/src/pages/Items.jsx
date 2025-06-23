import { getItems } from "../api/items";
import ObjectTable from "../components/ObjectViewTable";
import ItemCreationForm from "../components/ItemCreationForm";
import useFetchList from "../hooks/useFetchList";

const columns = [
    { key: "id", label: "ID" },
    { key: "name", label: "Name" },
    { key: "description", label: "Description" },
    { key: "price", label: "Price" }
];

export default function Items() {
    const items = useFetchList(getItems, "items");

    return (
        <div>
            <h2>Items</h2>
            <ObjectTable data={items} columns={columns} />
            <h3>Create New Item</h3>
            <ItemCreationForm />
        </div>
    );
}