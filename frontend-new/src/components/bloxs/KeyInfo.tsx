"use client";

type Alignment = "left" | "center" | "right";

type KeyInfoEntry = {
  id?: number | string | null;
  key?: string | null;
  value?: string | null;
};

type KeyInfoItem = {
  id: number;

  title?: string | null;

  items?: KeyInfoEntry[] | null;

  background_color?: string | null;

  alignment?: Alignment | string | null;
};

function getAlignmentClasses(alignment?: string | null) {
  switch (alignment) {
    case "center":
      return {
        wrapper: "items-center text-center",
        content: "text-center",
      };

    case "right":
      return {
        wrapper: "items-end text-right",
        content: "text-right",
      };

    case "left":
    default:
      return {
        wrapper: "items-start text-left",
        content: "text-left",
      };
  }
}

export default function KeyInfo({ item }: { item: KeyInfoItem }) {
  const items = Array.isArray(item.items) ? item.items : [];

  if (items.length === 0) return null;

  const backgroundColor =
    item.background_color?.trim() || "#ffffff";

  const alignment = getAlignmentClasses(item.alignment);

  return (
    <section
      className="px-4 py-12 sm:px-6 md:py-18 xl:px-28 xl:py-20 lg:px-8"
      style={{
        backgroundColor,
      }}
    >
      <div
        className={`flex flex-col gap-12 ${alignment.wrapper}`}
      >
        {item.title ? (
          <h2
            className={`text-3xl font-semibold leading-tight text-Text-body md:text-4xl md:leading-[48px] ${alignment.content}`}
          >
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
              className={`flex flex-col justify-center gap-2 md:gap-2 lg:gap-4 ${alignment.wrapper}`}
            >
              {title ? (
                <h3
                  className={`text-2xl font-semibold leading-tight text-Text-body md:text-3xl lg:text-4xl lg:leading-[48px] ${alignment.content}`}
                >
                  {title}
                </h3>
              ) : null}

              {value ? (
                <div
                  className={`text-xl font-normal leading-8 text-Text-body md:text-2xl md:leading-9 lg:text-3xl lg:leading-10 ${alignment.content}`}
                  dangerouslySetInnerHTML={{
                    __html: value,
                  }}
                />
              ) : null}
            </div>
          );
        })}
      </div>
    </section>
  );
}