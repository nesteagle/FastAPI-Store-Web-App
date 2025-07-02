import { useMemo } from "react";
import ResourceSearch from "../components/ResourceSearch";

export default function Orders() {
    const columns = useMemo(() => [
        { key: 'id', label: 'UUID' },
        { key: 'user_id', label: 'User ID' },
        { key: 'date', label: 'Date' },
        {
            key: "items",
            label: "Items",
            render: (items) =>
                items.map(i => `\"${i.name}\" x${i.quantity}`).join(", ")
        }
    ], []);

    return (
        <div>
            <h2>Orders</h2>
            <ResourceSearch resource="orders" dataKey="orders" columns={columns} />
        </div>
    );
}