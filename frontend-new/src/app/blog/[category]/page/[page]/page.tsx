import type { Metadata } from "next";
import { notFound } from "next/navigation";
import TopSectionHeader from "@/components/TopSectionHeader";
import { getNewsPaged } from "@/lib/getNews";
import { getCategories } from "@/lib/getCategories";
import Pagination from "@/components/Pagination";

const baseUrl = new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "https://dks.pl");

type PageProps = {
  params: Promise<{ category: string; page: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { category: categorySlug, page } = await params;
  const pageNum = Number(page);

  const categories = await getCategories();
  const category = categories.find((c) => c.slug === categorySlug);

  if (!category) {
    return {
      metadataBase: baseUrl,
      title: "Blog – DKS",
      description:
        "Blog DKS o nowoczesnych technologiach druku, serwisie i rozwiązaniach dla firm.",
      alternates: { canonical: "/blog" },
    };
  }

  const titleBase = category.seo_title ?? `${category.name} – Blog DKS`;
  const description =
    category.seo_description ??
    `Artykuły z kategorii ${category.name} na blogu DKS – wiedza o druku, serwisie i rozwiązaniach dla firm.`;

  // Strona 1 nie ma /page/1 (więc jeśli ktoś poda page=1 -> notFound)
  if (!Number.isFinite(pageNum) || pageNum < 2) {
    return {
      metadataBase: baseUrl,
      title: titleBase,
      description,
      alternates: { canonical: `/blog/${category.slug}` },
    };
  }

  const canonical = `/blog/${category.slug}/page/${pageNum}`;

  return {
    metadataBase: baseUrl,
    title: `${titleBase} (strona ${pageNum})`,
    description,
    alternates: { canonical },
    robots: { index: true, follow: true },
    openGraph: {
      title: `${titleBase} (strona ${pageNum})`,
      description,
      url: canonical,
      siteName: "DKS",
      locale: "pl_PL",
      type: "website",
    },
    twitter: {
      card: "summary",
      title: `${titleBase} (strona ${pageNum})`,
      description,
    },
  };
}

export default async function BlogCategoryPagePaged({ params }: PageProps) {
  const { category: categorySlug, page } = await params;
  const pageNum = Number(page);

  if (!Number.isFinite(pageNum) || pageNum < 2) return notFound();

  const categories = await getCategories();
  const currentCategory = categories.find((c) => c.slug === categorySlug);
  if (!currentCategory) return notFound();

  const paged = await getNewsPaged({
    page: pageNum,
    perPage: 12,
    category: categorySlug,
  });

  if (pageNum > paged.totalPages) return notFound();

  return (
    <>
      <TopSectionHeader
        title={`Blog: ${currentCategory.name}`}
        description="Oferujemy kompleksowy serwis urządzeń wielofunkcyjnych, obejmujący wszystkie wiodące marki dostępne na polskim rynku."
        img="/static/homepage/Header.webp"
      />

      <main className="px-28 py-20 flex gap-12">
        {/* SIDEBAR */}
        <aside className="w-96 flex flex-col">
          {categories.map((c) => (
            <a
              href={`/blog/${c.slug}`}
              key={c.id}
              className="w-full px-6 py-4 border-b-2 border-border-primary flex justify-between items-center bg-surface-secondary hover:bg-surface-page transition"
            >
              <div className="text-Text-headings text-2xl font-semibold">
                {c.name}
              </div>
              <div className="py-0.5">
                <div className="w-3 h-5 bg-icon-primary" />
              </div>
            </a>
          ))}
        </aside>

        {/* POSTS LIST + PAGINATION */}
        <div className="flex-1">
          <div className="flex flex-wrap gap-12">
            {paged.items.map((post) => (
              <a
                key={post.id}
                href={`/blog/${post.categorySlug}/${post.slug}`}
                className="w-96 min-w-60 flex flex-col gap-4 cursor-pointer"
              >
                <div className="flex flex-col gap-6">
                  <img
                    src={post.image || "https://placehold.co/352x264"}
                    className="w-full h-64 object-cover"
                    alt={post.title}
                  />
                  <h2 className="text-Text-headings text-xl font-semibold leading-6">
                    {post.title}
                  </h2>
                  <p className="text-Text-body text-base leading-5 line-clamp-4">
                    {post.lead}
                  </p>
                </div>
              </a>
            ))}
          </div>

          <div className="mt-12">
            <Pagination
              page={paged.page}
              totalPages={paged.totalPages}
              basePath={`/blog/${categorySlug}`}
            />
          </div>
        </div>
      </main>
    </>
  );
}