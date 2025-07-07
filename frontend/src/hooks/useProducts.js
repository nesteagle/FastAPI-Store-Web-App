import { useState, useMemo } from "react";

export default function useProductFilters(items = []) {
  const [category, setCategory] = useState("all");
  const [search, setSearch] = useState("");

  const categories = ["Featured"]

  const filteredProducts = useMemo(() => {
    let filtered = items;
    if (category !== "all") {
      filtered =
        category === "Featured"
          ? items.slice(0, 8)
          : items.filter(item => item.category === category);
    }
    if (search.trim()) {
      const query = search.trim().toLowerCase();
      filtered = filtered.filter(
        item =>
          item.name.toLowerCase().includes(query) ||
          (item.description && item.description.toLowerCase().includes(query))
      );
    }
    return filtered;
  }, [items, category, search]);

  return {
    category,
    setCategory,
    categories,
    search,
    setSearch,
    products: filteredProducts,
  };
}