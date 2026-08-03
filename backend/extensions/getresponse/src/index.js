const DEFAULT_API_URL = 'https://api.getresponse.com/v3';
const REQUEST_TIMEOUT_MS = 10_000;

const normalize = (value) => (value ?? '').toString().trim();
const normalizeEmail = (value) => normalize(value).toLowerCase();

function hasMarketingConsent(value) {
  if (value === true || value === 1) return true;
  if (typeof value !== 'string') return false;

  return ['true', '1', 'yes', 'on'].includes(value.trim().toLowerCase());
}

function getContactData(payload) {
  const formData = payload?.form_data;
  const nested =
    formData && typeof formData === 'object' && !Array.isArray(formData)
      ? formData
      : {};

  return {
    email: normalizeEmail(payload?.email ?? nested.email),
    name: normalize(payload?.name ?? nested.name),
    consent: hasMarketingConsent(
      payload?.clause ?? payload?.consentMarketing ?? nested.clause ?? nested.consentMarketing
    ),
  };
}

function createGetResponseClient({ apiKey, listId, apiUrl = DEFAULT_API_URL, fetchImpl = fetch }) {
  const baseUrl = apiUrl.replace(/\/$/, '');
  const headers = {
    'X-Auth-Token': `api-key ${apiKey}`,
    'Content-Type': 'application/json',
  };

  async function request(path, options = {}) {
    const response = await fetchImpl(`${baseUrl}${path}`, {
      ...options,
      headers: { ...headers, ...options.headers },
      signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
    });

    if (!response.ok) {
      const details = await response.text();
      throw new Error(
        `GetResponse ${options.method ?? 'GET'} ${path} failed (${response.status}): ${details}`
      );
    }

    if (response.status === 204 || response.status === 202) return null;
    return response.json();
  }

  async function findContact(email) {
    const contacts = await request(
      `/contacts?query[email]=${encodeURIComponent(email)}`
    );

    if (!Array.isArray(contacts)) return null;

    return (
      contacts.find(
        (contact) =>
          normalizeEmail(contact?.email) === email &&
          contact?.campaign?.campaignId === listId
      ) ?? null
    );
  }

  async function upsertContact({ email, name }) {
    const contact = await findContact(email);

    if (contact?.contactId) {
      await request(`/contacts/${encodeURIComponent(contact.contactId)}`, {
        method: 'POST',
        body: JSON.stringify({ name }),
      });
      return 'updated';
    }

    await request('/contacts', {
      method: 'POST',
      body: JSON.stringify({
        email,
        name,
        campaign: { campaignId: listId },
      }),
    });
    return 'created';
  }

  return { upsertContact };
}

export { createGetResponseClient, getContactData, hasMarketingConsent };

export default ({ action }) => {
  action('contact_forms.items.create', async ({ payload }) => {
    const { email, name, consent } = getContactData(payload);

    if (!consent) {
      console.info('GetResponse: marketing consent not granted, skipping contact');
      return;
    }

    if (!email || !name) {
      console.warn('GetResponse: missing email or name, skipping contact');
      return;
    }

    const apiKey = normalize(process.env.GETRESPONSE_API_KEY);
    const listId = normalize(process.env.GETRESPONSE_LIST_ID);

    if (!apiKey || !listId) {
      console.error('GetResponse: missing GETRESPONSE_API_KEY or GETRESPONSE_LIST_ID');
      return;
    }

    try {
      const client = createGetResponseClient({
        apiKey,
        listId,
        apiUrl: normalize(process.env.GETRESPONSE_API_URL) || DEFAULT_API_URL,
      });
      const result = await client.upsertContact({ email, name });

      console.info(`GetResponse: contact ${result}`, { email });
    } catch (error) {
      console.error('GetResponse: contact synchronization failed', {
        email,
        message: error instanceof Error ? error.message : String(error),
      });
    }
  });
};
