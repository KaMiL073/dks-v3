import test from 'node:test';
import assert from 'node:assert/strict';
import { servePublicAsset } from '../src/lib/publicAssets.mjs';
const id = '5c9b1787-05db-4925-ac0d-7fef6250dcff';

test('images are fetched anonymously, never forwarding session or query tokens', async () => {
  const request = new Request('https://dks.pl/api/public-assets/' + id + '?width=640&access_token=secret', {
    headers: { Cookie: 'directus_session_token=expired', Authorization: 'Bearer secret' },
  });
  const response = await servePublicAsset(request, [id], 'http://directus:8055', async (url, options) => {
    assert.equal(url.toString(), `http://directus:8055/assets/${id}?width=640`);
    assert.equal(options.credentials, 'omit');
    assert.equal(options.headers, undefined);
    return new Response('<svg/>', { headers: { 'content-type': 'image/svg+xml', 'set-cookie': 'secret' } });
  });
  assert.equal(response.status, 200);
  assert.equal(await response.text(), '<svg/>');
  assert.equal(response.headers.get('set-cookie'), null);
});

test('public access denials remain denials and cannot be cached', async () => {
  const response = await servePublicAsset(new Request('https://dks.pl/api/public-assets/' + id), [id], 'http://directus:8055',
    async () => new Response('private', { status: 403 }));
  assert.equal(response.status, 403);
  assert.equal(response.headers.get('cache-control'), 'no-store');
});

test('invalid paths cannot access other Directus endpoints', async () => {
  for (const path of [['..', 'users'], ['users'], [id, 'extra']]) {
    const response = await servePublicAsset(new Request('https://dks.pl/api/public-assets/x'), path, 'http://directus:8055',
      async () => { throw new Error('must not fetch'); });
    assert.equal(response.status, 404);
  }
});
