import { useState } from "react";
import { Link } from 'react-router-dom';
import { useShoppingCart } from "../context/CartContext";
import { useNotification } from "../context/NotificationContext";

export default function ProductCard({ product, showAddToCart }) {
    const [imgError, setImgError] = useState(false);
    const validImageSrc = product.image_src && /^https?:\/\//.test(product.image_src);
    const { cart, addCartItem } = useShoppingCart();
    const { showToast } = useNotification();
    return (
        <div className="group bg-surface rounded-2xl shadow-lg flex flex-col items-stretch p-5 border border-surface-muted transition-all duration-200 hover:shadow-2xl hover:border-accent/70 relative overflow-hidden">
            <div className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-tr from-accent/5 via-transparent to-accent/8 rounded-2xl" />

            {validImageSrc && !imgError ? (
                <img
                    src={product.image_src}
                    alt={product.name}
                    onError={() => setImgError(true)}
                    className="w-full aspect-square object-cover rounded-xl mb-4 bg-surface-muted shadow-sm transition-transform duration-200 group-hover:scale-105"
                />
            ) : (
                <div className="w-full aspect-square flex items-center justify-center rounded-xl mb-4 bg-surface-muted text-text-muted text-sm">
                    No Image
                </div>
            )}

            <div className="flex-1 flex flex-col justify-between mb-4">
                <h3 className="font-display text-lg font-bold text-text mb-1 truncate">{product.name}</h3>
                <p className="text-accent font-extrabold text-xl">${product.price.toFixed(2)}</p>
            </div>

            <div className="flex flex-col gap-2 mt-auto">
                {showAddToCart && <button
                    className="bg-accent text-white font-semibold py-2 rounded-lg shadow hover:bg-accent-hover transition focus:outline-none focus:ring-2 focus:ring-accent/50"
                    onClick={() => {
                        addCartItem(product, 1);
                        showToast("Item added to cart!", "success");
                    }}
                >
                    Add to Cart
                </button>}
                <Link
                    to={`/products/${product.id}`}
                    className="inline-block text-center bg-surface-muted text-text font-semibold py-2 rounded-lg border border-surface-muted shadow-sm hover:bg-accent/10 hover:text-accent transition focus:outline-none focus:ring-2 focus:ring-accent/30"
                >
                    View Product
                </Link>
            </div>
        </div>
    );
}