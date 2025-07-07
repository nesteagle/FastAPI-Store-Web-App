import { useState, useRef, useEffect } from "react";
import { useShoppingCart } from "../context/CartContext";
import ShoppingCart from "./ShoppingCart";

export default function ShoppingCartButton() {
    const { cart } = useShoppingCart();
    const [open, setOpen] = useState(false);
    const buttonRef = useRef();

    useEffect(() => {
        function handleClick(e) {
            if (buttonRef.current && !buttonRef.current.contains(e.target)) setOpen(false);
        }
        if (open) document.addEventListener("mousedown", handleClick);
        return () => document.removeEventListener("mousedown", handleClick);
    }, [open]);

    const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

    return (
        <div className="relative" ref={buttonRef}>
            <button
                className="relative flex items-center justify-center w-10 h-10 rounded-full bg-bg-tertiary hover:bg-button/10 transition hover:scale-icon-medium duration-200 focus:outline-none focus:ring-2 focus:ring-ring-accent/50"
                onClick={() => setOpen((v) => !v)}
                aria-label="Open shopping cart"
            >
                <svg className="w-6 h-6 text-text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2 9m13-9l2 9m-5-9V6a2 2 0 10-4 0v2"></path>
                </svg>
                {itemCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-error text-text-white text-xs font-bold px-2 py-0.5 rounded-full shadow">
                        {itemCount}
                    </span>
                )}
            </button>
            {open && (
                <ShoppingCart onClose={() => setOpen(false)} />
            )}
        </div>
    );
}