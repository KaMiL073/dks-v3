import type { Metadata } from "next";
import TopSectionHeader from "@/components/TopSectionHeader";
import { getNewsPaged } from "@/lib/getNews";
import { getCategories } from "@/lib/getCategories";
import Pagination from "@/components/Pagination";
import BlogCategoriesSidebar from "@/components/BlogCategoriesSidebar";
import { absoluteTitle } from "@/lib/seo";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

const baseUrl = new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "https://dks.pl");

export const metadata: Metadata = {
  metadataBase: baseUrl,
  title: absoluteTitle("Blog DKS"),
  description:
    "Blog DKS o nowoczesnych technologiach druku, urządzeniach biurowych i poligraficznych, serwisie oraz rozwiązaniach dla firm.",
  keywords: [
    "blog DKS",
    "drukarki blog",
    "urządzenia drukujące",
    "technologie druku",
    "serwis drukarek",
    "poligrafia",
    "DKS wiedza",
  ],
  alternates: { canonical: "/blog" },
  robots: { index: true, follow: true },
  openGraph: {
    title: "Blog DKS",
    description:
      "Blog DKS o nowoczesnych technologiach druku, urządzeniach biurowych i poligraficznych, serwisie oraz rozwiązaniach dla firm.",
    url: "/blog",
    siteName: "DKS",
    locale: "pl_PL",
    type: "website",
    images: [
      {
        url: "/og/blog.jpg",
        width: 1200,
        height: 630,
        alt: "Blog DKS – wiedza o druku i technologii",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Blog DKS",
    description:
      "Blog DKS o nowoczesnych technologiach druku, urządzeniach biurowych i poligraficznych oraz serwisie.",
    images: ["/og/blog.jpg"],
  },
};

export default async function BlogPage() {
  const [{ items: posts, page, totalPages }, rawCategories] = await Promise.all([
    getNewsPaged({ page: 1, perPage: 12 }),
    getCategories(),
  ]);

  const categories = rawCategories.map((item) => ({
    ...item,
    id: String(item.id),
  }));

  return (
    <>
      <TopSectionHeader
        title="Blog DKS"
        subtitle=""
        description="Oferujemy kompleksowy serwis urządzeń wielofunkcyjnych, obejmujący wszystkie wiodące marki dostępne na polskim rynku."
        img="/static/homepage/Header.webp"
      />

      <main className="w-full max-w-full overflow-x-hidden px-4 sm:px-6 md:px-10 xl:px-28 py-8 md:py-16 xl:py-20 flex flex-col lg:flex-row items-start gap-6 lg:gap-12">
        <BlogCategoriesSidebar categories={categories} />

        <div className="w-full flex-1 min-w-0">
          <div className="grid w-full grid-cols-1 sm:grid-cols-2 2xl:grid-cols-2 gap-6 xl:gap-12">
            {posts.map((post) => (
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

                    className="text-Text-body text-base leading-5 line-clamp-4"
                    dangerouslySetInnerHTML={{ __html: post.lead || "" }}
                  />
                </div>
              </a>
            ))}
          </div>

          <div className="mt-10 md:mt-12">
            <Pagination page={page} totalPages={totalPages} basePath="/blog" />
          </div>
        </div>
      </main>
    </>
  );
}
