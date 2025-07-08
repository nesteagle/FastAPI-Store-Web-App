import { useMemo } from "react";
import ItemCreationForm from "../components/ItemCreationForm";
import useFetchList from "../../hooks/useFetchList";
import ObjectViewTable from "../components/ObjectViewTable";
import LoadingIcon from "../../components/LoadingIcon";
import { AdminLinkNavigation } from "../components/AdminLinkNavigation";

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

    const fetchFunction = useMemo(() => ({
        endpoint: "/items/",
        method: "GET"
    }), []);
    const { data, isDataLoading } = useFetchList(fetchFunction, "items", "items_cache", 10 * 1000); //10s
    if (isDataLoading) return <LoadingIcon />
    return (
        <section className="max-w-4xl mx-auto p-6 color-bg text-text-primary-high">
            <h2 className="text-3xl font-bold mb-6">Items</h2>
            <ObjectViewTable data={data} columns={columns} />
            <h3 className="text-2xl font-semibold mb-4">Create New Item (needs admin permission)</h3>
            <ItemCreationForm />
            <AdminLinkNavigation />
        </section>
    );
}