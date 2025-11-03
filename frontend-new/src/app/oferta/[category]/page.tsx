import { notFound } from "next/navigation";
import { mapSlugToCollection } from "@/lib/directusCategoryMapper";
import ClientCategoryPage from "./ClientCategoryPage";
import { Heading1 } from "@/components/ui/Typography/Heading1";

export default async function CategoryPage(props: {
  params: Promise<{ category: string }>;
}) {
  // ✅ NEXT 15: params to Promise — trzeba awaitować
  const { category } = await props.params;

  console.log("🌐 CategoryPage:", category);

  // ✅ Poprawne mapowanie slug → kolekcja
  const collection = await mapSlugToCollection(category);

  if (!collection) {
    console.warn(`⚠️ Nie znaleziono kolekcji dla slug: ${category}`);
    return notFound();
  }

  console.log("✅ Mapped category:", category, "→", collection);

  return (
    <div className="p-6 xl:px-28 py-20">
      <div className="self-stretch py-12">
        <Heading1 variant="semibold">
          {category.replaceAll("-", " ")}
        </Heading1>
      </div>
      <ClientCategoryPage
        category={category}
        categorySlug={category}
        collection={collection}
      />
    </div>
  );
}