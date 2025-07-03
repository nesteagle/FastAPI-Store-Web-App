import { useState } from "react";
import { useShoppingCart } from "../context/CartContext";

export default function ProductCard({ product }) {
    const [imgError, setImgError] = useState(false);
    const validImageSrc = product.image_src && /^https?:\/\//.test(product.image_src);
    const { changeCartItem } = useShoppingCart();

    return (
        <div className="bg-surface rounded-xl shadow flex flex-col items-stretch p-4 transition hover:shadow-lg border border-surface-muted">
            {validImageSrc && !imgError ? (
                <img
                    src={product.image_src}
                    alt={product.name}
                    onError={() => setImgError(true)}
                    className="w-full aspect-square object-cover rounded-lg mb-4 bg-surface-muted"
                />
            ) : (
                <div className="w-full aspect-square flex items-center justify-center rounded-lg mb-4 bg-surface-muted text-text-muted text-sm">
                    No Image
                </div>
            )}
            <div className="flex-1 flex flex-col justify-between mb-4">
                <h3 className="font-display text-lg font-semibold text-primary mb-1 truncate">{product.name}</h3>
                <p className="text-accent font-bold text-base">${product.price.toFixed(2)}</p>
            </div>
            <button
                className="mt-auto bg-accent text-white font-semibold py-2 rounded shadow hover:bg-accent-hover transition"
                onClick={() => changeCartItem(product, 1)}
            >
                Add to Cart
            </button>
        </div>
    );
}