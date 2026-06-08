"use client";

import { useState } from "react";

type Props = {
  title?: string;
  icon?: string;
  html: string;
};

export default function FormInfoModalField({
  title,
  icon = "info",
  html,
}: Props) {
  const [open, setOpen] = useState(false);

  if (!html.trim()) return null;

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="w-fit inline-flex items-center gap-2 text-Text-body hover:text-dks-red transition-colors"
        aria-label={title ? `Pokaż informacje: ${title}` : "Pokaż informacje"}
      >
        <span className="material-symbols-outlined text-3xl leading-none">
          {icon || "info"}
        </span>

        {title && (
          <span className="text-sm md:text-base font-normal font-['Montserrat'] leading-5">
            {title}
          </span>
        )}
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4"
          onClick={() => setOpen(false)}
        >
          <div
            className="w-full max-w-[720px] max-h-[85vh] p-6 md:p-10 bg-white rounded-lg shadow-[4px_4px_8px_0px_rgba(0,0,0,0.25)] outline outline-1 outline-offset-[-1px] outline-border-primary flex flex-col gap-6 overflow-auto"
            onClick={(event) => event.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-label={title || "Informacja"}
          >
            <div className="flex items-start gap-3">
              <span
                className="material-symbols-outlined text-dks-red text-3xl leading-none"
                aria-hidden="true"
              >
                {icon || "info"}
              </span>

              {title && (
                <h3 className="text-Text-headings text-lg md:text-2xl font-semibold font-['Montserrat'] leading-6 md:leading-8">
                  {title}
                </h3>
              )}
            </div>

            <div
              className="text-Text-body text-base md:text-lg font-normal font-['Montserrat'] leading-7"
              dangerouslySetInnerHTML={{ __html: html }}
            />

            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Zamknij"
              className="self-center w-12 h-12 flex items-center justify-center text-dks-red hover:text-Text-headings transition-colors"
            >
              <span className="material-symbols-outlined text-5xl leading-none">
                close
              </span>
            </button>
          </div>
        </div>
      )}
    </>
  );
}
