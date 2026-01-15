import type { Metadata } from "next";
import { notFound } from "next/navigation";
import TopSectionHeader from "@/components/TopSectionHeader";
import { getNewsPaged } from "@/lib/getNews";
import { getCategories } from "@/lib/getCategories";
import Pagination from "@/components/Pagination";

const baseUrl = new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "https://dks.pl");

type PageProps = {
  params: Promise<{ page: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { page } = await params;
  const pageNum = Number(page);

  if (!Number.isFinite(pageNum) || pageNum < 2) {
    return {
      metadataBase: baseUrl,
      alternates: { canonical: "/blog" },
      title: "Blog – DKS",
      description:
        "Blog DKS o nowoczesnych technologiach druku, urządzeniach biurowych i poligraficznych, serwisie oraz rozwiązaniach dla firm.",
    };
  }

  const canonical = `/blog/page/${pageNum}`;

  return {
    metadataBase: baseUrl,
    title: `Blog – DKS (strona ${pageNum})`,
    description:
      "Blog DKS o nowoczesnych technologiach druku, urządzeniach biurowych i poligraficznych, serwisie oraz rozwiązaniach dla firm.",
    alternates: { canonical },
    robots: { index: true, follow: true },
    openGraph: {
      title: `Blog – DKS (strona ${pageNum})`,
      description:
        "Blog DKS o nowoczesnych technologiach druku, urządzeniach biurowych i poligraficznych, serwisie oraz rozwiązaniach dla firm.",
      url: canonical,
      siteName: "DKS",
      locale: "pl_PL",
      type: "website",
    },
    twitter: {
      card: "summary",
      title: `Blog – DKS (strona ${pageNum})`,
      description:
        "Blog DKS o nowoczesnych technologiach druku, urządzeniach biurowych i poligraficznych, serwisie oraz rozwiązaniach dla firm.",
    },
  };
}

export default async function BlogPagePaged({ params }: PageProps) {
  const { page } = await params;
  const pageNum = Number(page);

  if (!Number.isFinite(pageNum) || pageNum < 2) return notFound();

  const [paged, categories] = await Promise.all([
    getNewsPaged({ page: pageNum, perPage: 12 }),
    getCategories(),
  ]);

  // Jeśli ktoś wejdzie na stronę > totalPages — 404
  if (pageNum > paged.totalPages) return notFound();

  return (
    <>
      <TopSectionHeader
        title="Blog"
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
              basePath="/blog"
            />
          </div>
        </div>
      </main>
    </>
  );
}