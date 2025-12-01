"use client";

import { useCallback, useEffect, useState } from "react";
import FiltersMenu, { FilterOption } from "@/app/oferta/components/FiltersMenu";
import ProductsList from "@/app/oferta/components/ProductsList";

interface Product {
  id: number;
  model?: string;
  slug?: string;
  price?: number;
  state?: string;
  short_description?: string;
  main_image?: { id?: string };
  brand?: { id?: string | number; name?: string };
  [key: string]: unknown;
}

export default function ClientCategoryPage({
  category,
  subcategory,
}: {
  category: string;
  subcategory?: string;
}) {
  const [products, setProducts] = useState<Product[]>([]);
  const [filters, setFilters] = useState<FilterOption[]>([]);
  const [selectedFilters, setSelectedFilters] = useState<Record<string, string[]>>({});
  const [loading, setLoading] = useState(false);

  /** ✅ Ustal aktywną kategorię (jeśli jest subkategoria, użyj jej) */
  const activeCategory = subcategory || category;

  /** 🔹 Pobranie produktów i filtrów */
  const loadInitialData = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        category: activeCategory,
      });

      const [productsRes, filtersRes] = await Promise.all([
        fetch(`/api/products?${params.toString()}`, { cache: "no-store" }),
        fetch(`/api/products/filters?category=${activeCategory}`, { cache: "no-store" }),
      ]);

      const productsJson = await productsRes.json();
      const filtersJson = await filtersRes.json();

      setProducts(productsJson.products ?? []);
      setFilters(filtersJson.filters ?? []);
    } catch (err) {
      console.error("⨯ Błąd ładowania danych kategorii:", err);
    } finally {
      setLoading(false);
    }
  }, [activeCategory]);

  useEffect(() => {
    loadInitialData();
  }, [loadInitialData]);

  /** 🔹 Filtrowanie produktów */
  const handleApplyFilters = async (filtersToApply: Record<string, string[]>) => {
    setSelectedFilters(filtersToApply);
    setLoading(true);

    const params = new URLSearchParams({ category: activeCategory });
    Object.entries(filtersToApply).forEach(([key, values]) => {
      if (values.length > 0) params.append(key, values.join(","));
    });

    try {
      const res = await fetch(`/api/products?${params.toString()}`, { cache: "no-store" });
      const data = await res.json();
      setProducts(data.products ?? []);
    } catch (e) {
      console.error("⨯ Błąd filtrowania produktów:", e);
    } finally {
      setLoading(false);
    }
  };

  /** 🔹 Czyszczenie filtrów */
  const handleClearFilters = async () => {
    setSelectedFilters({});
    await loadInitialData();
  };

  return (
    <div>
      {/* FILTRY */}
      {filters.length > 0 ? (
        <FiltersMenu
          availableFilters={filters}
          selected={selectedFilters}
          onSelectedChange={setSelectedFilters}
          onApplyFilters={handleApplyFilters}
          onClearFilters={handleClearFilters}
        />
      ) : (
        <p className="text-gray-500">Brak dostępnych filtrów.</p>
      )}

      {/* LISTA PRODUKTÓW */}
      {loading ? (
        <p className="mt-6 text-gray-500">Ładowanie produktów...</p>
      ) : (
        <ProductsList
          products={products}
          filtersMeta={filters}
          categorySlug={category}
          subcategory={subcategory}
        />
      )}
    </div>
  );
}