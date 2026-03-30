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
    <aside className={`w-96 flex flex-col ${className}`}>
      {categories.map((category) => {
        const isActive = category.slug === activeSlug;

        return (
          <Link
            href={`/blog/${category.slug}`}
            key={category.id}
            className={[
              "w-full px-6 py-5 border-b flex items-center justify-between transition",
              "border-[#99A1AF]",
              isActive
                ? "bg-surface-page"
                : "bg-[#D1D5DC] hover:bg-surface-page",
            ].join(" ")}
          >
            <div className="text-Text-headings text-xl font-semibold leading-snug">
              {category.name}
            </div>

            <div className="flex items-center pl-4 shrink-0">
              <Image
                src="/static/icons/ArrowNext.svg"
                alt=""
                width={16}
                height={16}
                aria-hidden="true"
              />
            </div>
          </Link>
        );
      })}
    </aside>
  );
}