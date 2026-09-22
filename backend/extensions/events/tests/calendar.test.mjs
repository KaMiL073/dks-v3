import { test } from 'node:test';
import assert from 'node:assert/strict';
import register from '../src/index.js';
import { readFile } from 'node:fs/promises';

test('registration confirmations preserve their template and include a safe calendar invitation', async () => {
  let handler;
  const sent = [];
  const event = { id: 7, name: 'Wydarzenie; DKS, Łódź '.repeat(8), slug: 'test', start_date: '2026-01-27', end_date: '2026-01-29', location: 'Sala A\r\nNowa linia' };
  const form = { email: 'test@example.com', name: 'Jan', event: 'test#formularz' };
  const originalFetch = globalThis.fetch;
  globalThis.fetch = async () => ({ ok: true, json: async () => ({ data: [event] }) });
  try {
    register({ action: (name, callback) => { assert.equal(name, 'events.items.create'); handler = callback; } }, {
      env: { SERVICE_USER_TOKEN: 'test' },
      services: { MailService: class { async send(message) { sent.push(message); } } },
    });
    await handler({ key: 1, payload: form }, { schema: {} });
    const message = sent.at(-1);
    assert.equal(message.subject, event.name);
    assert.deepEqual(message.template, { name: 'event', data: { data: { ...form, eventData: event } } });
    assert.equal(message.icalEvent.method, 'REQUEST');
    const raw = message.icalEvent.content;
    const unfolded = raw.replace(/\r\n /g, '');
    assert.match(unfolded, /DTSTART;VALUE=DATE:20260127\r\nDTEND;VALUE=DATE:20260130/);
    assert.ok(unfolded.includes('LOCATION:Sala A\\nNowa linia'));
    assert.ok(unfolded.includes('SUMMARY:Wydarzenie\\; DKS\\, Łódź'));
    assert.ok(raw.split('\r\n').every(line => Buffer.byteLength(line) <= 75));
    const uid = unfolded.match(/UID:(.*)/)[1];
    event.end_date = null;
    await handler({ key: 2, payload: form }, { schema: {} });
    assert.ok(sent.at(-1).icalEvent.content.includes('DTEND;VALUE=DATE:20260128'));
    assert.ok(sent.at(-1).icalEvent.content.includes(`UID:${uid}`));
    for (const date of [null, '2026-02-30', 'invalid']) {
      event.start_date = date;
      await handler({ key: 3, payload: form }, { schema: {} });
      assert.equal(sent.at(-1).icalEvent, undefined);
      assert.equal(sent.at(-1).to, form.email);
    }
    assert.equal(sent.length, 5);
  } finally {
    globalThis.fetch = originalFetch;
  }
});

test('deployed extension matches source', async () => {
  assert.equal(await readFile(new URL('../src/index.js', import.meta.url), 'utf8'), await readFile(new URL('../dist/index.js', import.meta.url), 'utf8'));
});
