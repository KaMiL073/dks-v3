import Link from "next/link";

type Props =
  | {
      page: number;       // 1-based
      totalPages: number; // >= 1
      basePath: string;   // np. "/blog" albo `/blog/${categorySlug}`
      onPageChange?: never;
    }
  | {
      page: number;       // 1-based
      totalPages: number; // >= 1
      onPageChange: (nextPage: number) => void;
      basePath?: never;
    };

function ArrowLeftIcon() {
  return (
    <svg width="10" height="16" viewBox="0 0 10 16" fill="none" aria-hidden="true">
      <path
        d="M6.5 2L1.5 8L6.5 14"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ArrowRightIcon() {
  return (
    <svg width="12" height="20" viewBox="0 0 12 20" fill="none" aria-hidden="true">
      <path
        d="M5 4L10 10L5 16"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function clamp(n: number, min: number, max: number) {
  return Math.min(Math.max(n, min), max);
}

export default function Pagination(props: Props) {
  const { page, totalPages } = props;
  if (totalPages <= 1) return null;

  const canPrev = page > 1;
  const canNext = page < totalPages;

  const prevPage = page - 1;
  const nextPage = page + 1;

  // ✅ Wspólny wygląd
  const btnBase =
    "h-10 w-10 inline-flex items-center justify-center rounded-lg transition disabled:opacity-40";
  const btnEnabled = "hover:bg-surface-page";
  const box =
    "h-10 min-w-10 px-3 inline-flex items-center justify-center rounded-lg border border-border-primary";

  // ============ TRYB A: LINKI (Blog) ============
  if ("basePath" in props) {
    const { basePath } = props;

    const prevHref = prevPage <= 1 ? `${basePath}` : `${basePath}/page/${prevPage}`;
    const nextHref = `${basePath}/page/${nextPage}`;
    const currentPageHref = page <= 1 ? `${basePath}` : `${basePath}/page/${page}`;

    return (
      <nav className="inline-flex items-center gap-3" aria-label="Paginacja">
        {/* PREV */}
        {canPrev ? (
          <Link
            href={prevHref}
            aria-label="Poprzednia strona"
            className={`${btnBase} ${btnEnabled}`}
          >
            <ArrowLeftIcon />
          </Link>
        ) : (
          <span className={btnBase} aria-hidden="true">
            <ArrowLeftIcon />
          </span>
        )}

        {/* MIDDLE */}
        <div className="inline-flex items-center gap-2">
          <Link href={currentPageHref} className={box} aria-label={`Strona ${page}`}>
            <span className="text-Text-headings text-lg font-semibold font-['Montserrat'] leading-none">
              {page}
            </span>
          </Link>

          <span className="text-Text-disabled text-lg font-normal font-['Montserrat'] leading-none">
            z {totalPages}
          </span>
        </div>

        {/* NEXT */}
        {canNext ? (
          <Link
            href={nextHref}
            aria-label="Następna strona"
            className={`${btnBase} ${btnEnabled}`}
          >
            <ArrowRightIcon />
          </Link>
        ) : (
          <span className={btnBase} aria-hidden="true">
            <ArrowRightIcon />
          </span>
        )}
      </nav>
    );
  }

  // ============ TRYB B: CALLBACK (Oferta) ============
  const { onPageChange } = props;

  const go = (p: number) => onPageChange(clamp(p, 1, totalPages));

  return (
    <nav className="inline-flex items-center gap-3" aria-label="Paginacja">
      <button
        type="button"
        onClick={() => (canPrev ? go(prevPage) : null)}
        disabled={!canPrev}
        aria-label="Poprzednia strona"
        className={`${btnBase} ${canPrev ? btnEnabled : ""}`}
      >
        <ArrowLeftIcon />
      </button>

      <div className={box} aria-label={`Strona ${page}`}>
        <span className="text-Text-headings text-lg font-semibold font-['Montserrat'] leading-none">
          {page}
        </span>
      </div>

      <span className="text-Text-disabled text-lg font-normal font-['Montserrat'] leading-none">
        z {totalPages}
      </span>

      <button
        type="button"
        onClick={() => (canNext ? go(nextPage) : null)}
        disabled={!canNext}
        aria-label="Następna strona"
        className={`${btnBase} ${canNext ? btnEnabled : ""}`}
      >
        <ArrowRightIcon />
      </button>
    </nav>
  );
}