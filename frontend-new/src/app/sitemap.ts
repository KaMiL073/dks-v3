import type { MetadataRoute } from "next";
import { getStaticAppRoutes } from "@/lib/sitemap-static";
import { getJobSlugs } from "@/lib/jobs";
import { getAllNewsSlugs } from "@/lib/getNews";
import { getAllOfferPages } from "@/lib/products";
import { branches } from "@/content/Branch";

export const revalidate = 3600;

const baseUrl = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://dks.pl").replace(
  /\/$/,
  ""
);

const offerCategoryPaths = [
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

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes: MetadataRoute.Sitemap = getStaticAppRoutes().map(
    (route) => ({
      url: `${baseUrl}${route === "/" ? "" : route}`,
      lastModified: new Date(),
      changeFrequency: (route === "/" ? "daily" : "weekly") as
        | "daily"
        | "weekly",
      priority:
        route === "/"
          ? 1
          : route === "/oferta"
          ? 0.9
          : route === "/kariera"
          ? 0.85
          : 0.8,
    })
  );

  const jobs = await getJobSlugs();
  const jobRoutes: MetadataRoute.Sitemap = jobs
    .filter(
      (job): job is { slug: string } =>
        !!job &&
        typeof job === "object" &&
        "slug" in job &&
        typeof job.slug === "string" &&
        job.slug.length > 0
    )
    .map((job) => ({
      url: `${baseUrl}/kariera/${job.slug}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.7,
    }));

  const posts = await getAllNewsSlugs();
  const postRoutes: MetadataRoute.Sitemap = posts
    .filter(
      (post) =>
        typeof post.slug === "string" &&
        post.slug.length > 0 &&
        typeof post.categorySlug === "string" &&
        post.categorySlug.length > 0
    )
    .map((post) => ({
      url: `${baseUrl}/blog/${post.categorySlug}/${post.slug}`,
      lastModified: post.date_created
        ? new Date(post.date_created)
        : new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.6,
    }));

  const products = await getAllOfferPages();
  const productRoutes: MetadataRoute.Sitemap = products.map((product) => ({
    url: `${baseUrl}/oferta/produkty/${product.slug}`,
    lastModified: product.updatedAt ? new Date(product.updatedAt) : new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  const offerCategoryRoutes: MetadataRoute.Sitemap = offerCategoryPaths.map(
    (path) => ({
      url: `${baseUrl}${path}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: path === "/oferta/marki" ? 0.75 : 0.8,
    })
  );

  const branchRoutes: MetadataRoute.Sitemap = (branches as BranchLike[])
    .filter((branch) => typeof branch.href === "string" && branch.href.startsWith("/oddzialy/"))
    .map((branch) => ({
      url: `${baseUrl}${branch.href!}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.8,
    }));

  const allRoutes = [
    ...staticRoutes,
    ...jobRoutes,
    ...postRoutes,
    ...productRoutes,
    ...offerCategoryRoutes,
    ...branchRoutes,
  ];

  return Array.from(new Map(allRoutes.map((item) => [item.url, item])).values());
}