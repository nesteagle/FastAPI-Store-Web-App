import { useState, useEffect } from "react";

export default function useShoppingCart() {
    const STORAGE_KEY = "cart";

    const [cart, setCart] = useState(() => {
        try {
            const storedCart = localStorage.getItem(STORAGE_KEY);
            return storedCart ? JSON.parse(storedCart) : [];
        } catch (error) {
            console.error("Failed to read shopping cart from localStorage", error);
            return [];
        }
    });

    useEffect(() => {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
        } catch (error) {
            console.error("Failed to save shopping cart to localStorage", error);
        }
    }, [cart]);

    // handles item quantity change (adding, removing)
    // quantity must be >=1
    const changeCartItem = (item, quantity) => {
        setCart((prevCart) => {
            const sameItem = prevCart.find((cartItem) => cartItem.id === item.id);
            if (sameItem) {
                return prevCart.map((cartItem) =>
                    cartItem.id === item.id
                        ? { ...cartItem, quantity: quantity }
                        : cartItem
                );
            } else {
                return [...prevCart, { ...item, quantity: quantity }];
            }
        });
    };

    // Accessed through "remove" button on cart
    const removeFromCart = (itemId) => {
        setCart((prevCart) => prevCart.filter((item) => item.id !== itemId));
    };

    // Accessed through "clear cart" and confirmation 
    const clearCart = () => {
        setCart([]);
    };

    return { cart, setCart, changeCartItem, removeFromCart, clearCart };
}