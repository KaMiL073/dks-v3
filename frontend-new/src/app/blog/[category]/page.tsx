import type { Metadata } from "next";
import { notFound } from "next/navigation";
import TopSectionHeader from "@/components/TopSectionHeader";
import { getNewsPaged } from "@/lib/getNews";
import { getCategories } from "@/lib/getCategories";
import Pagination from "@/components/Pagination";
import BlogCategoriesSidebar from "@/components/BlogCategoriesSidebar";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

const baseUrl = new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "https://dks.pl");

type PageProps = {
  params: Promise<{ category: string }>;
};

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { category: categorySlug } = await params;

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

  const title = category.seo_title ?? `${category.name} – Blog DKS`;
  const description =
    category.seo_description ??
    `Artykuły z kategorii ${category.name} na blogu DKS – wiedza o druku, serwisie i rozwiązaniach dla firm.`;

  const canonical = `/blog/${category.slug}`;

  return {
    metadataBase: baseUrl,
    title,
    description,
    alternates: { canonical },
    robots: { index: true, follow: true },
    openGraph: {
      title,
      description,
      url: canonical,
      siteName: "DKS",
      locale: "pl_PL",
      type: "website",
    },
    twitter: { card: "summary", title, description },
  };
}

export default async function BlogCategoryPage({ params }: PageProps) {
  const { category: categorySlug } = await params;

  const categories = (await getCategories()).map((item) => ({
    ...item,
    id: String(item.id),
  }));

  const currentCategory = categories.find((c) => c.slug === categorySlug);

  if (!currentCategory) return notFound();

  const paged = await getNewsPaged({
    page: 1,
    perPage: 12,
    category: categorySlug,
  });

  return (
    <>
      <TopSectionHeader
        title={`Blog: ${currentCategory.name}`}
        subtitle=""
        description="Oferujemy kompleksowy serwis urządzeń wielofunkcyjnych, obejmujący wszystkie wiodące marki dostępne na polskim rynku."
        img="/static/homepage/Header.webp"
      />

      <main className="w-full max-w-full overflow-x-hidden px-4 sm:px-6 md:px-10 xl:px-28 py-8 md:py-16 xl:py-20 flex flex-col lg:flex-row items-start gap-6 lg:gap-12">
        <BlogCategoriesSidebar
          categories={categories}
          activeSlug={categorySlug}
        />

        <div className="w-full flex-1 min-w-0">
          <div className="grid w-full grid-cols-1 sm:grid-cols-2 2xl:grid-cols-2 gap-6 xl:gap-12">
            {paged.items.map((post) => (
              <a
                key={post.id}
                href={`/blog/${post.categorySlug}/${post.slug}`}
                className="w-full max-w-[352px] min-w-0 flex flex-col gap-3 cursor-pointer"
              >
                <div className="w-full min-w-0 flex flex-col gap-4 md:gap-6">
                  <img
                    src={post.image || "https://placehold.co/352x264"}
                    className="w-full aspect-[4/3] h-auto object-cover"
                    alt={post.title}
                  />

                  <h2 className="text-Text-headings text-lg md:text-xl font-semibold leading-6">
                    {post.title}
                  </h2>

                  <div
                    className="text-Text-body text-sm md:text-base leading-5 line-clamp-4"
                    dangerouslySetInnerHTML={{ __html: post.lead || "" }}
                  />
                </div>
              </a>
            ))}
          </div>

          <div className="mt-10 md:mt-12">
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