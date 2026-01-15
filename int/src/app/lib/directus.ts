// lib/directus.ts
import { createDirectus, rest, authentication } from '@directus/sdk';

const DIRECTUS_URL = process.env.NEXT_PUBLIC_DIRECTUS_URL!;
if (!DIRECTUS_URL) {
  throw new Error('Brak NEXT_PUBLIC_DIRECTUS_URL w .env.local');
}

export const directus = createDirectus(DIRECTUS_URL)
  .with(authentication('json'))
  .with(rest());