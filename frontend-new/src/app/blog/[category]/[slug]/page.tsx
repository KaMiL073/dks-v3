import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { getCategories } from "@/lib/getCategories";
import { getSinglePost, getNewsPaged } from "@/lib/getNews";
import TopSectionHeader from "@/components/TopSectionHeader";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

type PageParams = {
  category: string;
  slug: string;
};

type PageProps = {
  params: Promise<PageParams>;
};

function siteBaseUrl() {
  const raw = process.env.NEXT_PUBLIC_SITE_URL?.trim();

  try {
    return new URL(raw && raw.length > 0 ? raw : "https://dks.pl");
  } catch {
    return new URL("https://dks.pl");
  }
}

/* ===========================================
   🔥 DYNAMIC METADATA (SEO)
   =========================================== */
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { category, slug } = await params;

  const post = await getSinglePost(slug);

  if (!post) {
    return {
      title: "Artykuł nie istnieje",
      description: "Brak treści.",
      robots: { index: false, follow: false },
    };
  }

  const baseUrl = siteBaseUrl();
  const title = post.title ?? "";
  const description = post.lead?.slice(0, 155) ?? "";

  const canonicalPath = `/blog/${category}/${post.slug ?? slug}`;
  const canonical = new URL(canonicalPath, baseUrl).toString();

  return {
    metadataBase: baseUrl,
    title,
    description,
    alternates: { canonical: canonicalPath },
    openGraph: {
      title,
      description,
      type: "article",
      url: canonical,
      images: [
        {
          url: post.image || new URL("/static/homepage/Header.webp", baseUrl).toString(),
          width: 1200,
          height: 630,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [post.image || new URL("/static/homepage/Header.webp", baseUrl).toString()],
    },
  };
}

/* ===========================================
   🔥 STRONA ARTYKUŁU
   =========================================== */
export default async function BlogArticlePage({ params }: PageProps) {
  const { slug, category } = await params;

  const post = await getSinglePost(slug);

  if (!post) {
    notFound();
  }

  const categories = await getCategories();

  const recommended = post.categorySlug
    ? (await getNewsPaged({ page: 1, perPage: 6, category: post.categorySlug })).items
        .filter((n) => n.slug !== post.slug)
        .slice(0, 2)
    : [];

  return (
    <>
      <TopSectionHeader title={post.title} img="/static/homepage/Header.webp" />

      <div className="self-stretch px-28 py-20 inline-flex justify-start items-start gap-12">
        <div className="flex-1 max-w-96 inline-flex flex-col justify-start items-start">
          {categories.map((c) => (
            <a
              href={`/blog/${c.slug}`}
              key={c.id}
              className={`w-full max-w-[464px] px-6 py-4 border-b-2 border-border-primary flex justify-between items-center ${
                c.slug === category
                  ? "bg-surface-page"
                  : "bg-surface-secondary hover:bg-surface-page"
              }`}
            >
              <div className="text-Text-headings text-2xl font-semibold">{c.name}</div>
              <div className="py-0.5 flex items-center">
                <div className="w-3 h-5 bg-icon-primary" />
              </div>
            </a>
          ))}
        </div>

        <div className="flex-1 inline-flex flex-col justify-center items-start gap-12">
          <img
            className="self-stretch h-80 object-cover"
            src={post.image || "https://placehold.co/752x350"}
            alt={post.title ?? ""}
          />

          <div className="self-stretch text-Text-headings text-4xl font-semibold leading-[48px]">
            {post.title}
          </div>

          <div className="self-stretch">
            <span className="text-Text-secondary text-base font-semibold">Data:</span>
            <span className="text-Text-secondary text-base ml-1">
              {new Date(post.date_created).toLocaleDateString("pl-PL")}
            </span>
            <br />
            <span className="text-Text-secondary text-base font-semibold">Tagi:</span>
            <span className="text-Text-secondary text-base ml-1">
              {post.tags?.join(", ") || "brak"}
            </span>
          </div>

          <div
            className="self-stretch text-Text-body text-base leading-5 prose prose-lg max-w-none"
            dangerouslySetInnerHTML={{ __html: post.content || "" }}
          />

          {recommended.length > 0 && (
            <div className="self-stretch py-12 flex flex-col gap-5">
              <div className="text-Text-headings text-3xl font-semibold leading-10">
                Polecane artykuły
              </div>

              <div className="inline-flex gap-6">
                {recommended.map((item) => {
                  const itemCategorySlug = item.categorySlug ?? category;

                  return (
                    <a
                      key={item.id}
                      href={`/blog/${itemCategorySlug}/${item.slug}`}
                      className="flex-1 min-w-60 flex flex-col gap-4"
                    >
                      <div className="flex flex-col gap-6">
                        <img
                          src={item.image || "https://placehold.co/364x273"}
                          className="self-stretch h-72 object-cover"
                          alt={item.title ?? ""}
                        />
                        <div className="text-Text-headings text-xl font-semibold leading-6">
                          {item.title}
                        </div>
                        <div className="text-Text-body text-base leading-5 line-clamp-4">
                          {item.lead}
                        </div>
                      </div>

                      <div className="flex flex-col gap-1">
                        <div className="inline-flex gap-1.5 items-center">
                          <div className="w-6 h-6 relative">
                            <div className="w-4 h-5 left-[3px] top-[2px] absolute bg-icon-primary" />
                          </div>
                          <div className="text-black text-xs">
                            {new Date(item.date_created).toLocaleDateString("pl-PL")}
                          </div>
                        </div>
                        <div className="inline-flex gap-[5px] items-center">
                          <div className="w-6 h-6 relative">
                            <div className="w-5 h-5 left-[2px] top-[2px] absolute bg-icon-primary" />
                          </div>
                          <div className="text-black text-xs opacity-70">
                            {item.tags?.join(", ") || "brak"}
                          </div>
                        </div>
                      </div>
                    </a>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

// import { getCategories } from "@/lib/getCategories";
// import getNews, { getSinglePost } from "@/lib/getNews";
// import TopSectionHeader from "@/components/TopSectionHeader";

// /* ===========================================
//    🔥 DYNAMIC METADATA (SEO)
//    =========================================== */
// export async function generateMetadata({ params }) {
//   const post = await getSinglePost(params.slug);

//   if (!post) {
//     return {
//       title: "Artykuł nie istnieje",
//       description: "Brak treści.",
//       robots: "noindex",
//     };
//   }

//   const title = post.title;
//   const description = post.lead?.slice(0, 155) || "";

//   return {
//     title,
//     description,
//     openGraph: {
//       title,
//       description,
//       type: "article",
//       url: `https://dks.pl/blog/${post.category?.slug}/${post.slug}`,
//       images: [
//         {
//           url: post.image || "https://dks.pl/static/homepage/Header.webp",
//           width: 1200,
//           height: 630,
//         },
//       ],
//     },
//     alternates: {
//       canonical: `https://dks.pl/blog/${post.category?.slug}/${post.slug}`,
//     },
//   };
// }

// /* ===========================================
//    🔥 STRONA ARTYKUŁU
//    =========================================== */
// export default async function BlogArticlePage({ params }) {
//   const { slug, category } = params;

//   const post = await getSinglePost(slug);
//   if (!post) return <div className="px-28 py-20">Brak artykułu</div>;

//   const categories = await getCategories();

//   // Rekomendowane artykuły
//   const recommended = await getNews({
//     limit: 2,
//     categoryId: post.category?.id,
//   });

//   return (
//     <>
//       <TopSectionHeader 
//         title={post.title} 
//         img="/static/homepage/Header.webp"
//        />

//       <div className="self-stretch px-28 py-20 inline-flex justify-start items-start gap-12">

//         {/* SIDEBAR */}
//         <div className="flex-1 max-w-96 inline-flex flex-col justify-start items-start">
//           {categories.map((c) => (
//             <a
//               href={`/blog/${c.slug}`}
//               key={c.id}
//               className={`w-full max-w-[464px] px-6 py-4 border-b-2 border-border-primary flex justify-between items-center ${
//                 c.slug === category
//                   ? "bg-surface-page"
//                   : "bg-surface-secondary hover:bg-surface-page"
//               }`}
//             >
//               <div className="text-Text-headings text-2xl font-semibold">
//                 {c.name}
//               </div>
//               <div className="py-0.5 flex items-center">
//                 <div className="w-3 h-5 bg-icon-primary" />
//               </div>
//             </a>
//           ))}
//         </div>

//         {/* MAIN CONTENT */}
//         <div className="flex-1 inline-flex flex-col justify-center items-start gap-12">

//           {/* IMAGE */}
//           <img
//             className="self-stretch h-80 object-cover"
//             src={post.image || "https://placehold.co/752x350"}
//             alt={post.title}
//           />

//           {/* TITLE */}
//           <div className="self-stretch text-Text-headings text-4xl font-semibold leading-[48px]">
//             {post.title}
//           </div>

//           {/* DATE + TAGS */}
//           <div className="self-stretch">
//             <span className="text-Text-secondary text-base font-semibold">Data:</span>
//             <span className="text-Text-secondary text-base ml-1">
//               {new Date(post.date_created).toLocaleDateString("pl-PL")}
//             </span>
//             <br />
//             <span className="text-Text-secondary text-base font-semibold">Tagi:</span>
//             <span className="text-Text-secondary text-base ml-1">
//               {post.tags?.join(", ") || "brak"}
//             </span>
//           </div>

//           {/* CONTENT */}
//           <div
//             className="self-stretch text-Text-body text-base leading-5 prose prose-lg max-w-none"
//             dangerouslySetInnerHTML={{ __html: post.content || "" }}
//           />

//           {/* RECOMMENDED POSTS */}
//           <div className="self-stretch py-12 flex flex-col gap-5">
//             <div className="text-Text-headings text-3xl font-semibold leading-10">
//               Polecane artykuły
//             </div>

//             <div className="inline-flex gap-6">
//               {recommended.map((item) => (
//                 <a
//                   key={item.id}
//                   href={`/blog/${item.category?.slug}/${item.slug}`}
//                   className="flex-1 min-w-60 flex flex-col gap-4"
//                 >
//                   <div className="flex flex-col gap-6">
//                     <img
//                       src={item.image || "https://placehold.co/364x273"}
//                       className="self-stretch h-72 object-cover"
//                     />
//                     <div className="text-Text-headings text-xl font-semibold leading-6">
//                       {item.title}
//                     </div>
//                     <div className="text-Text-body text-base leading-5 line-clamp-4">
//                       {item.lead}
//                     </div>
//                   </div>
//                   <div className="flex flex-col gap-1">
//                     <div className="inline-flex gap-1.5 items-center">
//                       <div className="w-6 h-6 relative">
//                         <div className="w-4 h-5 left-[3px] top-[2px] absolute bg-icon-primary" />
//                       </div>
//                       <div className="text-black text-xs">
//                         {new Date(item.date_created).toLocaleDateString("pl-PL")}
//                       </div>
//                     </div>
//                     <div className="inline-flex gap-[5px] items-center">
//                       <div className="w-6 h-6 relative">
//                         <div className="w-5 h-5 left-[2px] top-[2px] absolute bg-icon-primary" />
//                       </div>
//                       <div className="text-black text-xs opacity-70">
//                         {item.tags?.join(", ") || "brak"}
//                       </div>
//                     </div>
//                   </div>
//                 </a>
//               ))}
//             </div>

//           </div>
//         </div>
//       </div>
//     </>
//   );
// }