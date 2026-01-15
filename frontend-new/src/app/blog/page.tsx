import type { Metadata } from "next";
import TopSectionHeader from "@/components/TopSectionHeader";
import { getNewsPaged } from "@/lib/getNews";
import { getCategories } from "@/lib/getCategories";
import Pagination from "@/components/Pagination";


const baseUrl = new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "https://dks.pl");

export const metadata: Metadata = {
  metadataBase: baseUrl,

  title: "Blog – DKS",
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

  alternates: {
    canonical: "/blog",
  },

  robots: {
    index: true,
    follow: true,
  },

  openGraph: {
    title: "Blog – DKS",
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
    title: "Blog – DKS",
    description:
      "Blog DKS o nowoczesnych technologiach druku, urządzeniach biurowych i poligraficznych oraz serwisie.",
    images: ["/og/blog.jpg"],
  },
};

export default async function BlogPage() {
  const [{ items: posts, page, totalPages }, categories] = await Promise.all([
    getNewsPaged({ page: 1, perPage: 12 }),
    getCategories(),
  ]);

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
            {posts.map((post) => (
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
            <Pagination page={page} totalPages={totalPages} basePath="/blog" />
          </div>
        </div>
      </main>
    </>
  );
}