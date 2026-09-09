import assert from "node:assert/strict";
import test from "node:test";
import { validateFormRecaptcha } from "../src/lib/formRecaptcha.mjs";

const valid = { success: true, score: 0.9, action: "contact_form", hostname: "www.dks.pl" };
const check = (data, form = "ContactForm") => validateFormRecaptcha(data, form, ["dks.pl", "www.dks.pl"]);

test("accepts valid tokens for each supported form", () => {
  for (const [form, action] of Object.entries({ ContactForm: "contact_form", ServiceCallForm: "ServiceCallForm", CountersForm: "CountersForm", ConsumablesOrderForm: "ConsumablesOrderForm", DebtCollectionForm: "DebtCollectionForm" })) {
    assert.equal(check({ ...valid, action, score: 0.5 }, form), null);
  }
});

test("success alone does not authorize a submission", () => {
  for (const score of [undefined, null, "0.9", 0.1, 0.49, NaN, Infinity, 1.1]) {
    assert.equal(check({ ...valid, score }), "low_or_missing_score");
  }
});

test("rejects tokens issued for another action or hostname", () => {
  assert.equal(check({ ...valid, action: "ServiceCallForm" }), "action_mismatch");
  assert.equal(check(valid, "UnknownForm"), "action_mismatch");
  assert.equal(check(valid, "toString"), "action_mismatch");
  for (const hostname of [undefined, "localhost", "dks.pl.attacker.test"]) {
    assert.equal(check({ ...valid, hostname }), "hostname_mismatch");
  }
});

test("rejects failed and malformed verification responses", () => {
  for (const data of [null, false, "ok", {}, { ...valid, success: false }]) {
    assert.notEqual(check(data), null);
  }
});
