export default ({ action }, { logger, database, services, getSchema }) => {
  const { CollectionsService } = services;

  action('items.create', async (meta) => {
    if (meta.collection !== 'products') return;
    const payload = meta.payload;
    if (!payload || payload.canonical) return;

    try {
      const schema = await getSchema();
      const collectionsService = new CollectionsService({
        schema,
        knex: database,
      });

      // 📚 Pobierz wszystkie kolekcje z Directusa
      const allCollections = await collectionsService.readByQuery({ limit: -1 });

      if (!Array.isArray(allCollections)) {
        logger.error(`[set-canonical-url] ❌ Brak danych kolekcji`);
        return;
      }

      let categorySlug = 'brak-kategorii';
      let subcategorySlug = '';
      let categoryCollection: string | null = null;

      const createdRelations = payload.type?.create || [];

      // 🔹 Krok 1: znajdź kategorię (group = 'products')
      for (const rel of createdRelations) {
        const collectionMeta = allCollections.find(
          (c) => c.collection === rel.collection
        );
        if (!collectionMeta) continue;

        const group = collectionMeta.meta?.group;
        if (group === 'products') {
          categorySlug =
            collectionMeta.meta?.display_template ||
            collectionMeta.meta?.note ||
            rel.collection;
          categoryCollection = collectionMeta.collection;
        }
      }

      // 🔹 Krok 2: znajdź subkategorię (group = nazwa kolekcji kategorii)
      if (categoryCollection) {
        for (const rel of createdRelations) {
          const collectionMeta = allCollections.find(
            (c) => c.collection === rel.collection
          );
          if (!collectionMeta) continue;

          const group = collectionMeta.meta?.group;
          if (group === categoryCollection) {
            subcategorySlug =
              collectionMeta.meta?.display_template ||
              collectionMeta.meta?.note ||
              rel.collection;
          }
        }
      }

      // 📦 Składamy canonical
      let canonical = `/oferta/${categorySlug}`;
      if (subcategorySlug && subcategorySlug !== categorySlug)
        canonical += `/${subcategorySlug}`;
      canonical += `/${payload.slug}`;

      // 🧩 Aktualizujemy produkt
      await database('products').update({ canonical }).where({ id: meta.key });

    } catch (error) {
      logger.error(
        `[set-canonical-url] ❌ błąd ustawiania canonical: ${error.message}`
      );
    }
  });
};