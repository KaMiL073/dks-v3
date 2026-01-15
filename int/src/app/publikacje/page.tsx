// app/publikacje/page.tsx
import { cookies } from 'next/headers';
import { directus } from '@/app/lib/directus';
import { readItems } from '@directus/sdk';
import { LogoutButton } from '@/app/components/LogoutButton';

export default async function PublikacjePage() {
  const jar = await cookies();
  const token = jar.get('access_token')?.value;

  // Middleware i tak nie wpuści tu bez tokenu, ale zostawiamy guard
  if (!token) return null;

  directus.setToken(token);

  const posts = await directus.request(
    readItems('publikacje', {
      fields: ['id', 'title', 'image', 'content'],
      sort: ['-date_created'],
      limit: 24,
    })
  );

  return (
    <main className="max-w-6xl mx-auto p-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Publikacje</h1>
        <LogoutButton />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {posts?.map((p: any) => (
          <article key={p.id} className="bg-white rounded-xl shadow p-4">
            {p.image && (
              <img
                className="rounded mb-3"
                src={`${process.env.NEXT_PUBLIC_DIRECTUS_URL}/assets/${p.image}`}
                alt={p.title}
              />
            )}
            <h2 className="font-semibold mb-1">{p.title}</h2>
            {p.content && (
              <p className="text-sm text-gray-600 line-clamp-3">{p.content}</p>
            )}
          </article>
        ))}
      </div>
    </main>
  );
}