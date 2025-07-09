import { Link } from "react-router-dom";
import { useShoppingCart } from "../context/CartContext";
import { useNotification } from "../context/NotificationContext";
import CartItemList from "./CartItemList";
import { CartActionsPopup } from "./CartActions";
import Button from "./Button";

export default function ShoppingCart({ onClose }) {
    const { cart, changeCartItem, removeFromCart, clearCart } = useShoppingCart();
    const { showConfirm } = useNotification();

    async function handleClearCart() {
        const confirmed = await showConfirm({
            title: "Clear Cart",
            message: "Are you sure you want to remove all items from your cart? This action cannot be undone.",
            confirmLabel: "Clear Cart",
        });
        if (confirmed) {
            clearCart();
        }
    }

    return (
        <div className="absolute right-0 mt-2 w-96 max-w-[95vw] bg-bg-secondary rounded-xl shadow-2xl border border-border-muted z-50 p-6 animate-fade-in">
            <h2 className="text-xl font-display font-bold text-text-primary mb-4">Shopping Cart</h2>
            {cart.length === 0 ? (
                <div className="flex flex-col items-center py-8">
                    <svg className="w-12 h-12 text-surface-muted mb-4" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2 9m13-9l2 9m-5-9V6a2 2 0 10-4 0v2"></path>
                    </svg>
                    <p className="text-text-muted text-base mb-4">Your cart is empty.</p>
                    <Button variant="primary" onClick={onClose}>
                        <Link to="/catalog">Shop Products</Link>
                    </Button>
                </div>
            ) : (
                <>
                    <CartItemList cart={cart} changeCartItem={changeCartItem} removeFromCart={removeFromCart} variant="popup" />
                    <CartActionsPopup
                        onClearCart={handleClearCart}
                        onClose={onClose}
                    />
                </>
            )}
        </div>
    );
}
