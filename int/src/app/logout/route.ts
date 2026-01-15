// src/app/logout/route.ts
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { directus } from '@/app/lib/directus';

export async function POST() {
  const jar = await cookies();
  const refresh = jar.get('refresh_token')?.value;

  try {
    if (refresh) {
      // ✅ v11: wymagany obiekt { refresh_token }
      await directus.logout({ refresh_token: refresh });
    }
  } catch (e) {
    console.warn('Logout warning:', e);
  }

  jar.delete('access_token');
  jar.delete('refresh_token');

  return NextResponse.json({ ok: true });
}