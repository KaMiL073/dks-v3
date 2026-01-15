// src/app/api/logout/route.ts
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { directus } from '@/app/lib/directus';

export async function POST() {
  const jar = await cookies();
  const refresh = jar.get('refresh_token')?.value;

  try {
    if (refresh) {
      await directus.logout({ refresh_token: refresh });
    }
  } catch {
    // ignorujemy błędy revoke
  }

  jar.delete('access_token');
  jar.delete('refresh_token');

  return NextResponse.json({ ok: true });
}