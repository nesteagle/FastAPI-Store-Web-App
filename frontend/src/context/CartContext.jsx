import { createContext, useContext, useState, useEffect } from "react";

const CartContext = createContext();

export function CartProvider({ children }) {
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
    function changeCartItem(product, quantity) {
        setCart((prevCart) => {
            const existing = prevCart.find((item) => item.id === product.id);
            if (existing) {
                return prevCart.map((item) =>
                    item.id === product.id ? { ...item, quantity } : item
                );
            } else {
                return [...prevCart, { ...product, quantity }];
            }
        });
    }

    // Accessed through "remove" button on cart
    function removeFromCart(productId) {
        setCart((prevCart) => prevCart.filter((item) => item.id !== productId));
    }

    // Accessed through "clear cart" and confirmation 
    function clearCart() {
        setCart([]);
    }

    return (
        <CartContext.Provider
            value={{
                cart,
                changeCartItem,
                removeFromCart,
                clearCart,
            }}
        >
            {children}
        </CartContext.Provider>
    );
}

export function useShoppingCart() {
    return useContext(CartContext);
}