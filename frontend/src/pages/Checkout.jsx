import { useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { useAuthenticatedApi } from "../hooks/useApi";
import { useShoppingCart } from "../context/CartContext";
import CartItemList from "../components/CartItemList";
import { useNotification } from "../context/NotificationContext";
import { CartActionsCheckout } from "../components/CartActions";
import Main from "../components/Main";
import Button from "../components/Button";

export default function CheckoutPage() {
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

    const cartTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

    return (
        <Main className="py-12">
            <section className="max-w-5xl mx-auto px-4 md:px-8 grid grid-cols-1 md:grid-cols-3 gap-10">
                <div className="md:col-span-2 bg-bg-primary rounded-3xl shadow-2xl border border-border-muted p-8 flex flex-col">
                    <h1 className="text-3xl md:text-4xl font-display font-extrabold text-text-primary mb-4">
                        Order Summary
                    </h1>
                    <p className="text-text-muted text-lg mb-8">
                        Review your order and adjust quantities before checkout.
                    </p>
                    {cart.length === 0 ? (
                        <div className="flex flex-col items-center py-20">
                            <svg className="w-16 h-16 text-surface-muted mb-4" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2 9m13-9l2 9m-5-9V6a2 2 0 10-4 0v2"></path>
                            </svg>
                            <div className="text-text-muted text-lg">Your cart is empty.</div>
                        </div>
                    ) : (
                        <>
                            <CartItemList
                                cart={cart}
                                changeCartItem={changeCartItem}
                                removeFromCart={removeFromCart}
                                variant="checkout"
                            />
                            <div className="flex justify-between items-center mt-8 mb-4">
                                <span className="text-base font-semibold text-text-primary">
                                    Total:
                                </span>
                                <span className="text-lg font-bold text-text-primary">
                                    ${cartTotal.toFixed(2)}
                                </span>
                            </div>
                            <CartActionsCheckout
                                onClearCart={handleClearCart}
                                checkoutButton={null}
                            />
                        </>
                    )}
                </div>

                <aside className="bg-bg-primary rounded-3xl shadow-2xl border border-border-muted p-8 flex flex-col gap-8 sticky top-24 self-start">
                    <h2 className="text-2xl font-bold mb-4 text-text-primary">Checkout</h2>
                    <div>
                        <span className="block text-base text-text-primary font-semibold mb-2 text-text-primary">Order Total</span>
                        <span className="text-2xl font-bold text-text-primary">
                            ${cartTotal.toFixed(2)}
                        </span>
                    </div>
                    <CheckoutButton />
                    <div className="flex items-center gap-3 mt-4">
                        <img
                            src="/stripe-logo.svg"
                            alt="Stripe"
                            className="h-6"
                            loading="lazy"
                        />
                        <span className="text-text-muted text-sm">Secured by Stripe.</span>
                    </div>
                    <div className="text-xs text-text-muted mt-2">
                        By checking out, you agree to being cool and amazing!
                    </div>
                </aside>
            </section>
        </Main>
    );
}
export function CheckoutButton() {
    const { isAuthenticated } = useAuth0();
    const { callApi } = useAuthenticatedApi();
    const { cart } = useShoppingCart();
    const [processing, setProcessing] = useState(false);
    const handleCheckout = async () => {
        if (!isAuthenticated) return;
        setProcessing(true);
        const response = await callApi("/create-checkout-session/", "POST", formatCart(cart));
        setProcessing(false);
        window.location.href = response.url;
    };

    const formatCart = (cart) => {
        const data = cart.map(item => ({
            id: item.id,
            qty: item.quantity
        }));
        return JSON.stringify(data);
    };

    return (
        <Button
            variant="primary"
            size="xl"
            onClick={handleCheckout}
            disabled={processing}
            className="w-full flex items-center justify-center gap-3 rounded-2xl shadow-xl"
        >
            <svg className="w-6 h-6 text-text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true" >
                <rect x="3" y="11" width="18" height="10" rx="2" />
                <path d="M7 11V7a5 5 0 0110 0v4" />
            </svg>
            {processing ? "Processing..." : "Checkout"}
        </Button>
    );
}