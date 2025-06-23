import OrderCreationForm from "../components/OrderCreationForm";
import ObjectViewTable from "../components/ObjectViewTable";
import { getOrders } from "../api/orders";
import useFetchList from "../hooks/useFetchList";

const columns = [
    { key: 'id', label: 'ID' },
    { key: 'user_id', label: 'User ID' },
    { key: 'date', label: 'Date' },
      {
    key: "items",
    label: "Items",
    render: (items) =>
      items.map(i => `\"${i.name}\" x${i.quantity}`).join(", ")
  }
];

export default function Orders() {
    const orders = useFetchList(getOrders, "orders");
    return (
        <div>
            <h2>Orders</h2>
            <ObjectViewTable data={orders} columns={columns} />
            <h3>Create new Order</h3>
            <OrderCreationForm />
        </div>
    );
}