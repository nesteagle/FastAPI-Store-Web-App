import { useMemo } from "react"
import ProductGrid from "../components/ProductGrid";
import useProductFilters from "../hooks/useProducts"
import useFetchList from "../hooks/useFetchList";
export default function Catalog() {
    const fetchFunction = useMemo(() => ({
        endpoint: "/items/",
        method: "GET"
    }), []);
    const { data, isDataLoading, error } = useFetchList(fetchFunction, "items", "items_cache");
    const { category, setCategory, categories, search, setSearch, products } = useProductFilters(data);
    return (
        <main className="min-h-screen bg-bg-primary transition-colors duration-200 pb-16">
            <section className="relative pt-12 pb-12 bg-gradient-to-r from-accent/5 via-bg to-accent/5">
                <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
                    <div>
                        <h1 className="text-3xl md:text-4xl font-display font-extrabold text-text-primary tracking-tight mb-2">
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
                                    ? "bg-button text-text-white shadow"
                                    : "bg-bg-tertiary text-text-primary hover:bg-button hover:text-text-white"}`}
                            onClick={() => setCategory("all")}
                        >
                            All
                        </button>
                        {categories.map((cat) => (
                            <button
                                key={cat}
                                className={`px-4 py-2 rounded-full font-semibold transition
                                    ${category === cat
                                        ? "bg-button text-text-white shadow"
                                        : "bg-bg-tertiary text-text-primary hover:bg-button hover:text-text-white"}`}
                                onClick={() => setCategory(cat)}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                </div>
                {/* Section for search bar with subtle contrast */}
            </section>
            <section className="w-full bg-bg-secondary backdrop-blur-sm shadow-md py-6 mb-6">
                <div className="max-w-7xl mx-auto px-6 flex justify-center">
                    <div className="relative w-full max-w-xl">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-text-accent">
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
                            className="w-full pl-12 pr-14 py-4 rounded-full border-2 border-accent/30 bg-bg-tertiary shadow-lg text-lg focus:outline-none focus:ring-2 focus:ring-ring-accent/40 transition placeholder:text-text-accent/60"
                            aria-label="Search products"
                        />
                        {search && (
                            <button
                                aria-label="Clear search"
                                className="absolute top-2 right-4 flex items-center text-text-muted hover:text-text-accent text-4xl"
                                onClick={() => setSearch("")}
                            >
                                &times;
                            </button>
                        )}

                    </div>
                </div>
            </section>
            <section className="max-w-7xl mx-auto px-6">
                {isDataLoading ? (
                    <div className="flex flex-col items-center py-24">
                        {/* Spinner icon or skeleton loader */}
                        <svg className="w-12 h-12 animate-spin text-text-accent mb-4" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                        </svg>
                        <p className="text-text-muted text-lg">Loading products...</p>
                    </div>
                ) : error ? (
                    <div className="flex flex-col items-center py-24">
                        <svg className="w-12 h-12 text-error mb-4" fill="none" viewBox="0 0 24 24">
                            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
                            <path d="M12 8v4m0 4h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        <p className="text-error text-lg">Failed to load products. Please try again later.</p>
                    </div>
                ) : products.length ? (
                    <ProductGrid products={products} />
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