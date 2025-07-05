// Allows users to register, log in, and view their orders (can be combined with account management if needed).
import { useMemo, useState, useEffect } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { useAuthenticatedApi } from "../hooks/useApi";
import ObjectViewTable from "../components/ObjectViewTable";

export default function AccountPage() {
    const { isLoading, isAuthenticated } = useAuth0();
    const { callApi } = useAuthenticatedApi();
    const [orders, setOrders] = useState([]);

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

    useEffect(() => {
        async function fetchOrders() {
            try {
                const data = await callApi("/orders/");
                setOrders(data.orders);
            } catch (error) {
                console.error("Failed to fetch orders:", error);
            }
        }
        if (isAuthenticated && !isLoading) {
            fetchOrders();
        }
    }, [isAuthenticated, isLoading, callApi]);

    return (<ObjectViewTable data={orders} columns={columns}></ObjectViewTable>);
}