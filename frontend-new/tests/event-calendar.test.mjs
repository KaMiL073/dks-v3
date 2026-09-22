import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import ts from 'typescript';
const code = ts.transpileModule(readFileSync(new URL('../src/lib/eventCalendar.ts', import.meta.url), 'utf8'), { compilerOptions: { module: ts.ModuleKind.ES2022 } }).outputText;
const { getCalendarData, formatEventSchedule } = await import(`data:text/javascript;base64,${Buffer.from(code).toString('base64')}`);
const base = { id: 'test', title: 'DKS, Łódź; spotkanie', location: 'Sala A\nKowale', start_date: '2026-10-15' };
test('all-day ranges use exclusive calendar end dates and escape text', () => {
  const result = getCalendarData({ ...base, end_date: '2026-10-17' });
  assert.equal(new URL(result.google).searchParams.get('dates'), '20261015/20261018');
  assert.equal(new URL(result.outlook).searchParams.get('allday'), 'true');
  assert.match(result.ics, /DTEND;VALUE=DATE:20261018/);
  assert.ok(result.ics.includes('SUMMARY:DKS\\, Łódź\\; spotkanie'));
  assert.ok(result.ics.includes('LOCATION:Sala A\\nKowale'));
  assert.match(getCalendarData(base).ics, /DTEND;VALUE=DATE:20261016/);
});
test('Polish times convert to UTC in winter and summer', () => {
  for (const [day, expected] of [['2026-01-15', '20260115T090000Z'], ['2026-07-15', '20260715T080000Z']]) {
    const result = getCalendarData({ ...base, start_date: day, start_time: '10:00:00', end_time: '12:00:00' });
    assert.ok(result.ics.includes(`DTSTART:${expected}`));
    assert.equal(new URL(result.outlook).searchParams.get('allday'), 'false');
  }
});
test('missing, impossible and backwards times do not produce calendar links', () => {
  for (const overrides of [{ start_date: null }, { start_date: '2026-02-30' }, { end_date: '2026-10-14' },
    { start_time: '10:00' }, { start_time: '12:00', end_time: '10:00' },
    { start_date: '2026-03-29', start_time: '02:30', end_time: '04:00' }]) {
    assert.equal(getCalendarData({ ...base, ...overrides }), null);
  }
});
test('display dates and line folding preserve Polish text', () => {
  assert.equal(formatEventSchedule({ ...base, start_time: '10:00:00', end_time: '12:00:00' }), '15.10.2026 10:00 – 12:00');
  const result = getCalendarData({ ...base, title: 'Łódź '.repeat(50) });
  assert.ok(result.ics.split('\r\n').every(line => Buffer.byteLength(line) <= 75));
  assert.ok(result.ics.replace(/\r\n /g, '').includes('Łódź '.repeat(50)));
});
