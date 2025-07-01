import { getItems } from "../api/items";
import ObjectTable from "../components/ObjectViewTable";
import ItemCreationForm from "../components/ItemCreationForm";
import useFetchList from "../hooks/useFetchList";
import {useMemo} from "react";

export default function Items() {
    const {data: items, isLoading, error} = useFetchList(getItems, "items");
    const columns = useMemo (() => [
        { key: "id", label: "ID" },
        { key: "name", label: "Name" },
        { key: "description", label: "Description" },
        { key: "price", label: "Price" },
        { key: "image_src", label: "Image SRC"}
    ], []);

    if (isLoading) return <div>Loading...</div>;
    if (error) return <div>Error: {error.message}</div>;

    return (
        <div>
            <h2>Items</h2>
            <ObjectTable data={items} columns={columns} />
            <h3>Create New Item</h3>
            <ItemCreationForm />
        </div>
    );
}