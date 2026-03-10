"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter, usePathname } from "next/navigation";

import FiltersMenu, { FilterOption } from "@/app/oferta/components/FiltersMenu";
import ProductsList from "@/app/oferta/components/ProductsList";
import getDescription from "@/content/oferta";
import JsonLd from "@/components/seo/JsonLd";
import Pagination from "@/components/Pagination";

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
  filtersMeta?: FilterField[];
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

function getBaseUrl() {
  return (process.env.NEXT_PUBLIC_SITE_URL || "https://dks.pl").replace(/\/$/, "");
}

function absUrl(path: string) {
  const base = getBaseUrl();
  return path.startsWith("/") ? `${base}${path}` : `${base}/${path}`;
}

function prettyNameFromSlug(slug: string) {
  return decodeURIComponent(slug)
    .replace(/-/g, " ")
    .replace(/\b\w/g, (l) => l.toUpperCase());
}

const FILTER_PREFIX = "f__";

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
  const pathname = usePathname();

  const [products, setProducts] = useState<Product[]>([]);
  const [filters, setFilters] = useState<FilterOption[]>([]);
  const [selectedFilters, setSelectedFilters] = useState<Record<string, string[]>>({});
  const [loading, setLoading] = useState(false);

  const PER_PAGE = 12;
  const safeInitialPage = Number.isFinite(initialPage) && initialPage > 0 ? initialPage : 1;

  const [page, setPage] = useState<number>(safeInitialPage);
  const [totalPages, setTotalPages] = useState<number>(1);

  const activeCategory = subcategory || category;

  const filtersQuery = useMemo(() => {
    const p = new URLSearchParams({ category });
    if (subcategory) p.set("subcategory", subcategory);
    return p.toString();
  }, [category, subcategory]);

  const description = useMemo(() => getDescription(activeCategory), [activeCategory]);
  const hasDescription = Boolean(description?.leftColumn || description?.rightColumn);

  const itemListSchema = useMemo(() => {
    if (!products || products.length === 0) return null;

    const lastSeg =
      (pathname?.split("/").filter(Boolean).slice(-1)[0] as string | undefined) || activeCategory;

    const name = description?.title ?? prettyNameFromSlug(lastSeg);

    const itemListElement = products
      .filter((p) => Boolean(p?.slug))
      .map((p, idx) => ({
        "@type": "ListItem",
        position: idx + 1,
        name: p.model || p.slug,
        url: absUrl(`/oferta/produkty/${p.slug}`),
      }));

    if (itemListElement.length === 0) return null;

    return {
      "@context": "https://schema.org",
      "@type": "ItemList",
      name,
      itemListElement,
    };
  }, [products, pathname, activeCategory, description?.title]);

  const fetchProducts = useCallback(
    async (nextPage: number, nextFilters: Record<string, string[]>) => {
      setLoading(true);

      try {
        const params = new URLSearchParams({
          category: activeCategory,
          page: String(nextPage),
          perPage: String(PER_PAGE),
        });

        Object.entries(nextFilters).forEach(([key, values]) => {
          if (!values?.length) return;
          params.append(`${FILTER_PREFIX}${key}`, values.join(","));
        });

        const res = await fetch(`/api/products?${params.toString()}`, { cache: "no-store" });
        const data: ProductsApiResponse = await res.json();

        setProducts(data.products ?? []);
        setTotalPages(data.totalPages ?? 1);
        setPage(data.page ?? nextPage);
      } catch (e) {
        console.error("⨯ Błąd pobierania produktów:", e);
        setProducts([]);
        setTotalPages(1);
      } finally {
        setLoading(false);
      }
    },
    [activeCategory]
  );

  useEffect(() => {
    setSelectedFilters({});
    setPage(safeInitialPage);
  }, [activeCategory, safeInitialPage]);

  useEffect(() => {
    setPage(safeInitialPage);
  }, [safeInitialPage]);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      setLoading(true);

      try {
        const filtersRes = await fetch(`/api/products/filters?${filtersQuery}`, {
          cache: "no-store",
        });

        const filtersJson = await filtersRes.json().catch(() => ({}));

        if (!cancelled) {
          setFilters(filtersJson.filters ?? []);
        }

        if (!cancelled) {
          await fetchProducts(safeInitialPage, {});
        }
      } catch (err) {
        console.error("⨯ Błąd ładowania danych kategorii:", err);

        if (!cancelled) {
          setFilters([]);
          setProducts([]);
          setTotalPages(1);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [filtersQuery, fetchProducts, safeInitialPage]);

  const handleApplyFilters = async (filtersToApply: Record<string, string[]>) => {
    setSelectedFilters(filtersToApply);
    setPage(1);

    if (!subcategory) {
      router.push(`/oferta/${category}`);
    }

    await fetchProducts(1, filtersToApply);
  };

  const handleClearFilters = async () => {
    setSelectedFilters({});
    setPage(1);

    if (!subcategory) {
      router.push(`/oferta/${category}`);
    }

    await fetchProducts(1, {});
  };

  const goToPage = async (nextPage: number) => {
    const safe = Math.min(Math.max(nextPage, 1), totalPages);

    if (!subcategory) {
      if (safe === 1) router.push(`/oferta/${category}`);
      else router.push(`/oferta/${category}/page/${safe}`);
    }

    await fetchProducts(safe, selectedFilters);
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
        <>
          {itemListSchema ? <JsonLd data={itemListSchema} /> : null}

          <ProductsList products={products} />

          <div className="mt-10">
            <Pagination page={page} totalPages={totalPages} onPageChange={goToPage} />
          </div>

          {hasDescription && (
            <section className="mt-16">
              <div className="grid grid-cols-1 gap-10 lg:grid-cols-2">
                {description?.leftColumn && (
                  <div
                    className="prose max-w-none"
                    dangerouslySetInnerHTML={{ __html: description.leftColumn }}
                  />
                )}
                {description?.rightColumn && (
                  <div
                    className="prose max-w-none"
                    dangerouslySetInnerHTML={{ __html: description.rightColumn }}
                  />
                )}
              </div>
            </section>
          )}
        </>
      )}
    </div>
  );
}