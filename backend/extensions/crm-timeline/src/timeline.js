const TYPE_PRESENTATION = {
  contact_form_submitted: { category: 'forms', icon: 'description' },
  service_form_submitted: { category: 'forms', icon: 'build' },
  counters_form_submitted: { category: 'forms', icon: 'speed' },
  debt_collection_form_submitted: { category: 'forms', icon: 'account_balance' },
  complaint_submitted: { category: 'forms', icon: 'report_problem' },
  form_submitted: { category: 'forms', icon: 'description' },
  event_registered: { category: 'events', icon: 'event_available' },
  getresponse_automation_enrolled: { category: 'getresponse', icon: 'automation' },
  getresponse_reminder_scheduled: { category: 'getresponse', icon: 'schedule_send' },
  getresponse_reminder_sent: { category: 'getresponse', icon: 'mark_email_read' },
  getresponse_reminder_failed: { category: 'error', icon: 'error_outline' },
  getresponse_automation_skipped: { category: 'warning', icon: 'person_off' },
  getresponse_synced: { category: 'getresponse', icon: 'sync' },
  getresponse_sync_failed: { category: 'error', icon: 'sync_problem' },
  getresponse_contact_added: { category: 'getresponse', icon: 'person_add' },
  getresponse_message_opened: { category: 'getresponse', icon: 'drafts' },
  getresponse_link_clicked: { category: 'getresponse', icon: 'link' },
  getresponse_sms_link_clicked: { category: 'getresponse', icon: 'sms' },
  getresponse_unsubscribed: { category: 'warning', icon: 'unsubscribe' },
  getresponse_bounce_removed: { category: 'warning', icon: 'mark_email_unread' },
  getresponse_email_changed: { category: 'getresponse', icon: 'alternate_email' },
  getresponse_contact_rejected: { category: 'error', icon: 'person_off' },
};

const FORM_NAMES = {
  ContactForm: 'Formularz kontaktowy',
  CountersForm: 'Formularz liczników',
  DebtCollectionForm: 'Formularz windykacji',
  ComplaintForm: 'Reklamacja dealerska',
  EventRegistrationForm: 'Formularz zapisu na wydarzenie',
  ServiceCallForm: 'Formularz serwisowy',
  ServiceCallFormClientZone: 'Formularz serwisowy — strefa klienta',
};

const FIELD_LABELS = {
  name: 'Imię i nazwisko / nazwa',
  full_name: 'Imię i nazwisko',
  surname: 'Nazwisko',
  email: 'E-mail',
  phone: 'Telefon',
  company: 'Firma',
  company_name: 'Nazwa firmy',
  nip: 'NIP',
  city: 'Miasto',
  province: 'Województwo',
  message: 'Wiadomość',
  type: 'Rodzaj zgłoszenia',
  model: 'Model urządzenia',
  device_model: 'Nazwa / model urządzenia',
  serialNumber: 'Numer seryjny',
  serial_number: 'Numer seryjny',
  monoCounter: 'Licznik monochromatyczny',
  colorCounter: 'Licznik kolorowy',
  tbcCounter: 'Licznik całkowity',
  counter: 'Licznik',
  cyjan: 'Toner cyan',
  cyjanQty: 'Ilość cyan',
  magenta: 'Toner magenta',
  magentaQty: 'Ilość magenta',
  yellow: 'Toner yellow',
  yellowQty: 'Ilość yellow',
  black: 'Toner czarny',
  blackQty: 'Ilość czarnego',
  clause: 'Zgoda marketingowa',
  clause_for_answers: 'Zgoda na odpowiedź',
  consentData: 'Zgoda na przetwarzanie danych',
  consentMarketing: 'Zgoda marketingowa',
  consent: 'Zgody',
  event: 'Wydarzenie',
  topics: 'Temat',
  title: 'Tytuł zgłoszenia',
  description: 'Opis problemu',
  Producent: 'Producent',
  producer: 'Producent',
  firmware_version: 'Wersja firmware',
  purchase_invoice_number: 'Numer faktury zakupu',
  installation_date: 'Data instalacji',
  issue_date: 'Data wystąpienia problemu',
  return_company: 'Firma odbierająca',
  return_full_name: 'Osoba odbierająca',
  return_phone: 'Telefon odbiorcy',
  return_address: 'Adres wysyłki zwrotnej',
  website: 'Strona WWW',
  files: 'Załączniki',
};

function parseMetadata(value) {
  if (!value) return {};
  if (typeof value === 'object' && !Array.isArray(value)) return value;

  try {
    const parsed = JSON.parse(value);
    return parsed && typeof parsed === 'object' && !Array.isArray(parsed)
      ? parsed
      : {};
  } catch {
    return {};
  }
}

function getPresentation(type) {
  return TYPE_PRESENTATION[type] ?? { category: 'other', icon: 'history' };
}

function getActivityFilter(type) {
  const category = getPresentation(type).category;
  if (category === 'forms') return 'forms';
  if (category === 'events') return 'events';
  if (['getresponse', 'warning', 'error'].includes(category)) {
    return 'getresponse';
  }
  return 'other';
}

function getActivityDetails(activity) {
  const metadata = parseMetadata(activity?.metadata);
  const details = [];
  const usedLabels = new Set();
  const pushDetail = (label, value) => {
    if (!label || value === null || value === undefined || value === '') return;
    if (usedLabels.has(label)) return;
    usedLabels.add(label);
    details.push({ label, value: formatSubmittedValue(value) });
  };
  const formName = FORM_NAMES[activity?.form_name] ?? activity?.form_name;
  const eventName = activity?.event_name ?? activity?.event_slug;
  const messageName = metadata?.message?.subject ?? metadata?.message?.name;
  const link =
    metadata?.clickTrack?.name ??
    metadata?.clickTrack?.url ??
    metadata?.url;
  const tags = Array.isArray(metadata?.tags) ? metadata.tags.join(', ') : null;
  const listId = metadata?.list?.id ?? metadata?.listId;
  const listName = metadata?.list?.name ?? metadata?.listName;
  const actionLabels = {
    created: 'Utworzono kontakt',
    updated: 'Zaktualizowano kontakt',
  };
  const automation = metadata?.automation ?? {};
  const automationName = metadata?.automationName ?? automation?.name;
  const workflowName = metadata?.workflowName ?? automation?.workflowName;
  const workflowId = metadata?.workflowId ?? automation?.workflowId;
  const reminderMessage = metadata?.messageSubject;

  if (eventName) pushDetail('Wydarzenie', eventName);
  if (formName && activity?.type !== 'event_registered') {
    pushDetail('Źródło', formName);
  }
  for (const detail of getSubmittedDataDetails(metadata?.submittedData)) {
    pushDetail(detail.label, detail.value);
  }
  if (metadata?.action) {
    pushDetail('Operacja GetResponse', actionLabels[metadata.action] ?? metadata.action);
  }
  if (listName || listId) {
    pushDetail(
      'Lista GetResponse',
      [listName, listId ? `ID: ${listId}` : null].filter(Boolean).join(' · ')
    );
  }
  for (const detail of getGetResponseSentDataDetails(metadata?.sentData)) {
    pushDetail(detail.label, detail.value);
  }
  if (metadata?.getresponseContactId) {
    pushDetail('ID kontaktu GetResponse', metadata.getresponseContactId);
  }
  if (automationName) pushDetail('Automatyzacja', automationName);
  if (workflowName || workflowId) {
    pushDetail(
      'Workflow GetResponse',
      [workflowName, workflowId ? `ID: ${workflowId}` : null]
        .filter(Boolean)
        .join(' · ')
    );
  }
  if (metadata?.tagName) pushDetail('Tag uruchamiający', metadata.tagName);
  if (metadata?.scheduledAt) {
    pushDetail('Termin przypomnienia', formatDateTime(metadata.scheduledAt));
  }
  if (reminderMessage && !messageName) {
    pushDetail('Wiadomość', reminderMessage);
  }
  if (messageName) pushDetail('Wiadomość', messageName);
  if (link) pushDetail('Link', link);
  if (tags && !metadata?.sentData) pushDetail('Tagi', tags);
  if (metadata?.companyName) {
    pushDetail('Firma', metadata.companyName);
  }
  if (metadata?.nip) pushDetail('NIP', metadata.nip);
  if (metadata?.topic) pushDetail('Temat', metadata.topic);
  if (metadata?.error) pushDetail('Błąd', metadata.error);

  return details;
}

function formatDateTime(value) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return String(value);
  return new Intl.DateTimeFormat('pl-PL', {
    dateStyle: 'medium',
    timeStyle: 'short',
    timeZone: 'Europe/Warsaw',
  }).format(date);
}

function getGetResponseSentDataDetails(value) {
  const data = parseMetadata(value);
  const details = [];
  if (data.email) details.push({ label: 'Wysłany e-mail', value: data.email });
  if (data.name) details.push({ label: 'Wysłana nazwa', value: data.name });

  if (Array.isArray(data.tags) && data.tags.length > 0) {
    const tags = data.tags.map((tag) => {
      if (typeof tag === 'string') return tag;
      if (!tag || typeof tag !== 'object') return String(tag);
      return [tag.name, tag.id ? `ID: ${tag.id}` : null]
        .filter(Boolean)
        .join(' · ');
    });
    details.push({ label: 'Wysłane tagi', value: tags.join('\n') });
  }

  return details;
}

function humanizeFieldName(field) {
  if (FIELD_LABELS[field]) return FIELD_LABELS[field];
  return field
    .replace(/([a-z0-9])([A-Z])/g, '$1 $2')
    .replace(/_/g, ' ')
    .replace(/^./, (letter) => letter.toLocaleUpperCase('pl-PL'));
}

function formatSubmittedValue(value) {
  if (value === true || value === 'true') return 'Tak';
  if (value === false || value === 'false') return 'Nie';
  if (Array.isArray(value)) {
    return value.map(formatSubmittedValue).filter(Boolean).join(' • ');
  }
  if (value && typeof value === 'object') {
    return Object.entries(value)
      .map(([key, nestedValue]) => `${humanizeFieldName(key)}: ${formatSubmittedValue(nestedValue)}`)
      .join(' • ');
  }
  return String(value);
}

function getSubmittedDataDetails(value) {
  const data = parseMetadata(value);
  return Object.entries(data).map(([field, fieldValue]) => ({
    label: humanizeFieldName(field),
    value: formatSubmittedValue(fieldValue),
  }));
}

function groupActivities(activities) {
  const formatter = new Intl.DateTimeFormat('pl-PL', {
    month: 'long',
    year: 'numeric',
  });
  const groups = [];

  for (const activity of activities) {
    const date = new Date(activity.occurred_at);
    const key = Number.isNaN(date.getTime())
      ? 'Brak daty'
      : formatter.format(date);
    const previous = groups[groups.length - 1];

    if (previous?.key === key) previous.activities.push(activity);
    else groups.push({ key, label: key.toLocaleUpperCase('pl-PL'), activities: [activity] });
  }

  return groups;
}

function mergeCompanyAndRelatedActivities(companyActivities, relatedActivities) {
  const merged = new Map();

  for (const activity of companyActivities ?? []) {
    merged.set(activity.id, { ...activity, timeline_scope: 'company' });
  }

  for (const activity of relatedActivities ?? []) {
    if (merged.has(activity.id)) continue;
    merged.set(activity.id, { ...activity, timeline_scope: 'related_contact' });
  }

  return [...merged.values()].sort((left, right) => {
    const leftTime = new Date(left.occurred_at).getTime() || 0;
    const rightTime = new Date(right.occurred_at).getTime() || 0;
    return rightTime - leftTime;
  });
}

export {
  getActivityDetails,
  getActivityFilter,
  getPresentation,
  groupActivities,
  getSubmittedDataDetails,
  getGetResponseSentDataDetails,
  formatSubmittedValue,
  parseMetadata,
  mergeCompanyAndRelatedActivities,
  formatDateTime,
};
