/** Resize through the public Directus proxy, not Next's internal /backend route. */
export function isDirectusAsset(src) {
  try {
    const url = new URL(src, 'https://dks.pl');
    // CMS cards also store file ids with an image extension (e.g. UUID.webp).
    // These are Directus assets too and must bypass Next's internal /backend route.
    return /\/assets\/[0-9a-f-]{36}(?:\.(?:avif|webp|png|jpe?g|gif|svg|tiff?|bmp|ico))?(?:\/[^/]*)?$/i.test(url.pathname);
  } catch {
    return false;
  }
}

export function directusImageLoader({ src, width, quality = 75 }) {
  const url = new URL(publicAssetUrl(src), 'https://dks.pl');
  url.searchParams.set('width', String(width));
  url.searchParams.set('quality', String(quality));
  url.searchParams.set('format', 'webp');
  url.searchParams.set('withoutEnlargement', 'true');
  return publicAssetUrl(src).startsWith('/') ? `${url.pathname}${url.search}${url.hash}` : url.toString();
}

/** Public site images use anonymous access, independent of the admin session. */
export function publicAssetUrl(src) {
  if (!isDirectusAsset(src)) return src;
  const url = new URL(src, 'https://dks.pl');
  if (!src.startsWith('/') && !['dks.pl', 'www.dks.pl', 'localhost'].includes(url.hostname)) return src;
  const file = url.pathname.split('/assets/')[1].split('/')[0];
  return `/api/public-assets/${file}${url.search}`;
}
