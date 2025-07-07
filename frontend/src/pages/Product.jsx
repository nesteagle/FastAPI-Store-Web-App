import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useShoppingCart } from "../context/CartContext";
import { getItem } from "../api/itemsApi";
import { useNotification } from "../context/NotificationContext";

export default function ProductPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [product, setProduct] = useState(null);
    const [imgError, setImgError] = useState(false);
    const [error, setError] = useState(null);
    const { addCartItem } = useShoppingCart();
    const [quantity, setQuantity] = useState(1);
    const { showToast } = useNotification();
    useEffect(() => {
        async function fetchItem() {
            try {
                setError(null);
                const data = await getItem(id);
                setProduct(data);
            } catch (err) {
                setError("Failed to fetch item. Please try again.");
                setProduct(null);
            }
        }
        fetchItem();
    }, [id]);

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[50vh]">
                <span className="text-error text-lg font-semibold mb-4">{error}</span>
                <button
                    className="bg-button text-text-white font-semibold px-5 py-2 rounded shadow hover:bg-button-hover transition"
                    onClick={() => navigate(-1)}
                >
                    ← Back to Catalog
                </button>
            </div>
        );
    }
    if (!product) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[50vh]">
                <svg className="w-12 h-12 text-surface-muted animate-spin mb-4" fill="none" viewBox="0 0 24 24">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                </svg>
                <span className="text-text-muted text-lg">Loading product...</span>
            </div>
        );
    }

    const validImageSrc = product.image_src && /^https?:\/\//.test(product.image_src);

    return (
        <main className="relative min-h-screen bg-gradient-to-b from-bg via-surface/60 to-bg/80 transition-colors duration-200 py-24 px-4 flex flex-col items-center">
            <div className="w-full max-w-7xl rounded-[2.5rem] shadow-2xl bg-bg-secondary border border-border-muted overflow-visible relative flex flex-col gap-20 px-0 md:px-12 py-20">
                <nav className="mb-8 px-8 text-sm text-text-muted flex items-center gap-2">
                    <span
                        className="hover:underline cursor-pointer text-text-primary"
                        onClick={() => navigate("/")}
                    >
                        Home
                    </span>
                    <span className="mx-1">/</span>
                    <span
                        className="hover:underline cursor-pointer text-text-primary"
                        onClick={() => navigate(-1)}
                    >
                        Catalog
                    </span>
                    <span className="mx-1">/</span>
                    <span className="text-text-primary font-semibold">{product.name}</span>
                </nav>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-24 px-8">
                    <div className="flex flex-col items-center justify-center relative">
                        <div className="absolute -inset-10 z-0 pointer-events-none rounded-3xl bg-gradient-to-tr from-accent/10 via-transparent to-accent/5 blur-2xl" />
                        {validImageSrc && !imgError ? (
                            <img
                                src={product.image_src}
                                alt={product.name}
                                onError={() => setImgError(true)}
                                className="relative z-10 max-h-[38rem] w-auto rounded-3xl shadow-2xl object-contain bg-bg-tertiary border-8 border-white"
                            />
                        ) : (
                            <div className="relative z-10 flex items-center justify-center w-96 h-96 rounded-3xl bg-bg-tertiary text-text-muted text-2xl font-semibold shadow-2xl border-8 border-white">
                                No Image
                            </div>
                        )}
                    </div>

                    <div className="flex flex-col justify-center pl-0 md:pl-12">
                        <h1 className="text-5xl font-display font-extrabold text-text-primary mb-6 leading-tight">{product.name}</h1>
                        <p className="text-text-accent text-4xl font-bold mb-8">${product.price.toFixed(2)}</p>

                        <section className="bg-bg-tertiary rounded-xl p-8 mb-10 shadow-sm">
                            <h2 className="text-xl font-bold mb-2 text-text-primary">Description</h2>
                            <p className="text-text-primary font-normal text-lg">{product.description}</p>
                        </section>

                        <div className="flex items-center gap-4 mt-2 mb-8">
                            <label htmlFor="quantity" className="text-lg font-semibold text-text-primary">
                                Quantity:
                            </label>
                            <input
                                id="quantity"
                                type="number"
                                min={1}
                                value={quantity}
                                onChange={e => setQuantity(Math.max(1, Number(e.target.value)))}
                                className="w-20 px-3 py-2 rounded border border-border-muted bg-bg-tertiary text-lg text-text-primary focus:outline-none focus:ring-2 focus:ring-ring-accent/50 transition"
                            />
                        </div>

                        <button
                            className="bg-button text-text-white font-semibold px-12 py-5 rounded-2xl shadow-xl hover:bg-button-hover  text-2xl flex w-full items-center focus:scale-icon active:scale-active transform transition-transform duration-150"
                            onClick={() => {
                                addCartItem(product, quantity);
                                {
                                    quantity > 1 ?
                                    showToast("Items added to cart!", "success") : showToast("Item added to cart!", "success")
                                }
                            }}
                        >
                            <span className="flex items-center gap-2">
                                {/* TODO: get icon*/}
                                Add to Cart
                            </span>
                            <span className="ml-auto text-text-white text-2xl font-bold text-right">
                                {quantity > 1
                                    ? `$${(product.price * quantity).toFixed(2)}`
                                    : `$${product.price.toFixed(2)}`}
                            </span>
                        </button>

                    </div>
                </div>
            </div>

            {/* for mobile */}
            <div className="fixed bottom-0 left-0 w-full bg-bg-secondary/90 backdrop-blur-lg shadow-t px-4 py-3 flex justify-between items-center md:hidden z-50">
                <span className="text-xl font-bold text-text-primary">{product.name}</span>
                <button
                    className="bg-button text-text-white font-semibold px-6 py-3 rounded-xl shadow hover:bg-button-hover transition text-lg"
                    onClick={() => addCartItem(product, 1)}
                >
                    Add to Cart
                </button>
            </div>
        </main>
    );
}