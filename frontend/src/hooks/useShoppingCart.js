import { useState, useEffect } from "react";

export default function useShoppingCart() {
    const [cart, setCart] = useState(() => {
        const storedCart = localStorage.getItem("shopping-cart");
        return storedCart ? JSON.parse(storedCart) : [];
    });

    useEffect(() => {
        localStorage.setItem("shopping-cart", JSON.stringify(cart));
    }, [cart]);

    const setItem = (item, quantity) => {
        setCart((prevCart) => {
            if (quantity <= 0) {
                return prevCart.filter((i) => i.id !== item.id);
            }
            const existingItem = prevCart.find((i) => i.id === item.id);
            if (existingItem) {
                return prevCart.map((i) =>
                    i.id === item.id ? { ...i, quantity } : i
                );
            }
            return [...prevCart, { ...item, quantity }];
        });
    };

    return { cart, setItem };
}