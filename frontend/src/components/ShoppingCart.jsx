import { Link } from "react-router-dom";
import { useShoppingCart } from "../context/CartContext";
import { useNotification } from "../context/NotificationContext";
import CartItemList from "./CartItemList";
import { CartActionsPopup } from "./CartActions";
import Button from "./Button";
import Icon from "./Icon";
import Menu from "./Menu";

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
        <Menu className="w-112 max-w-[85vw]">
            <h2 className="text-2xl font-sans font-semibold text-text-primary mb-2 mt-2 ml-2">Shopping Cart</h2>
            {cart.length === 0 ? (
                <div className="flex flex-col items-center py-8">
                    <Icon name="cart" size={48} className="text-text-muted ml-2 mb-4" />
                    <p className="text-text-muted text-lg mb-4">Your cart is empty.</p>
                    <Button variant="primary" onClick={onClose} className="rounded-full">
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
        </Menu>
    );
}
