// TODO: finish implementing checkout using stripe
import { useAuth0 } from "@auth0/auth0-react";
import { useAuthenticatedApi } from "../hooks/useApi";
import { useShoppingCart } from "../context/CartContext";

export default function CheckoutButton() {
    const { isAuthenticated } = useAuth0();
    const { callApi } = useAuthenticatedApi();
    const { cart } = useShoppingCart();

    const handleCheckout = async () => {
        if (!isAuthenticated) return;
        const response = await callApi("/create-checkout-session/", "POST", cart);
        window.location.href = response.url; // Redirect to Stripe Checkout
    };

    return (
        <button
            className="bg-blue-600 text-white px-4 py-2 rounded"
            onClick={handleCheckout}
        >
            Checkout
        </button>
    );
}