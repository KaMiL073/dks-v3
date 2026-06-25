import type { MetadataRoute } from "next";
import { getStaticAppRoutes } from "@/lib/sitemap-static";
import { getJobSlugs } from "@/lib/jobs";
import { getAllNewsSlugs } from "@/lib/getNews";
import { getAllOfferPages } from "@/lib/products";
import { branches } from "@/content/Branch";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const baseUrl = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://dks.pl").replace(
  /\/$/,
  "",
);

const now = new Date();

const offerCategoryPaths = [
  "/oferta/produkty",

  "/oferta/rozwiazania-dla-biura",
  "/oferta/rozwiazania-dla-biura/drukarki-i-urzadzenia-wielofunkcyjne",
  "/oferta/rozwiazania-dla-biura/oprogramowanie-do-druku",
  "/oferta/rozwiazania-dla-biura/oprogramowanie-dla-biura",
  "/oferta/rozwiazania-dla-biura/komputery-stacjonarne",
  "/oferta/rozwiazania-dla-biura/laptopy",

  "/oferta/rozwiazania-dla-poligrafii",
  "/oferta/rozwiazania-dla-poligrafii/maszyny-produkcyjne-kolorowe",
  "/oferta/rozwiazania-dla-poligrafii/maszyny-produkcyjne-bw",
  "/oferta/rozwiazania-dla-poligrafii/maszyny-rolowe-etykiety",
  "/oferta/rozwiazania-dla-poligrafii/software-dla-poligrafii",
  "/oferta/rozwiazania-dla-poligrafii/uszlachetnianie-druku",
  "/oferta/rozwiazania-dla-poligrafii/introligatornia",

  "/oferta/rozwiazania-wielkoformatowe",
  "/oferta/rozwiazania-wielkoformatowe/plotery-drukarki",
  "/oferta/rozwiazania-wielkoformatowe/plotery-mfp",
  "/oferta/rozwiazania-wielkoformatowe/skanery-wielkoformatowe",
  "/oferta/rozwiazania-wielkoformatowe/software-wielkoformatowe",
  "/oferta/rozwiazania-wielkoformatowe/skladarki-wielkoformatowe",

  "/oferta/marki",
  "/oferta/marki/canon",
  "/oferta/marki/konica-minolta",
  "/oferta/marki/lexmark",
  "/oferta/marki/hp",
  "/oferta/marki/ricoh",
  "/oferta/marki/asus",
  "/oferta/marki/lenovo",
  "/oferta/marki/oce",

  "/oferta/rozwiazania-video",
  "/oferta/xsm-medyk",
  "/oferta/materialy-eksploatacyjne",
] as const;

type BranchLike = {
  href?: string;
};

function toDate(value: unknown): Date {
  if (typeof value !== "string" || !value.trim()) {
    return now;
  }

  const date = new Date(value);

  return Number.isNaN(date.getTime()) ? now : date;
}

function normalizePath(path: string): string {
  if (path === "/") return "";

  return path.startsWith("/") ? path : `/${path}`;
}

function uniqueRoutes(routes: MetadataRoute.Sitemap): MetadataRoute.Sitemap {
  return Array.from(new Map(routes.map((item) => [item.url, item])).values());
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes: MetadataRoute.Sitemap = getStaticAppRoutes().map(
    (route) => ({
      url: `${baseUrl}${normalizePath(route)}`,
      lastModified: now,
      changeFrequency: route === "/" ? "daily" : "weekly",
      priority:
        route === "/"
          ? 1
          : route === "/oferta"
            ? 0.9
            : route === "/kariera"
              ? 0.85
              : 0.8,
    }),
  );

  const jobs = await getJobSlugs();

  const jobRoutes: MetadataRoute.Sitemap = jobs
    .filter(
      (job): job is { slug: string } =>
        !!job &&
        typeof job === "object" &&
        "slug" in job &&
        typeof job.slug === "string" &&
        job.slug.length > 0,
    )
    .map((job) => ({
      url: `${baseUrl}/kariera/${job.slug}`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.7,
    }));

  const posts = await getAllNewsSlugs();

  const postRoutes: MetadataRoute.Sitemap = posts
    .filter(
      (post) =>
        typeof post.slug === "string" &&
        post.slug.length > 0 &&
        typeof post.categorySlug === "string" &&
        post.categorySlug.length > 0,
    )
    .map((post) => ({
      url: `${baseUrl}/blog/${post.categorySlug}/${post.slug}`,
      lastModified: toDate(post.date_created),
      changeFrequency: "monthly",
      priority: 0.6,
    }));

  const products = await getAllOfferPages();

  const productRoutes: MetadataRoute.Sitemap = products
    .filter(
      (product) =>
        typeof product.slug === "string" && product.slug.length > 0,
    )
    .map((product) => ({
      url: `${baseUrl}/oferta/produkty/${product.slug}`,
      lastModified: toDate(product.updatedAt),
      changeFrequency: "weekly",
      priority: 0.7,
    }));

  const offerCategoryRoutes: MetadataRoute.Sitemap = offerCategoryPaths.map(
    (path) => ({
      url: `${baseUrl}${path}`,
      lastModified: now,
      changeFrequency: "weekly",
      priority:
        path === "/oferta/produkty"
          ? 0.85
          : path === "/oferta/marki"
            ? 0.75
            : 0.8,
    }),
  );

  const branchRoutes: MetadataRoute.Sitemap = (branches as BranchLike[])
    .filter(
      (branch) =>
        typeof branch.href === "string" &&
        branch.href.startsWith("/oddzialy/"),
    )
    .map((branch) => ({
      url: `${baseUrl}${branch.href}`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.8,
    }));

  return uniqueRoutes([
    ...staticRoutes,
    ...offerCategoryRoutes,
    ...productRoutes,
    ...postRoutes,
    ...jobRoutes,
    ...branchRoutes,
  ]);
}
