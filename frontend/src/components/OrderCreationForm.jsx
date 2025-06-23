import FormField from "./FormField";
import { createOrder } from "../api/orders";
import useCreationForm from "../hooks/useCreationForm";
import useFetchList from "../hooks/useFetchList";
import { getItems } from "../api/items";

export default function OrderCreationForm() {
    const availableItems = useFetchList(getItems, "items");

    const initialState = {
        user_id: "",
        items: []
    };

    const { formData, handleChange, handleSubmit, setFormData } = useCreationForm(initialState, createOrder);

    const handleItemSelect = (e) => {
        const selectedId = e.target.value;
        const selectedItem = availableItems.find(item => String(item.id) === selectedId);
        if (selectedItem && !formData.items.some(item => item.item_id === selectedItem.id)) {
            setFormData(prev => ({
                ...prev,
                items: [...prev.items, { item_id: selectedItem.id, quantity: 1 }]
            }));
        }
    };

    const handleQuantityChange = (item_id, quantity) => {
        setFormData(prev => ({
            ...prev,
            items: prev.items.map(item =>
                item.item_id === item_id ? { ...item, quantity: Number(quantity) } : item
            )
        }));
    };

    const handleRemoveItem = (item_id) => {
        setFormData(prev => ({
            ...prev,
            items: prev.items.filter(item => item.item_id !== item_id)
        }));
    };

    return (
        <form className="order-form" onSubmit={handleSubmit}>
            <FormField
                label="Customer ID:"
                id="user_id"
                type="text"
                name="user_id"
                required
                value={formData.user_id}
                onChange={handleChange}
            />
            <label htmlFor="items">Add Item:</label>
            <select id="items" onChange={handleItemSelect} value="">
                <option value="" disabled>Select an item</option>
                {availableItems
                    .filter(item => !formData.items.some(oi => oi.item_id === item.id))
                    .map(item => (
                        <option key={item.id} value={item.id}>
                            {item.name} - ${item.price}
                        </option>
                    ))}
            </select>
            <div>
                <h4>Order Items:</h4>
                {formData.items.length === 0 && <div>No items added.</div>}
                <ul>
                    {formData.items.map(orderItem => {
                        const item = availableItems.find(i => i.id === orderItem.item_id);
                        return (
                            <li key={orderItem.item_id}>
                                {item ? `${item.name} - $${item.price}` : "Unknown item"} &nbsp;
                                <input
                                    type="number"
                                    min="1"
                                    value={orderItem.quantity}
                                    onChange={e => handleQuantityChange(orderItem.item_id, e.target.value)}
                                    style={{ width: 60 }}
                                />
                                <button type="button" onClick={() => handleRemoveItem(orderItem.item_id)}>
                                    Remove
                                </button>
                            </li>
                        );
                    })}
                </ul>
            </div>
            <button type="submit">Create Order</button>
        </form>
    );
}