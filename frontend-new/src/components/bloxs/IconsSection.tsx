"use client";

type IconItem = {
  id?: number | string | null;
  icon?: string | null;
  ikona?: string | null;
  label?: string | null;
  title?: string | null;
  description?: string | null;
};

type IconsSectionItem = {
  id: number;
  title?: string | null;
  name?: string | null;
  items?: IconItem[];
  item?: IconItem[];
};

function normalizeMaterialIconName(value?: string | null) {
  if (!value?.trim()) return null;

  return value
    .trim()
    .toLowerCase()
    .replace(/-/g, "_")
    .replace(/\s+/g, "_");
}

function getIconName(item?: IconItem | null) {
  return (
    normalizeMaterialIconName(item?.ikona) ||
    normalizeMaterialIconName(item?.icon) ||
    null
  );
}

export default function IconsSection({ item }: { item: IconsSectionItem }) {
  const items = Array.isArray(item.items)
    ? item.items
    : Array.isArray(item.item)
      ? item.item
      : [];

  if (items.length === 0) return null;

  return (
    <section className="self-stretch inline-flex flex-col justify-start gap-12 px-4 py-12 sm:px-6 md:py-20 lg:px-8 xl:px-28">
      {item.title || item.name ? (
        <h2 className="text-4xl font-semibold leading-[48px] text-Text-headings">
          {item.title || item.name}
        </h2>
      ) : null}

      <div className="self-stretch inline-flex flex-wrap content-start items-start justify-center gap-12">
        {items.map((iconItem, index) => {
          const iconName = getIconName(iconItem);
          const label = iconItem.label || iconItem.title;

          return (
            <div
              key={`${iconItem.id ?? label ?? "icon"}-${index}`}
              className="inline-flex w-80 flex-col items-center justify-start gap-6"
            >
              <div className="flex h-32 w-32 items-center justify-center">
                {iconName ? (
                  <span
                    className="material-symbols-outlined text-icon-primary"
                    style={{
                      fontSize: "110px",
                      lineHeight: 1,
                      fontVariationSettings:
                        '"FILL" 0, "wght" 400, "GRAD" 0, "opsz" 48',
                    }}
                    aria-hidden="true"
                  >
                    {iconName}
                  </span>
                ) : null}
              </div>

              {label ? (
                <div
                  className="self-stretch text-center text-xl font-semibold leading-6 text-Text-body"
                  dangerouslySetInnerHTML={{ __html: label }}
                />
              ) : null}

              {iconItem.description ? (
                <div
                  className="self-stretch text-center text-base font-normal leading-6 text-Text-body"
                  dangerouslySetInnerHTML={{ __html: iconItem.description }}
                />
              ) : null}
            </div>
          );
        })}
      </div>
    </section>
  );
}