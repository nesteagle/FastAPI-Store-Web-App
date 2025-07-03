import { Link } from "react-router-dom";
import FormField from "./FormField";
import { useShoppingCart } from "../context/CartContext";
import { useNotification } from "../context/NotificationContext";

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
        <div className="absolute right-0 mt-2 w-96 max-w-[95vw] bg-surface rounded-xl shadow-2xl border border-surface-muted z-50 p-6 animate-fade-in">
            <h2 className="text-xl font-display font-bold text-primary mb-4">Shopping Cart</h2>
            {cart.length === 0 ? (
                <div className="flex flex-col items-center py-8">
                    <svg className="w-12 h-12 text-surface-muted mb-4" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2 9m13-9l2 9m-5-9V6a2 2 0 10-4 0v2"></path>
                    </svg>
                    <p className="text-text-muted text-base">Your cart is empty.</p>
                    <Link
                        to="/items"
                        className="mt-4 inline-block bg-accent text-white font-semibold px-4 py-2 rounded shadow hover:bg-accent-hover transition"
                        onClick={onClose}
                    >
                        Shop Products
                    </Link>
                </div>
            ) : (
                <>
                    <ul className="divide-y divide-surface-muted mb-4 max-h-64 overflow-y-auto">
                        {cart.map((item) => (
                            <li key={item.id} className="flex items-center justify-between py-3">
                                <div className="flex items-center gap-3">
                                    <img src={item.image_src} alt={item.name} className="w-12 h-12 object-cover rounded border border-surface-muted bg-surface-muted" />
                                    <div>
                                        <span className="block font-medium text-primary">{item.name}</span>
                                        <span className="block text-xs text-text-muted">${item.price.toFixed(2)}</span>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <FormField
                                        label="Qty"
                                        id={`quantity-${item.id}`}
                                        type="number"
                                        name="quantity"
                                        min={1}
                                        value={String(item.quantity)}
                                        onChange={(e) => {
                                            const newQuantity = parseInt(e.target.value, 10);
                                            if (newQuantity >= 1) {
                                                changeCartItem(item, newQuantity);
                                            }
                                        }}
                                    />
                                    <button
                                        className="w-full text-left px-2 py-1.5 rounded text-error hover:bg-error/10 transition"
                                        onClick={() => removeFromCart(item.id)}
                                        aria-label={`Remove ${item.name} from cart`}
                                    >
                                        Remove
                                    </button>
                                </div>
                            </li>
                        ))}
                    </ul>
                    <div className="flex flex-col gap-3">
                        <div className="flex justify-between items-center">
                            <span className="text-base font-semibold text-primary">Total:</span>
                            <span className="text-lg font-bold text-primary">
                                ${cart.reduce((sum, item) => sum + item.price * item.quantity, 0).toFixed(2)}
                            </span>
                        </div>
                        <div className="flex gap-2">
                            <button
                                className="bg-error text-white px-3 py-2 rounded shadow hover:bg-error-deep transition w-1/2"
                                onClick={handleClearCart}
                            >
                                Clear Cart
                            </button>
                            <Link
                                to="/checkout"
                                className="bg-accent text-white font-semibold px-3 py-2 rounded shadow hover:bg-accent-hover transition w-1/2 text-center"
                                onClick={onClose}
                            >
                                Checkout
                            </Link>
                        </div>
                        <Link
                            to="/catalog"
                            className="block text-accent font-semibold hover:underline transition text-center mt-2"
                            onClick={onClose}
                        >
                            Add More Items
                        </Link>
                    </div>
                </>
            )}
        </div>
    );
}
