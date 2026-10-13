const filePattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}(?:\.(?:avif|webp|png|jpe?g|gif|svg|tiff?|bmp|ico))?$/i;
const transforms = ['width', 'height', 'quality', 'format', 'fit', 'withoutEnlargement'];

export async function servePublicAsset(request, path, backend, fetchAsset = fetch) {
  if (path.length !== 1 || !filePattern.test(path[0])) return new Response(null, { status: 404 });
  const url = new URL(`${backend.replace(/\/$/, '')}/assets/${path[0]}`);
  const query = new URL(request.url).searchParams;
  for (const key of transforms) {
    const value = query.get(key);
    if (value !== null) url.searchParams.set(key, value);
  }
  // No admin cookies, authorization or service token: public permissions still apply.
  const upstream = await fetchAsset(url, { cache: 'no-store', credentials: 'omit', redirect: 'error' });
  if (!upstream.ok) {
    await upstream.body?.cancel();
    return new Response(null, { status: upstream.status, headers: { 'Cache-Control': 'no-store' } });
  }
  const type = upstream.headers.get('content-type') || '';
  if (!type.startsWith('image/')) {
    await upstream.body?.cancel();
    return new Response(null, { status: 404 });
  }
  return new Response(upstream.body, { headers: {
    'Content-Type': type,
    'Cache-Control': 'public, max-age=300',
    'Content-Security-Policy': "default-src 'none'; sandbox",
    'X-Content-Type-Options': 'nosniff',
  } });
}
