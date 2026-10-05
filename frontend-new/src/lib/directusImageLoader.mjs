/** Resize through the public Directus proxy, not Next's internal /backend route. */
export function isDirectusAsset(src) {
  try {
    const url = new URL(src, 'https://dks.pl');
    return /\/assets\/[0-9a-f-]{36}(?:\/[^/]*)?$/i.test(url.pathname);
  } catch {
    return false;
  }
}

export function directusImageLoader({ src, width, quality = 75 }) {
  const url = new URL(src, 'https://dks.pl');
  url.searchParams.set('width', String(width));
  url.searchParams.set('quality', String(quality));
  url.searchParams.set('format', 'webp');
  url.searchParams.set('withoutEnlargement', 'true');
  return src.startsWith('/') ? `${url.pathname}${url.search}${url.hash}` : url.toString();
}
