import test from 'node:test';
import assert from 'node:assert/strict';
import { directusImageLoader, isDirectusAsset } from '../src/lib/directusImageLoader.mjs';
const id = 'c1a663fa-664e-4841-9897-10416cd50c84';
test('relative Directus images stay on the same origin and retain existing parameters', () => {
  const result = new URL(directusImageLoader({ src: `/backend/assets/${id}?fit=inside`, width: 640 }), 'http://localhost');
  assert.equal(result.origin, 'http://localhost');
  assert.equal(result.searchParams.get('fit'), 'inside');
  assert.equal(result.searchParams.get('width'), '640');
  assert.equal(result.searchParams.get('format'), 'webp');
  assert.equal(result.searchParams.get('quality'), '75');
});
test('absolute images retain their host and override existing dimensions', () => {
  const result = new URL(directusImageLoader({ src: `https://dks.pl/backend/assets/${id}?width=2000`, width: 384, quality: 80 }));
  assert.equal(result.host, 'dks.pl');
  assert.equal(result.searchParams.getAll('width').length, 1);
  assert.equal(result.searchParams.get('width'), '384');
  assert.equal(result.searchParams.get('quality'), '80');
});
test('static files and external non-Directus images keep the default loader', () => {
  assert.equal(isDirectusAsset(`/backend/assets/${id}`), true);
  assert.equal(isDirectusAsset(`https://dks.pl/backend/assets/${id}/hero.png`), true);
  assert.equal(isDirectusAsset('/static/homepage/Header.webp'), false);
  assert.equal(isDirectusAsset('https://example.com/image.jpg'), false);
});
test('Directus ids with image extensions use the Directus loader and retain the file path', () => {
  for (const extension of ['webp', 'png', 'jpg', 'jpeg', 'avif', 'svg', 'WEBP']) {
    const src = `/backend/assets/${id}.${extension}?fit=inside`;
    assert.equal(isDirectusAsset(src), true);
    assert.equal(isDirectusAsset(`https://dks.pl${src}`), true);
    const result = new URL(directusImageLoader({ src, width: 640 }), 'https://dks.pl');
    assert.equal(result.pathname, `/backend/assets/${id}.${extension}`);
    assert.equal(result.searchParams.get('width'), '640');
    assert.equal(result.searchParams.get('format'), 'webp');
    assert.equal(result.searchParams.get('fit'), 'inside');
  }
  assert.equal(isDirectusAsset('/static/homepage/Header.webp'), false);
});
