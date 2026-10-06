import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { runInNewContext } from 'node:vm';
import test from 'node:test';

const require = createRequire(import.meta.url);
const ts = require('typescript');

function load(path, imports, globals = {}) {
  const source = readFileSync(new URL(path, import.meta.url), 'utf8');
  const compiled = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } }).outputText;
  const exports = {};
  runInNewContext(compiled, { exports, require: name => {
    if (!(name in imports)) throw new Error(`Unexpected import: ${name}`);
    return imports[name];
  }, console, URLSearchParams, ...globals });
  return exports;
}

test('public forms exclude attendance even when its schema marks it required', async () => {
  const fields = [
    { field: 'name', type: 'string', meta: { interface: 'input' }, schema: { is_nullable: false } },
    { field: 'attended', type: 'boolean', meta: { interface: 'boolean', required: true }, schema: { is_nullable: false, default_value: false } },
  ];
  const forms = load('../src/lib/fields.ts', {
    'server-only': {},
    '@directus/sdk': { readFieldsByCollection: collection => collection, readCollections: () => null, withToken: (_token, command) => command },
    '@/lib/directus': { directus: { request: async () => fields }, directusToken: '' },
  });
  const flat = await forms.getFields('events');
  assert.deepEqual(Array.from(flat, field => field.name), ['name']);
  assert.equal(flat[0].required, true);
  const grouped = await forms.getGroupedFields('events');
  assert.deepEqual(Array.from(grouped.flatMap(group => group.fields), field => field.name), ['name']);
});

test('registration does not require attendance and discards visitor-supplied values', async () => {
  const forwarded = [];
  const route = load('../src/app/api/forms/events/route.ts', {
    'next/server': { NextResponse: { json: (body, options) => ({ body, status: options?.status ?? 200 }) } },
  }, {
    process: { env: { API_INTERNAL_URL: 'http://directus.test', SERVICE_USER_TOKEN: 'test' } },
    fetch: async (_url, options) => {
      forwarded.push(JSON.parse(options.body));
      return { ok: true, json: async () => ({ data: { id: 1, attended: false } }) };
    },
  });
  for (const extra of [{}, { attended: true }, { attended: 'false' }]) {
    const result = await route.POST({ json: async () => ({ name: 'Test', event: 'test-event', ...extra }) });
    assert.equal(result.status, 200);
    assert.equal('attended' in forwarded.at(-1), false);
    assert.equal(forwarded.at(-1).name, 'Test');
  }
});
