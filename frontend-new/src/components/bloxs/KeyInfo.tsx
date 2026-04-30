"use client";

type KeyInfoEntry = {
  id?: number | string | null;
  key?: string | null;
  value?: string | null;
};

type KeyInfoItem = {
  id: number;
  title?: string | null;
  items?: KeyInfoEntry[] | null;
};

export default function KeyInfo({ item }: { item: KeyInfoItem }) {
  const items = Array.isArray(item.items) ? item.items : [];

  if (items.length === 0) return null;

  return (
    <section className="bg-[#D1D5DC] px-6 py-12 xl:py-20 py-18 px-4 sm:px-6 lg:px-8 xl:px-28">
      <div className="flex flex-col gap-12">
        {item.title ? (
          <h2 className="text-3xl font-semibold leading-tight text-Text-body md:text-4xl md:leading-[48px]">
            {item.title}
          </h2>
        ) : null}

        {items.map((info, index) => {
          const title = info.key?.trim();
          const value = info.value?.trim();

          if (!title && !value) return null;

          return (
            <div
              key={info.id ?? index}
              className="flex flex-col items-start justify-center gap-6 md:gap-8 lg:gap-12"
            >
              {title ? (
                <h3 className="text-2xl font-semibold leading-tight text-Text-body md:text-3xl lg:text-4xl lg:leading-[48px]">
                  {title}
                </h3>
              ) : null}

              {value ? (
                <div
                  className="text-xl font-normal leading-8 text-Text-body md:text-2xl md:leading-9 lg:text-3xl lg:leading-10"
                  dangerouslySetInnerHTML={{ __html: value }}
                />
              ) : null}
            </div>
          );
        })}
      </div>
    </section>
  );
}