"use client";

import { useCallback, useEffect, useState } from "react";
import FiltersMenu, { FilterOption } from "@/app/oferta/components/FiltersMenu";
import ProductsList from "@/app/oferta/components/ProductsList";

interface FilterField {
  field: string;
  label: string;
  options?: { text: string; value: string }[];
}

interface Product {
  id: number;
  model?: string;
  slug?: string;
  price?: number;
  state?: string;
  short_description?: string;
  main_image?: { id?: string };
  brand?: { id?: string | number; name?: string };
  primarycategory?: string | null;
  filtersMeta?: FilterField[];
  [key: string]: unknown;
}

const FILTER_PREFIX = "f__";

export default function ClientCategoryPage({ category }: { category: string }) {
  const [products, setProducts] = useState<Product[]>([]);
  const [filters, setFilters] = useState<FilterOption[]>([]);
  const [selectedFilters, setSelectedFilters] = useState<Record<string, string[]>>({});
  const [loading, setLoading] = useState(false);

  const loadInitialData = useCallback(async () => {
    setLoading(true);

    try {
      const [productsRes, filtersRes] = await Promise.all([
        fetch(`/api/products?category=${encodeURIComponent(category)}`, { cache: "no-store" }),
        fetch(`/api/products/filters?category=${encodeURIComponent(category)}`, {
          cache: "no-store",
        }),
      ]);

      const productsJson = await productsRes.json();
      const filtersJson = await filtersRes.json();

      setProducts(productsJson.products ?? []);
      setFilters(filtersJson.filters ?? []);
    } catch (err) {
      console.error("⨯ Błąd ładowania danych kategorii:", err);
      setProducts([]);
      setFilters([]);
    } finally {
      setLoading(false);
    }
  }, [category]);

  useEffect(() => {
    loadInitialData();
  }, [loadInitialData]);

  const handleApplyFilters = async (filtersToApply: Record<string, string[]>) => {
    setSelectedFilters(filtersToApply);
    setLoading(true);

    const params = new URLSearchParams({ category });

    Object.entries(filtersToApply).forEach(([key, values]) => {
      if (!values.length) return;
      params.set(`${FILTER_PREFIX}${key}`, values.join(","));
    });

    try {
      const res = await fetch(`/api/products?${params.toString()}`, { cache: "no-store" });
      const data = await res.json();
      setProducts(data.products ?? []);
    } catch (e) {
      console.error("⨯ Błąd filtrowania produktów:", e);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const handleClearFilters = async () => {
    setSelectedFilters({});
    await loadInitialData();
  };

  return (
    <div>
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

      {loading ? (
        <p className="mt-6 text-gray-500">Ładowanie produktów...</p>
      ) : (
        <ProductsList products={products} />
      )}
    </div>
  );
}
// "use client";

// import { useCallback, useEffect, useState } from "react";
// import FiltersMenu, { FilterOption } from "@/app/oferta/components/FiltersMenu";
// import ProductsList from "@/app/oferta/components/ProductsList";

// interface Product {
//   id: number;
//   model?: string;
//   slug?: string;
//   price?: number;
//   state?: string;
//   short_description?: string;
//   main_image?: { id?: string };
//   brand?: { id?: string | number; name?: string };
//   primarycategory?: string | null;
//   [key: string]: unknown;
// }

// export default function ClientCategoryPage({ category }: { category: string }) {
//   const [products, setProducts] = useState<Product[]>([]);
//   const [filters, setFilters] = useState<FilterOption[]>([]);
//   const [selectedFilters, setSelectedFilters] = useState<Record<string, string[]>>({});
//   const [loading, setLoading] = useState(false);

//   const loadInitialData = useCallback(async () => {
//     setLoading(true);
//     try {
//       const [productsRes, filtersRes] = await Promise.all([
//         fetch(`/api/products?category=${encodeURIComponent(category)}`, { cache: "no-store" }),
//         fetch(`/api/products/filters?category=${encodeURIComponent(category)}`, { cache: "no-store" }),
//       ]);

//       const productsJson = await productsRes.json();
//       const filtersJson = await filtersRes.json();

//       setProducts(productsJson.products ?? []);
//       setFilters(filtersJson.filters ?? []);
//     } catch (err) {
//       console.error("⨯ Błąd ładowania danych kategorii:", err);
//     } finally {
//       setLoading(false);
//     }
//   }, [category]);

//   useEffect(() => {
//     loadInitialData();
//   }, [loadInitialData]);

//   const handleApplyFilters = async (filtersToApply: Record<string, string[]>) => {
//     setSelectedFilters(filtersToApply);
//     setLoading(true);

//     const params = new URLSearchParams({ category });
//     Object.entries(filtersToApply).forEach(([key, values]) => {
//       if (values.length > 0) params.set(key, values.join(","));
//     });

//     try {
//       const res = await fetch(`/api/products?${params.toString()}`, { cache: "no-store" });
//       const data = await res.json();
//       setProducts(data.products ?? []);
//     } catch (e) {
//       console.error("⨯ Błąd filtrowania produktów:", e);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleClearFilters = async () => {
//     setSelectedFilters({});
//     await loadInitialData();
//   };

//   return (
//     <div>
//       {filters.length > 0 ? (
//         <FiltersMenu
//           availableFilters={filters}
//           selected={selectedFilters}
//           onSelectedChange={setSelectedFilters}
//           onApplyFilters={handleApplyFilters}
//           onClearFilters={handleClearFilters}
//         />
//       ) : (
//         <p className="text-gray-500">Brak dostępnych filtrów.</p>
//       )}

//       {loading ? (
//         <p className="mt-6 text-gray-500">Ładowanie produktów...</p>
//       ) : (
//         <ProductsList products={products} filtersMeta={filters} />
//       )}
//     </div>
//   );
// }