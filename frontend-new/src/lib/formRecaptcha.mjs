/** @type {Record<string, string>} */
const FORM_ACTIONS = {
  ContactForm: "contact_form",
  ServiceCallForm: "ServiceCallForm",
  CountersForm: "CountersForm",
  ConsumablesOrderForm: "ConsumablesOrderForm",
  DebtCollectionForm: "DebtCollectionForm",
};

/**
 * @param {unknown} result
 * @param {string} formName
 * @param {string[]} allowedHosts
 * @returns {string | null}
 */
export function validateFormRecaptcha(result, formName, allowedHosts) {
  if (!result || typeof result !== "object") return "invalid_response";
  const data = /** @type {Record<string, unknown>} */ (result);
  if (data.success !== true) return "verification_failed";
  if (
    typeof data.score !== "number" ||
    !Number.isFinite(data.score) ||
    data.score < 0.5 ||
    data.score > 1
  ) return "low_or_missing_score";
  const expectedAction = Object.hasOwn(FORM_ACTIONS, formName)
    ? FORM_ACTIONS[formName]
    : undefined;
  if (!expectedAction || data.action !== expectedAction) return "action_mismatch";
  if (typeof data.hostname !== "string" || !allowedHosts.includes(data.hostname)) {
    return "hostname_mismatch";
  }
  return null;
}
