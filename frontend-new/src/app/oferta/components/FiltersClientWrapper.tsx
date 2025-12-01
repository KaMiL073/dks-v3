"use client";

import { useCallback, useEffect, useState } from "react";
import FiltersMenu, { FilterOption } from "@/app/oferta/components/FiltersMenu";
import ProductsList from "@/app/oferta/components/ProductsList";

/** 🔹 Typ produktu */
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
}: {
  category: string;
}) {
  const [products, setProducts] = useState<Product[]>([]);
  const [filters, setFilters] = useState<FilterOption[]>([]);
  const [selectedFilters, setSelectedFilters] = useState<
    Record<string, string[]>
  >({});
  const [loading, setLoading] = useState(false);

  const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

  /**
   * 🔹 Funkcja pobierająca dane początkowe (produkty + filtry)
   * — opakowana w useCallback, by uniknąć błędu react-hooks/exhaustive-deps
   */
  const loadInitialData = useCallback(async () => {
    setLoading(true);
    try {
      const [productsRes, filtersRes] = await Promise.all([
        fetch(`${baseUrl}/api/products?category=${category}`, {
          cache: "no-store",
        }),
        fetch(`${baseUrl}/api/products/filters?category=${category}`, {
          cache: "no-store",
        }),
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
  }, [baseUrl, category]);

  // 🔹 Załaduj dane przy zmianie kategorii
  useEffect(() => {
    loadInitialData();
  }, [loadInitialData]);

  /**
   * 🔹 Obsługa przycisku "Filtruj"
   */
  const handleApplyFilters = async (filtersToApply: Record<string, string[]>) => {
    setSelectedFilters(filtersToApply);
    setLoading(true);

    const params = new URLSearchParams({ category });
    Object.entries(filtersToApply).forEach(([key, values]) => {
      if (values.length > 0) {
        values.forEach((v) => params.append(key, v));
      }
    });

    try {
      const res = await fetch(`${baseUrl}/api/products?${params.toString()}`, {
        cache: "no-store",
      });
      const data = await res.json();
      setProducts(data.products ?? []);
    } catch (e) {
      console.error("⨯ Błąd filtrowania produktów:", e);
    } finally {
      setLoading(false);
    }
  };

  /**
   * 🔹 Wyczyść filtry
   */
  const handleClearFilters = async () => {
    setSelectedFilters({});
    await loadInitialData();
  };

  return (
    <div>
      {/* 🔹 Sekcja filtrów */}
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

      {/* 🔹 Sekcja produktów */}
      {loading ? (
        <p className="mt-6 text-gray-500">Ładowanie produktów...</p>
      ) : (
        <ProductsList products={products} filtersMeta={filters} />
      )}
    </div>
  );
}