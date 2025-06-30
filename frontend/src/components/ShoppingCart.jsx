import React, { useMemo } from "react";
import FormField from "./FormField";
import { createOrder } from "../api/orders";
import useCreationForm from "../hooks/useCreationForm";
import useFetchList from "../hooks/useFetchList";
import useShoppingCart from "../hooks/useShoppingCart";
import { getItems } from "../api/items";

export default function ShoppingCart() {
    const availableItems = useFetchList(getItems, "items");

    const initialState = { user_id: "" };
    const { formData, handleChange, handleSubmit: originalHandleSubmit } =
        useCreationForm(initialState, createOrder);

    const { cart, setItem } = useShoppingCart();

    const availableItemsMap = useMemo(() => {
        return availableItems.reduce((acc, item) => {
            acc[item.id] = item;
            return acc;
        }, {});
    }, [availableItems]);

    const handleCartUpdate = (item, newQuantity) => {
        setItem(item, newQuantity);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const payload = {
            ...formData,
            items: cart.map(cartItem => ({
                item_id: cartItem.id,
                quantity: cartItem.quantity
            }))
        };
        createOrder(payload);
    };

    return (
        <form className="order-form" onSubmit={handleSubmit}>
            <h3>Order Details</h3>
            <FormField
                label="Customer ID:"
                id="user_id"
                type="text"
                name="user_id"
                required
                value={formData.user_id}
                onChange={handleChange}
            />
            <div>
                <h4>Order Items:</h4>
                {cart.length === 0 ? (
                    <div>No items added.</div>
                ) : (
                    <ul>
                        {cart.map(cartItem => (
                            <li key={cartItem.id}>
                                {availableItemsMap[cartItem.id]
                                    ? `${availableItemsMap[cartItem.id].name} - $${availableItemsMap[cartItem.id].price}`
                                    : "Unknown item"}{" "}
                                <FormField
                                    type="number"
                                    min="1"
                                    value={cartItem.quantity}
                                    onChange={(e) =>
                                        handleCartUpdate(cartItem, Number(e.target.value))
                                    }
                                />
                                <button
                                    type="button"
                                    onClick={() =>
                                        handleCartUpdate(cartItem, cartItem.quantity - 1)
                                    }
                                >
                                    -
                                </button>
                                <button
                                    type="button"
                                    onClick={() =>
                                        handleCartUpdate(cartItem, cartItem.quantity + 1)
                                    }
                                >
                                    +
                                </button>
                            </li>
                        ))}
                    </ul>
                )}
            </div>

            <button type="submit">Create Order</button>
        </form>
    );
}