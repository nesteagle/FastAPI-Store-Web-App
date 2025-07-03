import { useState, useEffect, useMemo } from "react";
import ProductGrid from "../components/ProductGrid";
import { getItems } from "../api/itemsApi";

export default function Catalog({ selectedCategory }) {
    const [category, setCategory] = useState(selectedCategory || "all");
    const [items, setItems] = useState([]);
    const categories = ["Featured"]; // look into implementing categories

    useEffect(() => {
        async function fetchItems() {
            try {
                const data = await getItems();
                console.log(data);
                setItems(data);
            } catch (error) {
                console.error("Failed to fetch items:", error);
            }
        }
        fetchItems();
    }, []);

    const filteredProducts = useMemo(() => {
        if (category === "all") {
            return items;
        }
        if (category.toLowerCase() === "featured") {
            // TODO: possibly implement a featured selection. currently choosing first 8 items
            return items.slice(0, 8);
        }
        return items.filter((item) => item.category === category);
    }, [category, items]);

    return (
        <main class="min-h-screen bg-bg transition-colors duration-200 pb-16">
            <section class="relative pt-12 pb-6 mb-6 bg-gradient-to-r from-accent/5 via-bg to-accent/5">
                <div class="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
                    <div>
                        <h1 class="text-3xl md:text-4xl font-display font-extrabold text-primary tracking-tight mb-2">
                            {category === "all" ? "All Products" : `${category} Products`}
                        </h1>
                        <p class="text-text-muted text-lg max-w-2xl">
                            Discover our curated selection of quality items. Browse, filter, and find your next favorite product.
                        </p>
                    </div>
                    <div class="flex gap-2 flex-wrap">
                        <button
                            class={`px-4 py-2 rounded-full font-semibold transition
                                ${category === "all"
                                    ? "bg-accent text-white shadow"
                                    : "bg-surface-muted text-primary hover:bg-accent hover:text-white"}`}
                            onClick={() => setCategory("all")}
                        >
                            All
                        </button>
                        {categories.map((cat) => (
                            <button
                                key={cat}
                                class={`px-4 py-2 rounded-full font-semibold transition
                                    ${category === cat
                                        ? "bg-accent text-white shadow"
                                        : "bg-surface-muted text-primary hover:bg-accent hover:text-white"}`}
                                onClick={() => setCategory(cat)}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                </div>
                <div class="absolute left-0 bottom-0 w-full h-1 bg-gradient-to-r from-accent/30 via-accent/0 to-accent/30 pointer-events-none" />
            </section>

            <section class="max-w-7xl mx-auto px-6">
                {filteredProducts.length ? (
                    <ProductGrid products={filteredProducts} />
                ) : (
                    <div class="flex flex-col items-center py-24">
                        <svg class="w-16 h-16 text-surface-muted mb-4" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
                            <path d="M8 12l2 2 4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        <p class="text-text-muted text-lg">No products found in this category.</p>
                    </div>
                )}
            </section>
        </main>
    );
}