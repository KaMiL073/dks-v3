-- Idempotent historical import into the CRM collections.
-- Run crm-backfill-report.sql first. Synchronization jobs are queued only for
-- contacts with an explicit marketing consent and are processed by the hook.
BEGIN;

WITH source_rows AS (
  SELECT
    lower(trim(email)) AS email,
    nullif(trim(name), '') AS name,
    NULL::text AS first_name,
    NULL::text AS last_name,
    nullif(trim(phone), '') AS phone,
    CASE WHEN json_typeof(form_data) = 'object'
      THEN nullif(trim(form_data->>'company'), '') END AS company,
    CASE WHEN json_typeof(form_data) = 'object'
      THEN nullif(trim(form_data->>'city'), '') END AS city,
    coalesce(nullif(trim(form_name), ''), 'ContactForm') AS source,
    coalesce(date_created, now()) AS occurred_at,
    (lower(coalesce(trim(clause), '')) IN ('true', '1', 'yes', 'on')) AS marketing_consent
  FROM contact_forms
  WHERE nullif(trim(email), '') IS NOT NULL

  UNION ALL

  SELECT
    lower(trim(email)) AS email,
    nullif(trim(concat_ws(' ', name, surname)), '') AS name,
    nullif(trim(name), '') AS first_name,
    nullif(trim(surname), '') AS last_name,
    nullif(trim(phone), '') AS phone,
    NULL::text AS company,
    nullif(trim(city), '') AS city,
    'EventRegistrationForm' AS source,
    coalesce(date_created, now()) AS occurred_at,
    (
      lower(coalesce(consent::text, '')) IN ('true', '"true"', '1', '"1"')
      OR coalesce(consent::text, '') ILIKE '%marketing%'
    ) AS marketing_consent
  FROM events
  WHERE nullif(trim(email), '') IS NOT NULL

  UNION ALL

  SELECT
    lower(trim(email)) AS email,
    nullif(trim(full_name), '') AS name,
    NULL::text AS first_name,
    NULL::text AS last_name,
    nullif(trim(phone), '') AS phone,
    NULL::text AS company,
    NULL::text AS city,
    'ComplaintForm' AS source,
    coalesce(date_created, now()) AS occurred_at,
    false AS marketing_consent
  FROM complaint
  WHERE nullif(trim(email), '') IS NOT NULL
), aggregated AS (
  SELECT
    email,
    (array_agg(name ORDER BY occurred_at DESC) FILTER (WHERE name IS NOT NULL))[1] AS name,
    (array_agg(first_name ORDER BY occurred_at DESC) FILTER (WHERE first_name IS NOT NULL))[1] AS first_name,
    (array_agg(last_name ORDER BY occurred_at DESC) FILTER (WHERE last_name IS NOT NULL))[1] AS last_name,
    (array_agg(phone ORDER BY occurred_at DESC) FILTER (WHERE phone IS NOT NULL))[1] AS phone,
    (array_agg(company ORDER BY occurred_at DESC) FILTER (WHERE company IS NOT NULL))[1] AS company,
    (array_agg(city ORDER BY occurred_at DESC) FILTER (WHERE city IS NOT NULL))[1] AS city,
    (array_agg(source ORDER BY occurred_at ASC))[1] AS first_source,
    (array_agg(source ORDER BY occurred_at DESC))[1] AS last_source,
    min(occurred_at) AS first_activity_at,
    max(occurred_at) AS last_activity_at,
    bool_or(marketing_consent) AS marketing_consent,
    min(occurred_at) FILTER (WHERE marketing_consent) AS first_consent_at
  FROM source_rows
  GROUP BY email
)
INSERT INTO crm_contacts (
  email, name, first_name, last_name, phone, company, city,
  marketing_consent_status, marketing_consent_at,
  first_source, last_source, first_activity_at, last_activity_at
)
SELECT
  email, name, first_name, last_name, phone, company, city,
  CASE WHEN marketing_consent THEN 'granted' ELSE 'not_granted' END,
  first_consent_at,
  first_source, last_source, first_activity_at, last_activity_at
FROM aggregated
ON CONFLICT (lower(email)) DO UPDATE SET
  name = coalesce(EXCLUDED.name, crm_contacts.name),
  first_name = coalesce(EXCLUDED.first_name, crm_contacts.first_name),
  last_name = coalesce(EXCLUDED.last_name, crm_contacts.last_name),
  phone = coalesce(EXCLUDED.phone, crm_contacts.phone),
  company = coalesce(EXCLUDED.company, crm_contacts.company),
  city = coalesce(EXCLUDED.city, crm_contacts.city),
  marketing_consent_status = CASE
    WHEN crm_contacts.marketing_consent_status = 'revoked' THEN 'revoked'
    WHEN EXCLUDED.marketing_consent_status = 'granted' THEN 'granted'
    ELSE crm_contacts.marketing_consent_status
  END,
  marketing_consent_at = coalesce(crm_contacts.marketing_consent_at, EXCLUDED.marketing_consent_at),
  first_source = coalesce(crm_contacts.first_source, EXCLUDED.first_source),
  last_source = EXCLUDED.last_source,
  first_activity_at = least(crm_contacts.first_activity_at, EXCLUDED.first_activity_at),
  last_activity_at = greatest(crm_contacts.last_activity_at, EXCLUDED.last_activity_at),
  date_updated = now();

UPDATE contact_forms form
SET crm_contact = contact.id
FROM crm_contacts contact
WHERE nullif(trim(form.email), '') IS NOT NULL
  AND lower(trim(form.email)) = lower(contact.email)
  AND form.crm_contact IS DISTINCT FROM contact.id;

WITH company_rows AS (
  SELECT
    regexp_replace(
      coalesce(nullif(trim(form.nip), ''), form.form_data->>'nip', ''),
      '[^0-9]', '', 'g'
    ) AS nip,
    coalesce(
      nullif(trim(form.form_data->>'company'), ''),
      nullif(trim(form.form_data->>'companyName'), ''),
      nullif(trim(form.form_data->>'company_name'), ''),
      CASE
        WHEN form.form_name = 'ContactForm'
          OR form.form_name = 'ServiceCallClientZone'
          OR form.form_name LIKE 'ServiceCallForm%'
        THEN coalesce(nullif(trim(form.name), ''), nullif(trim(form.form_data->>'name'), ''))
      END
    ) AS name,
    nullif(trim(form.form_data->>'city'), '') AS city,
    coalesce(nullif(trim(form.form_name), ''), 'ContactForm') AS source,
    coalesce(form.date_created, now()) AS occurred_at
  FROM contact_forms form
  WHERE json_typeof(form.form_data) = 'object'

  UNION ALL

  SELECT
    regexp_replace(coalesce(complaint.nip, ''), '[^0-9]', '', 'g') AS nip,
    nullif(trim(complaint.company_name), '') AS name,
    NULL::text AS city,
    'ComplaintForm' AS source,
    coalesce(complaint.date_created, now()) AS occurred_at
  FROM complaint
), aggregated AS (
  SELECT
    nip,
    (array_agg(name ORDER BY occurred_at DESC) FILTER (WHERE name IS NOT NULL))[1] AS name,
    (array_agg(city ORDER BY occurred_at DESC) FILTER (WHERE city IS NOT NULL))[1] AS city,
    (array_agg(source ORDER BY occurred_at ASC))[1] AS first_source,
    (array_agg(source ORDER BY occurred_at DESC))[1] AS last_source,
    min(occurred_at) AS first_activity_at,
    max(occurred_at) AS last_activity_at
  FROM company_rows
  WHERE nip ~ '^[0-9]{10}$'
  GROUP BY nip
)
INSERT INTO crm_companies (
  nip, name, city, first_source, last_source,
  first_activity_at, last_activity_at
)
SELECT
  nip, name, city, first_source, last_source,
  first_activity_at, last_activity_at
FROM aggregated
ON CONFLICT (nip) DO UPDATE SET
  name = coalesce(EXCLUDED.name, crm_companies.name),
  city = coalesce(EXCLUDED.city, crm_companies.city),
  first_source = coalesce(crm_companies.first_source, EXCLUDED.first_source),
  last_source = EXCLUDED.last_source,
  first_activity_at = CASE
    WHEN crm_companies.first_activity_at IS NULL THEN EXCLUDED.first_activity_at
    ELSE least(crm_companies.first_activity_at, EXCLUDED.first_activity_at)
  END,
  last_activity_at = CASE
    WHEN crm_companies.last_activity_at IS NULL THEN EXCLUDED.last_activity_at
    ELSE greatest(crm_companies.last_activity_at, EXCLUDED.last_activity_at)
  END,
  date_updated = now();

UPDATE contact_forms form
SET crm_company = company.id
FROM crm_companies company
WHERE regexp_replace(
    coalesce(nullif(trim(form.nip), ''), form.form_data->>'nip', ''),
    '[^0-9]', '', 'g'
  ) = company.nip
  AND form.crm_company IS DISTINCT FROM company.id;

UPDATE complaint item
SET crm_contact = contact.id
FROM crm_contacts contact
WHERE nullif(trim(item.email), '') IS NOT NULL
  AND lower(trim(item.email)) = lower(contact.email)
  AND item.crm_contact IS DISTINCT FROM contact.id;

UPDATE complaint item
SET crm_company = company.id
FROM crm_companies company
WHERE regexp_replace(coalesce(item.nip, ''), '[^0-9]', '', 'g') = company.nip
  AND item.crm_company IS DISTINCT FROM company.id;

INSERT INTO crm_contact_companies (
  contact, company, first_source, last_source,
  first_seen_at, last_seen_at
)
SELECT
  form.crm_contact,
  form.crm_company,
  (array_agg(coalesce(nullif(trim(form.form_name), ''), 'ContactForm')
    ORDER BY coalesce(form.date_created, now()) ASC))[1],
  (array_agg(coalesce(nullif(trim(form.form_name), ''), 'ContactForm')
    ORDER BY coalesce(form.date_created, now()) DESC))[1],
  min(coalesce(form.date_created, now())),
  max(coalesce(form.date_created, now()))
FROM contact_forms form
WHERE form.crm_contact IS NOT NULL AND form.crm_company IS NOT NULL
GROUP BY form.crm_contact, form.crm_company
ON CONFLICT (contact, company) DO UPDATE SET
  last_source = EXCLUDED.last_source,
  first_seen_at = least(crm_contact_companies.first_seen_at, EXCLUDED.first_seen_at),
  last_seen_at = greatest(crm_contact_companies.last_seen_at, EXCLUDED.last_seen_at),
  date_updated = now();

INSERT INTO crm_contact_companies (
  contact, company, first_source, last_source,
  first_seen_at, last_seen_at
)
SELECT
  item.crm_contact, item.crm_company,
  'ComplaintForm', 'ComplaintForm',
  min(coalesce(item.date_created, now())),
  max(coalesce(item.date_created, now()))
FROM complaint item
WHERE item.crm_contact IS NOT NULL AND item.crm_company IS NOT NULL
GROUP BY item.crm_contact, item.crm_company
ON CONFLICT (contact, company) DO UPDATE SET
  last_source = EXCLUDED.last_source,
  first_seen_at = least(crm_contact_companies.first_seen_at, EXCLUDED.first_seen_at),
  last_seen_at = greatest(crm_contact_companies.last_seen_at, EXCLUDED.last_seen_at),
  date_updated = now();

UPDATE events registration
SET crm_contact = contact.id
FROM crm_contacts contact
WHERE nullif(trim(registration.email), '') IS NOT NULL
  AND lower(trim(registration.email)) = lower(contact.email)
  AND registration.crm_contact IS DISTINCT FROM contact.id;

INSERT INTO crm_activities (
  contact, company, type, description, occurred_at, source_collection, source_item_id,
  form_name, dedupe_key, metadata
)
SELECT
  contact.id,
  form.crm_company,
  CASE
    WHEN form.form_name = 'ContactForm' THEN 'contact_form_submitted'
    WHEN form.form_name = 'CountersForm' THEN 'counters_form_submitted'
    WHEN form.form_name = 'DebtCollectionForm' THEN 'debt_collection_form_submitted'
    WHEN lower(coalesce(form.form_name, '')) LIKE '%service%' THEN 'service_form_submitted'
    ELSE 'form_submitted'
  END,
  CASE
    WHEN form.form_name = 'ContactForm' THEN 'Wysłano formularz kontaktowy'
    WHEN form.form_name = 'CountersForm' THEN 'Wysłano formularz liczników'
    WHEN form.form_name = 'DebtCollectionForm' THEN 'Wysłano formularz windykacji'
    WHEN lower(coalesce(form.form_name, '')) LIKE '%service%' THEN 'Wysłano formularz serwisowy'
    ELSE 'Wysłano formularz: ' || coalesce(form.form_name, 'inny')
  END,
  coalesce(form.date_created, now()),
  'contact_forms', form.id::text,
  coalesce(nullif(trim(form.form_name), ''), 'ContactForm'),
  'contact_forms:' || form.id::text || ':submitted',
  jsonb_build_object(
    'backfilled', true,
    'companyName', company.name,
    'nip', company.nip,
    'submittedData',
      coalesce(form.form_data::jsonb, '{}'::jsonb)
        - 'recaptchaToken' - 'recaptchaResponse' - '__sig',
    'nameRole', CASE
      WHEN form.form_name = 'ContactForm'
        OR form.form_name = 'ServiceCallClientZone'
        OR form.form_name LIKE 'ServiceCallForm%'
      THEN 'person_or_company'
      WHEN form.form_name IN ('ConsumablesOrderForm', 'CountersForm', 'DebtCollectionForm')
      THEN 'contact_person'
      ELSE 'person'
    END
  )
FROM contact_forms form
JOIN crm_contacts contact ON contact.id = form.crm_contact
LEFT JOIN crm_companies company ON company.id = form.crm_company
ON CONFLICT (dedupe_key) DO NOTHING;

INSERT INTO crm_activities (
  contact, company, type, description, occurred_at, source_collection,
  source_item_id, form_name, dedupe_key, metadata
)
SELECT
  item.crm_contact,
  item.crm_company,
  'complaint_submitted',
  'Wysłano reklamację dealerską',
  coalesce(item.date_created, now()),
  'complaint', item.id::text, 'ComplaintForm',
  'complaint:' || item.id::text || ':submitted',
  jsonb_build_object(
    'backfilled', true,
    'companyName', item.company_name,
    'nip', item.nip,
    'topic', coalesce(item.title, item.topics),
    'submittedData',
      to_jsonb(item)
        - ARRAY[
          'id', 'status', 'sort', 'user_created', 'date_created',
          'user_updated', 'date_updated', 'crm_contact', 'crm_company'
        ]::text[]
  )
FROM complaint item
WHERE item.crm_contact IS NOT NULL
ON CONFLICT (dedupe_key) DO NOTHING;

UPDATE crm_activities activity
SET company = item.crm_company
FROM complaint item
WHERE activity.source_collection = 'complaint'
  AND activity.source_item_id = item.id::text
  AND item.crm_company IS NOT NULL
  AND activity.company IS DISTINCT FROM item.crm_company;

UPDATE crm_activities activity
SET company = form.crm_company
FROM contact_forms form
WHERE activity.source_collection = 'contact_forms'
  AND activity.source_item_id = form.id::text
  AND form.crm_company IS NOT NULL
  AND activity.company IS DISTINCT FROM form.crm_company;

INSERT INTO crm_activities (
  contact, type, description, occurred_at, source_collection, source_item_id,
  form_name, event_slug, event_name, dedupe_key, metadata
)
SELECT
  contact.id, 'event_registered',
  'Zapis na wydarzenie: ' || coalesce(event_definition.name, split_part(registration.event, '#', 1)),
  coalesce(registration.date_created, now()),
  'events', registration.id::text, 'EventRegistrationForm',
  split_part(registration.event, '#', 1), event_definition.name,
  'events:' || registration.id::text || ':registered',
  jsonb_build_object(
    'backfilled', true,
    'submittedData', jsonb_strip_nulls(jsonb_build_object(
      'name', registration.name,
      'surname', registration.surname,
      'company', registration.company,
      'phone', registration.phone,
      'city', registration.city,
      'email', registration.email,
      'event', registration.event,
      'consent', registration.consent
    ))
  )
FROM events registration
JOIN crm_contacts contact ON contact.id = registration.crm_contact
LEFT JOIN events_create event_definition
  ON event_definition.slug = split_part(registration.event, '#', 1)
ON CONFLICT (dedupe_key) DO NOTHING;

INSERT INTO crm_consents (
  contact, status, occurred_at, source_collection, source_item_id,
  clause_text, clause_version, dedupe_key, metadata
)
SELECT
  contact.id,
  CASE WHEN lower(coalesce(trim(form.clause), '')) IN ('true', '1', 'yes', 'on')
    THEN 'granted' ELSE 'not_granted' END,
  coalesce(form.date_created, now()), 'contact_forms', form.id::text,
  NULL, 'historical',
  'contact_forms:' || form.id::text || ':marketing_consent',
  jsonb_build_object('backfilled', true, 'rawValue', form.clause)
FROM contact_forms form
JOIN crm_contacts contact ON contact.id = form.crm_contact
ON CONFLICT (dedupe_key) DO NOTHING;

INSERT INTO crm_consents (
  contact, status, occurred_at, source_collection, source_item_id,
  clause_text, clause_version, dedupe_key, metadata
)
SELECT
  contact.id,
  CASE WHEN (
    lower(coalesce(registration.consent::text, '')) IN ('true', '"true"', '1', '"1"')
    OR coalesce(registration.consent::text, '') ILIKE '%marketing%'
  ) THEN 'granted' ELSE 'not_granted' END,
  coalesce(registration.date_created, now()), 'events', registration.id::text,
  registration.consent::text, 'historical',
  'events:' || registration.id::text || ':marketing_consent',
  jsonb_build_object('backfilled', true)
FROM events registration
JOIN crm_contacts contact ON contact.id = registration.crm_contact
ON CONFLICT (dedupe_key) DO NOTHING;

WITH contact_tags AS (
  SELECT
    form.crm_contact AS contact,
    'Formularz_' || trim(BOTH '_' FROM regexp_replace(
      translate(coalesce(nullif(trim(form.form_name), ''), 'ContactForm'),
        'ąćęłńóśźżĄĆĘŁŃÓŚŹŻ', 'acelnoszzACELNOSZZ'),
      '[^A-Za-z0-9]+', '_', 'g'
    )) AS tag_name
  FROM contact_forms form
  WHERE form.crm_contact IS NOT NULL
    AND lower(coalesce(trim(form.clause), '')) IN ('true', '1', 'yes', 'on')

  UNION

  SELECT
    registration.crm_contact,
    'Wydarzenie_' || trim(BOTH '_' FROM regexp_replace(
      translate(coalesce(event_definition.name, split_part(registration.event, '#', 1)),
        'ąćęłńóśźżĄĆĘŁŃÓŚŹŻ', 'acelnoszzACELNOSZZ'),
      '[^A-Za-z0-9]+', '_', 'g'
    ))
  FROM events registration
  LEFT JOIN events_create event_definition
    ON event_definition.slug = split_part(registration.event, '#', 1)
  WHERE registration.crm_contact IS NOT NULL
    AND (
      lower(coalesce(registration.consent::text, '')) IN ('true', '"true"', '1', '"1"')
      OR coalesce(registration.consent::text, '') ILIKE '%marketing%'
    )
), aggregated_tags AS (
  SELECT contact, jsonb_agg(DISTINCT tag_name ORDER BY tag_name) AS tags
  FROM contact_tags
  WHERE nullif(tag_name, '') IS NOT NULL
  GROUP BY contact
)
INSERT INTO crm_sync_jobs (contact, operation, status, payload, dedupe_key)
SELECT
  contact.id, 'upsert_contact', 'pending',
  jsonb_build_object(
    'email', contact.email,
    'name', coalesce(contact.name, ''),
    'tagNames', coalesce(tags.tags, '[]'::jsonb) || '["Zrodlo_Strona_WWW"]'::jsonb
  ),
  'backfill:getresponse:' || contact.id::text
FROM crm_contacts contact
LEFT JOIN aggregated_tags tags ON tags.contact = contact.id
WHERE contact.marketing_consent_status = 'granted'
ON CONFLICT (dedupe_key) DO NOTHING;

COMMIT;
