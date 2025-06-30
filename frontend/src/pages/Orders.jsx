import ShoppingCart from "../components/ShoppingCart";
import ObjectViewTable from "../components/ObjectViewTable";
import { getOrders } from "../api/orders";
import useFetchList from "../hooks/useFetchList";
import { useMemo } from "react";

export default function Orders() {
    const {data: orders, isLoading, error} = useFetchList(getOrders, "orders");

    const columns = useMemo(() => [
        { key: 'id', label: 'ID' },
        { key: 'user_id', label: 'User ID' },
        { key: 'date', label: 'Date' },
        {
            key: "items",
            label: "Items",
            render: (items) =>
                items.map(i => `\"${i.name}\" x${i.quantity}`).join(", ")
        }
    ], []);

    if (isLoading) return <div>Loading...</div>;
    if (error) return <div>Error: {error.message}</div>;

    return (
        <div>
            <h2>Orders</h2>
            <ObjectViewTable data={orders} columns={columns} />
            <h3>Create new Order</h3>
            <ShoppingCart />
        </div>
    );
}