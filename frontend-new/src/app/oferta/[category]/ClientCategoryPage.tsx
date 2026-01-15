"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import FiltersMenu, { FilterOption } from "@/app/oferta/components/FiltersMenu";
import ProductsList from "@/app/oferta/components/ProductsList";
import getDescription from "@/content/oferta";

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

type ProductsApiResponse = {
  page: number;
  perPage: number;
  total: number;
  totalPages: number;
  count: number;
  products: Product[];
};

function ArrowLeftIcon() {
  return (
    <svg width="10" height="16" viewBox="0 0 10 16" fill="none">
      <path
        d="M6.5 2L1.5 8L6.5 14"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ArrowRightIcon() {
  return (
    <svg width="12" height="20" viewBox="0 0 12 20" fill="none">
      <path
        d="M5 4L10 10L5 16"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function ClientCategoryPage({
  category,
  subcategory,
  initialPage = 1,
}: {
  category: string;
  subcategory?: string;
  initialPage?: number;
}) {
  const router = useRouter();

  const [products, setProducts] = useState<Product[]>([]);
  const [filters, setFilters] = useState<FilterOption[]>([]);
  const [selectedFilters, setSelectedFilters] = useState<Record<string, string[]>>({});
  const [loading, setLoading] = useState(false);

  // ✅ paginacja
  const PER_PAGE = 12;
  const [page, setPage] = useState<number>(Number.isFinite(initialPage) ? initialPage : 1);
  const [totalPages, setTotalPages] = useState<number>(1);

  /** ✅ Ustal aktywną kategorię (jeśli jest subkategoria, użyj jej) */
  const activeCategory = subcategory || category;

  /** ✅ Opis (lewa/prawa kolumna) dla aktywnej kategorii/subkategorii */
  const description = useMemo(() => {
    return getDescription(activeCategory);
  }, [activeCategory]);

  const hasDescription = Boolean(description?.leftColumn || description?.rightColumn);

  /** 🔹 helper do pobierania produktów */
  const fetchProducts = useCallback(
    async (nextPage: number, nextFilters: Record<string, string[]>) => {
      setLoading(true);

      const params = new URLSearchParams({
        category: activeCategory,
        page: String(nextPage),
        perPage: String(PER_PAGE),
      });

      // Filtry -> query
      Object.entries(nextFilters).forEach(([key, values]) => {
        if (values.length > 0) params.append(key, values.join(","));
      });

      try {
        const res = await fetch(`/api/products?${params.toString()}`, { cache: "no-store" });
        const data: ProductsApiResponse = await res.json();

        setProducts(data.products ?? []);
        setTotalPages(data.totalPages ?? 1);

        // API może "przyciąć" page do totalPages
        const safePage = data.page ?? nextPage;
        setPage(safePage);
      } catch (e) {
        console.error("⨯ Błąd pobierania produktów:", e);
      } finally {
        setLoading(false);
      }
    },
    [activeCategory]
  );

  /** 🔹 Pobranie filtrów + pierwszego zestawu produktów dla aktualnej strony */
  const loadInitialData = useCallback(async () => {
    setLoading(true);
    try {
      const [filtersRes] = await Promise.all([
        fetch(`/api/products/filters?category=${activeCategory}`, { cache: "no-store" }),
      ]);

      const filtersJson = await filtersRes.json();
      setFilters(filtersJson.filters ?? []);

      // produkty ładowane osobno (żeby użyć page/perPage)
      await fetchProducts(page, selectedFilters);
    } catch (err) {
      console.error("⨯ Błąd ładowania danych kategorii:", err);
    } finally {
      setLoading(false);
    }
  }, [activeCategory, fetchProducts, page, selectedFilters]);

  useEffect(() => {
    loadInitialData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeCategory]);

  /** 🔹 Filtrowanie produktów (reset do strony 1) */
  const handleApplyFilters = async (filtersToApply: Record<string, string[]>) => {
    setSelectedFilters(filtersToApply);

    const nextPage = 1;
    // jeśli to "czysta" kategoria, ustaw URL na stronę 1 (bez /page/1)
    if (!subcategory) {
      router.push(`/oferta/${category}`);
    }

    await fetchProducts(nextPage, filtersToApply);
  };

  /** 🔹 Czyszczenie filtrów (reset do strony 1) */
  const handleClearFilters = async () => {
    setSelectedFilters({});
    if (!subcategory) {
      router.push(`/oferta/${category}`);
    }
    await fetchProducts(1, {});
  };

  /** ✅ Zmiana strony + URL: /oferta/[category]/page/[n] */
  const goToPage = async (nextPage: number) => {
    const safe = Math.min(Math.max(nextPage, 1), totalPages);

    // subkategoria: na razie bez URL /page/ (bo to by weszło w catch-all)
    if (!subcategory) {
      if (safe === 1) router.push(`/oferta/${category}`);
      else router.push(`/oferta/${category}/page/${safe}`);
    }

    await fetchProducts(safe, selectedFilters);
  };

  const canPrev = page > 1;
  const canNext = page < totalPages;

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

      {/* LISTA PRODUKTÓW + OPIS + PAGINACJA */}
      {loading ? (
        <p className="mt-6 text-gray-500">Ładowanie produktów...</p>
      ) : (
        <>
          <ProductsList
            products={products}
            filtersMeta={filters}
            categorySlug={category}
            subcategory={subcategory}
          />

          {/* ✅ PAGINACJA (pod listą produktów) */}
          {totalPages > 1 ? (
            <div className="mt-10 inline-flex justify-start items-center gap-2.5">
              {/* prev */}
              <button
                type="button"
                onClick={() => (canPrev ? goToPage(page - 1) : null)}
                disabled={!canPrev}
                className="px-1 py-0.5 flex justify-center items-center gap-2.5 overflow-hidden disabled:opacity-40"
                aria-label="Poprzednia strona"
              >
                <span className="text-icon-primary">
                  <ArrowLeftIcon />
                </span>
              </button>

              {/* center */}
              <div className="flex justify-start items-center gap-2">
                <div className="px-4 py-2 rounded-lg outline outline-1 outline-offset-[-1px] outline-border-primary inline-flex flex-col justify-center items-center gap-2.5">
                  <div className="w-2 flex flex-col justify-center items-center gap-2.5">
                    <div className="self-stretch justify-start text-Text-headings text-xl font-normal font-['Montserrat'] leading-6">
                      {page}
                    </div>
                  </div>
                </div>

                <div className="w-7 flex justify-between items-center">
                  <div className="justify-start text-Text-disabled text-xl font-normal font-['Montserrat'] leading-6">
                    z {totalPages}
                  </div>
                </div>
              </div>

              {/* next */}
              <button
                type="button"
                onClick={() => (canNext ? goToPage(page + 1) : null)}
                disabled={!canNext}
                className="px-1 py-0.5 flex justify-center items-center gap-2.5 overflow-hidden disabled:opacity-40"
                aria-label="Następna strona"
              >
                <span className="text-icon-primary">
                  <ArrowRightIcon />
                </span>
              </button>
            </div>
          ) : null}

          {/* ✅ OPIS POD LISTĄ PRODUKTÓW */}
          {hasDescription ? (
            <section className="mt-16">
              <div className="grid grid-cols-1 gap-10 lg:grid-cols-2">
                {description?.leftColumn ? (
                  <div
                    className="prose max-w-none"
                    dangerouslySetInnerHTML={{ __html: description.leftColumn }}
                  />
                ) : null}

                {description?.rightColumn ? (
                  <div
                    className="prose max-w-none"
                    dangerouslySetInnerHTML={{ __html: description.rightColumn }}
                  />
                ) : null}
              </div>
            </section>
          ) : null}
        </>
      )}
    </div>
  );
}