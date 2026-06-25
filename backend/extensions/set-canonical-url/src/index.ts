const SITE_URL = "https://dks.pl";

type HookContext = {
  collection: string;
  key?: string | number;
  payload?: {
    slug?: string;
    canonical?: string | null;
  };
};

type DirectusServices = {
  logger: {
    error: (message: string) => void;
    info: (message: string) => void;
  };
  database: (table: string) => {
    select: (columns: string | string[]) => {
      where: (conditions: Record<string, unknown>) => {
        first: () => Promise<{ slug?: string | null; canonical?: string | null } | undefined>;
      };
    };
    update: (values: Record<string, unknown>) => {
      where: (conditions: Record<string, unknown>) => Promise<unknown>;
    };
  };
};

function buildCanonical(slug: string) {
  return `${SITE_URL}/oferta/produkty/${slug}`;
}

async function getProductSlug(database: DirectusServices["database"], key?: string | number) {
  if (!key) return null;

  const product = await database("products")
    .select(["slug", "canonical"])
    .where({ id: key })
    .first();

  return product?.slug?.trim() || null;
}

export default (
  { action }: { action: (name: string, handler: (meta: HookContext) => Promise<void>) => void },
  { logger, database }: DirectusServices
) => {
  async function setCanonical(meta: HookContext) {
    if (meta.collection !== "products") return;

    try {
      const payloadSlug = meta.payload?.slug?.trim();
      const slug = payloadSlug || (await getProductSlug(database, meta.key));

      if (!slug) return;

      const canonical = buildCanonical(slug);

      if (meta.payload?.canonical === canonical) return;

      await database("products").update({ canonical }).where({ id: meta.key });

      logger.info(`[set-canonical-url] ustawiono canonical: ${canonical}`);
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      logger.error(`[set-canonical-url] błąd ustawiania canonical: ${message}`);
    }
  }

  action("items.create", setCanonical);
  action("items.update", setCanonical);
};
