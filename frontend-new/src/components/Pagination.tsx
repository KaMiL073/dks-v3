import Link from "next/link";

type Props = {
  page: number;       // 1-based
  totalPages: number; // >= 1
  basePath: string;   // np. "/blog" albo `/blog/${categorySlug}`
};

export default function Pagination({ page, totalPages, basePath }: Props) {
  if (totalPages <= 1) return null;

  const prevPage = page - 1;
  const nextPage = page + 1;

  const prevHref =
    prevPage <= 1 ? `${basePath}` : `${basePath}/page/${prevPage}`;
  const nextHref = `${basePath}/page/${nextPage}`;

  const canPrev = page > 1;
  const canNext = page < totalPages;

  // UWAGA: link do strony 1 to zawsze basePath bez /page/1
  const currentPageHref = page <= 1 ? `${basePath}` : `${basePath}/page/${page}`;

  return (
    <div className="inline-flex justify-start items-center gap-2.5">
      {/* PREV */}
      {canPrev ? (
        <Link
          href={prevHref}
          aria-label="Poprzednia strona"
          className="px-1 py-0.5 flex justify-center items-center gap-2.5 overflow-hidden"
        >
          <div className="w-2.5 h-4 bg-icon-primary" />
        </Link>
      ) : (
        <div className="px-1 py-0.5 flex justify-center items-center gap-2.5 overflow-hidden opacity-40">
          <div className="w-2.5 h-4 bg-icon-primary" />
        </div>
      )}

      {/* MIDDLE */}
      <div className="flex justify-start items-center gap-2">
        <Link
          href={currentPageHref}
          className="px-4 py-2 rounded-lg outline outline-1 outline-offset-[-1px] outline-border-primary inline-flex flex-col justify-center items-center gap-2.5"
          aria-label={`Strona ${page}`}
        >
          <div className="w-2 flex flex-col justify-center items-center gap-2.5">
            <div className="self-stretch justify-start text-Text-headings text-xl font-normal font-['Montserrat'] leading-6">
              {page}
            </div>
          </div>
        </Link>

        <div className="w-7 flex justify-between items-center">
          <div className="justify-start text-Text-disabled text-xl font-normal font-['Montserrat'] leading-6">
            z {totalPages}
          </div>
        </div>
      </div>

      {/* NEXT */}
      {canNext ? (
        <Link
          href={nextHref}
          aria-label="Następna strona"
          className="px-1 py-0.5 flex justify-center items-center gap-2.5 overflow-hidden"
        >
          <div className="w-3 h-5 bg-icon-primary" />
        </Link>
      ) : (
        <div className="px-1 py-0.5 flex justify-center items-center gap-2.5 overflow-hidden opacity-40">
          <div className="w-3 h-5 bg-icon-primary" />
        </div>
      )}
    </div>
  );
}