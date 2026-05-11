import Link from "next/link";
import Image from "next/image";

type BlogCategory = {
  id: string;
  name: string;
  slug: string;
};

type BlogCategoriesSidebarProps = {
  categories: BlogCategory[];
  activeSlug?: string;
  className?: string;
};

export default function BlogCategoriesSidebar({
  categories,
  activeSlug,
  className = "",
}: BlogCategoriesSidebarProps) {
  return (
    <aside
      className={[
        "w-full lg:w-80 xl:w-96 shrink-0 flex flex-col",
        className,
      ].join(" ")}
    >
      {categories.map((category) => {
        const isActive = category.slug === activeSlug;

        return (
          <Link
            href={`/blog/${category.slug}`}
            key={category.id}
            className={[
              "w-full px-4 md:px-6 py-3 md:py-4 border-b flex items-center justify-between transition",
              "border-[#99A1AF]",
              isActive
                ? "bg-surface-page"
                : "bg-[#D1D5DC] hover:bg-surface-page",
            ].join(" ")}
          >
            <div className="min-w-0 pr-4 text-Text-headings text-sm md:text-base xl:text-xl font-semibold leading-5 md:leading-snug break-words">
              {category.name}
            </div>

            <div className="flex items-center pl-2 md:pl-4 shrink-0">
              <Image
                src="/static/icons/ArrowNext.svg"
                alt=""
                width={16}
                height={16}
                aria-hidden="true"
                className="w-3.5 h-3.5 md:w-4 md:h-4"
              />
            </div>
          </Link>
        );
      })}
    </aside>
  );
}