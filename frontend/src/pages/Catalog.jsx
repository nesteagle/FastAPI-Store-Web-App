import { useState, useEffect, useMemo } from "react";
import ProductGrid from "../components/ProductGrid";
import { getItems } from "../api/itemsApi";

export default function Catalog({ selectedCategory }) {
    const [category, setCategory] = useState(selectedCategory || "all");
    const [items, setItems] = useState([]);
    const [search, setSearch] = useState("");
    const categories = ["Featured"]; // Expand as needed

    useEffect(() => {
        async function fetchItems() {
            try {
                const data = await getItems();
                setItems(data);
            } catch (error) {
                console.error("Failed to fetch items:", error);
            }
        }
        fetchItems();
    }, []);

    const filteredProducts = useMemo(() => {
        let filtered = items;
        if (category !== "all") {
            if (category.toLowerCase() === "featured") {
                filtered = items.slice(0, 8);
            } else {
                filtered = items.filter(item => item.category === category);
            }
        }
        if (search.trim()) {
            const query = search.trim().toLowerCase();
            filtered = filtered.filter(item =>
                item.name.toLowerCase().includes(query) ||
                (item.description && item.description.toLowerCase().includes(query))
            );
        }
        return filtered;
    }, [category, items, search]);

    return (
        <main className="min-h-screen bg-bg transition-colors duration-200 pb-16">
            <section className="relative pt-12 pb-12 bg-gradient-to-r from-accent/5 via-bg to-accent/5">
                <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
                    <div>
                        <h1 className="text-3xl md:text-4xl font-display font-extrabold text-primary tracking-tight mb-2">
                            {category === "all" ? "All Products" : `${category} Products`}
                        </h1>
                        <p className="text-text-muted text-lg max-w-2xl">
                            Discover our curated selection of quality items. Browse, filter, and find your next favorite product.
                        </p>
                    </div>
                    <div className="flex gap-2 flex-wrap">
                        <button
                            className={`px-4 py-2 rounded-full font-semibold transition
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
                                className={`px-4 py-2 rounded-full font-semibold transition
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
                {/* Section for search bar with subtle contrast */}
            </section>
            <section className="w-full bg-white/80 backdrop-blur-sm shadow-md py-6 mb-6">
                <div className="max-w-7xl mx-auto px-6 flex justify-center">
                    <div className="relative w-full max-w-xl">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-accent">
                            {/* Magnifying glass icon */}
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                <circle cx="11" cy="11" r="8" />
                                <line x1="21" y1="21" x2="16.65" y2="16.65" strokeLinecap="round" />
                            </svg>
                        </span>
                        <input
                            id="catalog-search"
                            type="text"
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            placeholder={`Search ${category.toLowerCase()} products...`}
                            className="w-full pl-12 pr-14 py-4 rounded-full border-2 border-accent/30 bg-white shadow-lg text-lg focus:outline-none focus:ring-2 focus:ring-accent/40 transition placeholder:text-accent/60"
                            aria-label="Search products"
                        />                        
                        {search && (
                            <button
                                aria-label="Clear search"
                                className="absolute top-2 right-4 flex items-center text-text-muted hover:text-accent text-4xl"
                                onClick={() => setSearch("")}
                            >
                                &times;
                            </button>
                        )}

                    </div>
                </div>
            </section>
            <section className="max-w-7xl mx-auto px-6">
                {filteredProducts.length ? (
                    <ProductGrid products={filteredProducts} />
                ) : (
                    <div className="flex flex-col items-center py-24">
                        {/* <svg className="w-16 h-16 bg-gray-100 mb-4" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
                            <path d="M8 12l2 2 4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg> 
                        REFACTOR TO MAGINIFIYING GLASS or other icon
                        */}

                        <p className="text-text-muted text-lg">No products found in this category.</p>
                    </div>
                )}
            </section>
        </main>
    );
}