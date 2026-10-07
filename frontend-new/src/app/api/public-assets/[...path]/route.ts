import { servePublicAsset } from '@/lib/publicAssets.mjs';

export async function GET(request: Request, context: { params: Promise<{ path: string[] }> }) {
  const { path } = await context.params;
  const backend = process.env.DIRECTUS_INTERNAL_URL || process.env.API_INTERNAL_URL || 'http://directus:8055';
  try {
    return await servePublicAsset(request, path, backend);
  } catch {
    return new Response(null, { status: 502, headers: { 'Cache-Control': 'no-store' } });
  }
}
