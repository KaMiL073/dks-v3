// /home/kesmund/dks-v3/backend/extensions/form-data-create/dist/index.js
import crypto from 'crypto';

console.log('LOADED form-data-create (HMAC + mail routing) v2026-02-26');

// -------------------------------------
// Deterministyczny JSON (MUSI być identyczny jak w Next)
// -------------------------------------
function stableStringify(obj) {
  if (obj === null) return 'null';

  const t = typeof obj;

  if (t === 'string') return JSON.stringify(obj);
  if (t === 'number') return Number.isFinite(obj) ? String(obj) : 'null';
  if (t === 'boolean') return obj ? 'true' : 'false';

  if (t === 'undefined' || t === 'function' || t === 'symbol') return undefined;

  if (Array.isArray(obj)) {
    const items = obj
      .map((v) => {
        const s = stableStringify(v);
        return s === undefined ? 'null' : s;
      })
      .join(',');
    return `[${items}]`;
  }

  const keys = Object.keys(obj).sort();
  const props = [];

  for (const k of keys) {
    const v = stableStringify(obj[k]);
    if (v === undefined) continue;
    props.push(`${JSON.stringify(k)}:${v}`);
  }

  return `{${props.join(',')}}`;
}

// -------------------------------------
// HMAC verify
// -------------------------------------
function verifySig(payload) {
  const secret = process.env.FORMS_HMAC_SECRET;
  if (!secret) throw new Error('Missing FORMS_HMAC_SECRET');

  const sig = payload?.__sig;
  if (!sig) throw new Error('Missing __sig');

  const copy = { ...payload };
  delete copy.__sig;

  const body = stableStringify(copy);

  const expected = crypto.createHmac('sha256', secret).update(body).digest('hex');

  if (sig !== expected) {
    console.error('❌ Invalid __sig', {
      received: sig.slice(0, 12),
      expected: expected.slice(0, 12),
      len: body.length,
    });
    throw new Error('Invalid __sig');
  }

  console.log('✅ HMAC OK', { len: body.length, hash: sig.slice(0, 12) });
}

// -------------------------------------
// Helpers / config
// -------------------------------------
const normalize = (v) => (v ?? '').toString().trim();
const normalizeProvince = (v) => normalize(v).toLowerCase();
const normalizeEmail = (v) => normalize(v).toLowerCase();

const ALLOWED_FORM_NAMES = new Set([
  'ContactForm',
  'ServiceCallForm',
  'ServiceCallFormClientZone',
  'ServiceCallFormAlternative',
  'ServiceCallClientZone',
  'ConsumablesOrderForm',
  'CountersForm',
  'DebtCollectionForm',
]);

// Kanonizacja do template/routingu (jak wcześniej)
const canonicalFormTypeMap = {
  ServiceCallFormClientZone: 'ServiceCallForm',
  ServiceCallFormAlternative: 'ServiceCallForm',
  ServiceCallClientZone: 'ServiceCallForm',
  // wcześniej: ConsumablesOrderForm leciał jak ServiceCallForm
  ConsumablesOrderForm: 'ServiceCallForm',
};

// Mapy mailowe (działy)
const mailerMap = {
  ContactForm: {
    pomorskie: 'info.gdansk@dks.pl',
    mazowieckie: 'info.warszawa@dks.pl',
    slaskie: 'info.katowice@dks.pl',
    wielkopolskie: 'info.poznan@dks.pl',
    lodzkie: 'info.lodz@dks.pl',
    malopolskie: 'info.krakow@dks.pl',
    zachodniopomorskie: 'info.szczecin@dks.pl',
    'kujawsko-pomorskie': 'info.bydgoszcz@dks.pl',
    'warminsko-mazurskie': 'info.olsztyn@dks.pl',
    podkarpackie: 'info.rzeszow@dks.pl',
    podlaskie: 'info.bialystko@dks.pl',
    dolnoslaskie: 'info.wroclaw@dks.pl',
  },

  ServiceCallForm: {
    pomorskie: 'serwis.gdansk@dks.pl',
    mazowieckie: 'serwis.warszawa@dks.pl',
    slaskie: 'serwis.katowice@dks.pl',
    wielkopolskie: 'serwis.poznan@dks.pl',
    lodzkie: 'serwis.lodz@dks.pl',
    malopolskie: 'serwis.krakow@dks.pl',
    zachodniopomorskie: 'serwis.szczecin@dks.pl',
    'kujawsko-pomorskie': 'serwis.bydgoszcz@dks.pl',
    'warminsko-mazurskie': 'serwis.olsztyn@dks.pl',
    podkarpackie: 'serwis.rzeszow@dks.pl',
    podlaskie: 'serwis.bialystko@dks.pl',
    dolnoslaskie: 'serwis.wroclaw@dks.pl',
  },

  CountersForm: {
    pomorskie: 'liczniki.gdansk@dks.pl',
    mazowieckie: 'liczniki.warszawa@dks.pl',
    slaskie: 'liczniki.katowice@dks.pl',
    wielkopolskie: 'liczniki.poznan@dks.pl',
    lodzkie: 'liczniki.lodz@dks.pl',
    malopolskie: 'liczniki.krakow@dks.pl',
    zachodniopomorskie: 'liczniki.szczecin@dks.pl',
    'kujawsko-pomorskie': 'liczniki.bydgoszcz@dks.pl',
    'warminsko-mazurskie': 'liczniki.olsztyn@dks.pl',
    podkarpackie: 'liczniki.rzeszow@dks.pl',
    podlaskie: 'liczniki.bialystko@dks.pl',
    dolnoslaskie: 'liczniki.wroclaw@dks.pl',
  },

  DebtCollectionForm: {
    pomorskie: 'windykacja@dks.pl',
  },
};

const subjectMap = {
  ServiceCallForm: 'Zgłoszenie ze strony dks.pl',
  ContactForm: 'Wiadomość DKS',
  CountersForm: 'Liczniki ze strony dks.pl',
  DebtCollectionForm: 'Zgłoszenie z kontaktu',
};

const subjectClientMap = {
  ServiceCallForm: 'Zgłoszenie ze strony dks.pl',
  ContactForm: 'Wiadomość DKS',
  CountersForm: 'Liczniki DKS',
  DebtCollectionForm: 'DKS - Twoje zgłoszenie jest w trakcie realizacji',
};

function getOfficeEmail(formType, province) {
  const map = mailerMap[formType];
  if (!map) return null;
  return map[province] ?? null;
}

// -------------------------------------
// Extension
// -------------------------------------
export default ({ action }, { services }) => {
  const { MailService } = services;

  action('contact_forms.items.create', async ({ payload }, context) => {
    const { schema } = context;
    const mailService = new MailService({ schema });

    // 1) HMAC verify
    verifySig(payload);

    // usuń __sig zanim zapisze się do DB / poleci do maila
    delete payload.__sig;

    // 2) formType allow-list + canonicalizacja
    const rawFormType = normalize(payload?.form_name);
    if (!rawFormType) throw new Error('Missing form_name');

    if (!ALLOWED_FORM_NAMES.has(rawFormType)) {
      throw new Error(`Forbidden form_name: ${rawFormType}`);
    }

    const formType = canonicalFormTypeMap[rawFormType] ?? rawFormType;

    // 3) dane (province, email)
    const province = normalizeProvince(payload?.province ?? payload?.form_data?.province);
    const clientEmail = normalizeEmail(payload?.email ?? payload?.form_data?.email);

    if (!province) throw new Error('Missing province');
    if (!clientEmail) throw new Error('Missing email');

    const officeEmail = getOfficeEmail(formType, province);
    if (!officeEmail) {
      console.error('❌ No office email for', { formType, province, rawFormType });
      throw new Error(`No office email for ${formType}/${province}`);
    }

    // (opcjonalnie) ochrona: CountersForm nie może iść na info.*
    if (formType === 'CountersForm' && officeEmail.includes('info.')) {
      throw new Error(`Invalid routing CountersForm -> ${officeEmail}`);
    }

    console.log('📩 FORM ROUTE:', { rawFormType, formType, province, officeEmail, clientEmail });

    // 4) template data (jak wcześniej)
    const templateData = { data: payload?.form_data ?? payload };

    // 5) mail do działu
    await mailService.send({
      from: 'www@dks.pl',
      to: officeEmail,
      subject: subjectMap[formType] ?? 'Wiadomość ze strony dks.pl',
      template: {
        name: formType,
        data: templateData,
      },
    });

    // 6) mail do klienta
    await mailService.send({
      from: 'www@dks.pl',
      to: clientEmail,
      subject: subjectClientMap[formType] ?? 'DKS - potwierdzenie zgłoszenia',
      template: {
        name: `${formType}Client`,
        data: templateData,
      },
    });

    console.log('✅ Mails sent', { formType, officeEmail, clientEmail });

    return payload;
  });
};