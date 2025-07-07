import { Link } from "react-router-dom";

export function CartActionsPopup({
    onClearCart,
    onClose,
}) {
    return (
        <div className="flex flex-col gap-3 mt-4">
            <div className="flex gap-2">
                <button
                    className="bg-error text-text-white px-3 py-2 rounded shadow font-semibold hover:bg-error-deep transition w-1/2"
                    onClick={onClearCart}
                >
                    Clear Cart
                </button>

                <Link
                    to="/checkout"
                    className="bg-button text-text-white font-semibold px-3 py-2 rounded shadow hover:bg-button-hover transition w-1/2 text-center"
                    onClick={onClose}
                >
                    Checkout
                </Link>
            </div>
            <Link
                to="/catalog"
                className="block text-text-accent font-semibold hover:underline transition text-center mt-2"
                onClick={onClose}
            >
                Add More Items
            </Link>

        </div>
    );
}

export function CartActionsCheckout({
    onClearCart,
    checkoutButton,
}) {
    return (
        <nav
            aria-label="Cart actions"
            className="w-full mt-8 flex flex-col items-center gap-6"
        >
            {/* Add More Items Button */}
            <Link
                to="/catalog"
                className="
          inline-flex items-center gap-2 px-6 py-3 rounded-full
          bg-bg-tertiary text-text-accent font-semibold shadow-sm
          hover:bg-button hover:text-text-white focus:bg-button focus:text-text-white
          focus:outline-none focus:ring-2 focus:ring-ring-accent/50 focus:ring-offset-2
          transition
          text-base
          group
        "
                tabIndex={0}
            >
                <svg
                    className="w-5 h-5 text-text-accent group-hover:text-text-white group-focus:text-text-white transition"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                >
                    <path d="M12 4v16m8-8H4" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                Add More Items
            </Link>

            {/* Clear Cart Button */}
            <button
                type="button"
                onClick={onClearCart}
                className="
          inline-flex items-center gap-2 px-6 py-3 rounded-full
          bg-error/90 text-text-white font-semibold shadow-sm
          hover:bg-error-deep focus:bg-error-deep
          focus:outline-none focus:ring-2 focus:ring-error/50 focus:ring-offset-2
          transition
          text-base
        "
            >
                <svg
                    className="w-5 h-5 text-text-white"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                >
                    <path d="M6 18L18 6M6 6l12 12" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                Clear Cart
            </button>

            {/* Checkout Button (passed as a prop for flexibility) */}
            <div className="w-full">
                {checkoutButton}
            </div>
        </nav>
    );
}