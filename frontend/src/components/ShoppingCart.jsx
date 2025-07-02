import React from "react";
import { Link } from "react-router-dom";
import FormField from "./FormField";
import useShoppingCart from "../hooks/useShoppingCart";

export default function ShoppingCart() {
    const { cart, changeCartItem, removeFromCart, clearCart } = useShoppingCart();

    return (
        <div>
            <h2>Shopping Cart</h2>
            {cart.length === 0 ? (
                <p>Your cart is empty.</p>
            ) : (
                <ul>
                    {cart.map((item) => (
                        <li key={item.id}>
                            <span>{item.name}</span>
                            <FormField
                                label="Quantity:"
                                id={`quantity-${item.id}`}
                                type="number"
                                name="quantity"
                                value={String(item.quantity)}
                                onChange={(e) => {
                                    const newQuantity = parseInt(e.target.value, 10);
                                    if (newQuantity >= 1) {
                                        changeCartItem(item, newQuantity);
                                    }
                                }}
                            />
                            <button
                                onClick={() => removeFromCart(item.id)}
                            >
                                Remove
                            </button>
                        </li>
                    ))}
                </ul>
            )}
            {cart.length > 0 && (
                <button
                    onClick={clearCart}
                >
                    Clear Cart
                </button>
            )}
            <Link
                to="/items"
            >
                Add Items
            </Link>
        </div>
    );
}