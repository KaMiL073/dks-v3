import test from 'node:test';
import assert from 'node:assert/strict';
import { validateSubmission } from '../src/validation.js';
const survey = { status: 'published', mode: 'anonymous' };
const questions = [
  { id: 'text', title: 'Tekst', type: 'short_text', required: true },
  { id: 'one', title: 'Wybierz', type: 'single_choice', required: true },
  { id: 'many', title: 'Wiele', type: 'multiple_choice', required: false },
];
const options = [{ id: 'a', question: 'one', label: 'Tak' }, { id: 'b', question: 'many', label: 'B' }];
const body = () => ({ answers: { text: ' Test ', one: 'a', many: ['b'] }, contact: { email: 'private@example.com' } });
const run = (b = body(), s = survey, q = questions, o = options) => validateSubmission(s, q, o, b);

test('normalizes text and snapshots selected option labels', () => {
  const result = run();
  assert.equal(result.answers[0].value, 'Test');
  assert.deepEqual(result.answers[1].option_labels, ['Tak']);
  assert.deepEqual(result.answers[2].value, ['b']);
});
test('anonymous survey never returns contact data, including malicious fields', () => {
  assert.deepEqual(run().contact, {});
});
test('rejects drafts, archived surveys and empty configuration', () => {
  for (const status of ['draft','archived']) assert.throws(() => run(body(), { ...survey, status }), e => e.status === 404);
  assert.throws(() => run(body(), survey, []), e => e.status === 409);
});
test('required text rejects whitespace, missing value and excessive length', () => {
  for (const value of ['', '   ', undefined, null, 1, 'x'.repeat(501)]) {
    const b = body(); b.answers.text = value;
    assert.throws(() => run(b));
  }
});
test('rejects options from other questions, duplicates and wrong shapes', () => {
  for (const [field, value] of [['one','b'],['one',['a']],['many',['a']],['many',['b','b']],['many','b'],['many',{}]]) {
    const b = body(); b.answers[field] = value;
    assert.throws(() => run(b));
  }
});
test('requires at least one checked option for a required multi-choice question', () => {
  const b = body(); b.answers.many = [];
  assert.throws(() => run(b, survey, questions.map(q => ({ ...q, required: true }))));
});
test('rejects unknown questions and malformed submissions', () => {
  assert.throws(() => run({ ...body(), answers: { ...body().answers, injected: 'x' } }));
  for (const b of [null, [], {}, {answers: []}, {answers: null}]) assert.throws(() => run(b));
});
test('validates configured contact fields and discards hidden fields', () => {
  const s = { ...survey, mode: 'contact', contact_email: 'required', contact_name: 'optional', contact_phone: 'hidden' };
  const b = body(); b.contact.phone = '123';
  assert.deepEqual(run(b, s).contact, { email: 'private@example.com', name: null });
  for (const email of ['', 'invalid', 123, 'x'.repeat(251)]) {
    b.contact.email = email; assert.throws(() => run(b, s));
  }
});
test('optional omitted answers and long text are supported', () => {
  const q = [{ id: 'long', type: 'long_text', title: 'Uwagi', required: false }];
  assert.equal(run({answers: {}}, survey, q, []).answers[0].value, '');
  assert.equal(run({answers: {long:'x'.repeat(10000)}}, survey, q, []).answers[0].value.length, 10000);
  assert.throws(() => run({answers: {long:'x'.repeat(10001)}}, survey, q, []));
});
