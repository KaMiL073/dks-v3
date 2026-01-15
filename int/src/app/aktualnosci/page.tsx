import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { directus } from "@/app/lib/directus";
import { readItems } from "@directus/sdk";
import { LogoutButton } from "@/app/components/LogoutButton";

export default async function AktualnosciPage() {
  const jar = await cookies();
  const token = jar.get("access_token")?.value;

  if (!token) {
    redirect("/int/login"); // <-- nigdy nie zwracaj null
  }

  directus.setToken(token);

  const posts = await directus.request(
    readItems("int_feed", {
      fields: ["id", "title", "image", "content", "date_created"],
      sort: ["-date_created"],
      limit: 20,
    })
  );

  return (
    <main className="max-w-5xl mx-auto p-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Aktualności</h1>
        <LogoutButton />
      </div>

      {!posts?.length && <p className="text-gray-500">Brak aktualności do wyświetlenia.</p>}

      <div className="space-y-6">
        {posts?.map((post: any) => (
          <article key={post.id} className="bg-white shadow rounded-xl p-6">
            {post.image && (
              <img
                src={`${process.env.NEXT_PUBLIC_DIRECTUS_URL}/assets/${post.image}`}
                alt={post.title}
                className="rounded mb-4"
              />
            )}
            <h2 className="text-xl font-semibold mb-2">{post.title}</h2>
            <p className="text-sm text-gray-600 mb-2">
              {new Date(post.date_created).toLocaleDateString("pl-PL")}
            </p>
            <p className="text-gray-700 leading-relaxed">
              {post.content?.slice(0, 300)}...
            </p>
          </article>
        ))}
      </div>
    </main>
  );
}