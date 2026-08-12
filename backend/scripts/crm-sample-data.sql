-- Idempotent demo data for the Directus CRM collections.
-- Uses reserved example.com addresses and never creates pending sync jobs.
BEGIN;

INSERT INTO crm_contacts (
  id, email, name, first_name, last_name, phone, company, city,
  status, marketing_consent_status, marketing_consent_at,
  marketing_revoked_at, getresponse_contact_id, getresponse_list_id,
  first_source, last_source, first_activity_at, last_activity_at
)
VALUES
  (
    '00000000-0000-4000-8000-000000000101',
    'anna.demo@example.com', 'Anna Demonstracyjna', 'Anna', 'Demonstracyjna',
    '+48 500 100 101', 'Demo Print Sp. z o.o.', 'Gdańsk',
    'active', 'granted', '2026-07-10 08:15:00+00', NULL,
    'demo-getresponse-101', 'XXmfk',
    'ContactForm', 'EventRegistrationForm',
    '2026-07-10 08:15:00+00', '2026-08-01 10:30:00+00'
  ),
  (
    '00000000-0000-4000-8000-000000000102',
    'piotr.demo@example.com', 'Piotr Testowy', 'Piotr', 'Testowy',
    '+48 500 100 102', 'Biuro Demo S.A.', 'Warszawa',
    'active', 'not_granted', NULL, NULL,
    NULL, NULL,
    'ContactForm', 'ContactForm',
    '2026-07-15 12:00:00+00', '2026-07-15 12:00:00+00'
  ),
  (
    '00000000-0000-4000-8000-000000000103',
    'ewa.demo@example.com', 'Ewa Przykładowa', 'Ewa', 'Przykładowa',
    '+48 500 100 103', 'Studio Example', 'Poznań',
    'active', 'revoked', '2026-06-05 09:00:00+00',
    '2026-07-25 14:45:00+00', 'demo-getresponse-103', 'XXmfk',
    'ContactForm', 'GetResponse',
    '2026-06-05 09:00:00+00', '2026-07-25 14:45:00+00'
  )
ON CONFLICT (lower(email)) DO UPDATE SET
  name = EXCLUDED.name,
  first_name = EXCLUDED.first_name,
  last_name = EXCLUDED.last_name,
  phone = EXCLUDED.phone,
  company = EXCLUDED.company,
  city = EXCLUDED.city,
  status = EXCLUDED.status,
  marketing_consent_status = EXCLUDED.marketing_consent_status,
  marketing_consent_at = EXCLUDED.marketing_consent_at,
  marketing_revoked_at = EXCLUDED.marketing_revoked_at,
  getresponse_contact_id = EXCLUDED.getresponse_contact_id,
  getresponse_list_id = EXCLUDED.getresponse_list_id,
  first_source = EXCLUDED.first_source,
  last_source = EXCLUDED.last_source,
  first_activity_at = EXCLUDED.first_activity_at,
  last_activity_at = EXCLUDED.last_activity_at,
  date_updated = now();

INSERT INTO crm_companies (
  id, nip, name, city, status, first_source, last_source,
  first_activity_at, last_activity_at
)
VALUES
  (
    '00000000-0000-4000-9000-000000000201', '0000000101',
    'Demo Print Sp. z o.o.', 'Gdańsk', 'active',
    'ContactForm', 'ContactForm',
    '2026-07-10 08:15:00+00', '2026-07-10 08:15:00+00'
  ),
  (
    '00000000-0000-4000-9000-000000000202', '0000000102',
    'Biuro Demo S.A.', 'Warszawa', 'active',
    'ContactForm', 'ContactForm',
    '2026-07-15 12:00:00+00', '2026-07-15 12:00:00+00'
  ),
  (
    '00000000-0000-4000-9000-000000000203', '0000000103',
    'Studio Example', 'Poznań', 'active',
    'ContactForm', 'ContactForm',
    '2026-06-05 09:00:00+00', '2026-06-05 09:00:00+00'
  )
ON CONFLICT (nip) DO UPDATE SET
  name = EXCLUDED.name,
  city = EXCLUDED.city,
  last_source = EXCLUDED.last_source,
  last_activity_at = EXCLUDED.last_activity_at,
  date_updated = now();

INSERT INTO crm_contact_companies (
  contact, company, first_source, last_source, first_seen_at, last_seen_at
)
VALUES
  ('00000000-0000-4000-8000-000000000101', '00000000-0000-4000-9000-000000000201', 'ContactForm', 'ContactForm', '2026-07-10 08:15:00+00', '2026-07-10 08:15:00+00'),
  ('00000000-0000-4000-8000-000000000102', '00000000-0000-4000-9000-000000000202', 'ContactForm', 'ContactForm', '2026-07-15 12:00:00+00', '2026-07-15 12:00:00+00'),
  ('00000000-0000-4000-8000-000000000103', '00000000-0000-4000-9000-000000000203', 'ContactForm', 'ContactForm', '2026-06-05 09:00:00+00', '2026-06-05 09:00:00+00')
ON CONFLICT (contact, company) DO UPDATE SET
  last_source = EXCLUDED.last_source,
  last_seen_at = EXCLUDED.last_seen_at,
  date_updated = now();

INSERT INTO crm_activities (
  contact, type, description, status, occurred_at, source_collection, source_item_id,
  form_name, event_slug, event_name, dedupe_key, metadata
)
VALUES
  (
    '00000000-0000-4000-8000-000000000101',
    'contact_form_submitted', 'Wysłano formularz kontaktowy', 'completed', '2026-07-10 08:15:00+00',
    'contact_forms', 'demo-contact-form-101', 'ContactForm', NULL, NULL,
    'demo:anna:contact-form',
    '{"demo":true,"subject":"Zapytanie o urządzenie produkcyjne","companyName":"Demo Print Sp. z o.o.","nip":"0000000101","nameRole":"person_or_company","submittedData":{"name":"Anna Demonstracyjna","nip":"0000000101","email":"anna.demo@example.com","phone":"+48 500 100 101","province":"pomorskie","message":"Proszę o ofertę na urządzenie produkcyjne","consentData":true,"consentMarketing":true}}'::jsonb
  ),
  (
    '00000000-0000-4000-8000-000000000101',
    'getresponse_synced', 'Dodano kontakt do GetResponse', 'completed', '2026-07-10 08:16:00+00',
    'crm_sync_jobs', 'demo-sync-101', NULL, NULL, NULL,
    'demo:anna:getresponse-sync',
    '{"demo":true,"action":"created","listId":"XXmfk","listName":"Strona WWW","list":{"id":"XXmfk","name":"Strona WWW"},"tags":["Zrodlo_Strona_WWW","Formularz_ContactForm"],"sentData":{"email":"anna.demo@example.com","name":"Anna Demonstracyjna","listId":"XXmfk","listName":"Strona WWW","tags":[{"id":"demo-tag-source","name":"Zrodlo_Strona_WWW"},{"id":"demo-tag-form","name":"Formularz_ContactForm"}]},"getresponseContactId":"demo-getresponse-101"}'::jsonb
  ),
  (
    '00000000-0000-4000-8000-000000000101',
    'event_registered', 'Zapis na wydarzenie: OfficeTech Day Vol. 2', 'completed', '2026-08-01 10:30:00+00',
    'events', 'demo-event-101', 'EventRegistrationForm',
    'officetech-day', 'OfficeTech Day Vol. 2',
    'demo:anna:event-registration',
    '{"demo":true,"tag":"Wydarzenie_OfficeTech_Day_Vol_2","submittedData":{"name":"Anna","surname":"Demonstracyjna","email":"anna.demo@example.com","phone":"+48 500 100 101","city":"Gdańsk","event":"officetech-day","consent":["Zgoda na udział","Zgoda marketingowa"]}}'::jsonb
  ),
  (
    '00000000-0000-4000-8000-000000000102',
    'contact_form_submitted', 'Wysłano formularz kontaktowy', 'completed', '2026-07-15 12:00:00+00',
    'contact_forms', 'demo-contact-form-102', 'ContactForm', NULL, NULL,
    'demo:piotr:contact-form',
    '{"demo":true,"subject":"Zapytanie bez zgody marketingowej","companyName":"Biuro Demo S.A.","nip":"0000000102","nameRole":"person_or_company","submittedData":{"name":"Piotr Testowy","nip":"0000000102","email":"piotr.demo@example.com","phone":"+48 500 100 102","province":"mazowieckie","message":"Proszę o kontakt w sprawie serwisu","consentData":true,"consentMarketing":false}}'::jsonb
  ),
  (
    '00000000-0000-4000-8000-000000000103',
    'contact_form_submitted', 'Wysłano formularz kontaktowy', 'completed', '2026-06-05 09:00:00+00',
    'contact_forms', 'demo-contact-form-103', 'ContactForm', NULL, NULL,
    'demo:ewa:contact-form', '{"demo":true,"companyName":"Studio Example","nip":"0000000103","nameRole":"person_or_company","submittedData":{"name":"Ewa Przykładowa","nip":"0000000103","email":"ewa.demo@example.com","phone":"+48 500 100 103","province":"wielkopolskie","message":"Zapytanie o materiały eksploatacyjne","consentData":true,"consentMarketing":true}}'::jsonb
  ),
  (
    '00000000-0000-4000-8000-000000000103',
    'getresponse_message_opened', 'Otwarto wiadomość: Nowości DKS', 'completed', '2026-06-20 10:10:00+00',
    'getresponse_webhook', 'demo-webhook-open-103', NULL, NULL, NULL,
    'demo:ewa:message-opened',
    '{"demo":true,"message":{"subject":"Nowości DKS"}}'::jsonb
  ),
  (
    '00000000-0000-4000-8000-000000000103',
    'getresponse_link_clicked', 'Kliknięto link: Oferta DKS', 'completed', '2026-06-20 10:12:00+00',
    'getresponse_webhook', 'demo-webhook-click-103', NULL, NULL, NULL,
    'demo:ewa:link-clicked',
    '{"demo":true,"url":"https://www.dks.pl/oferta"}'::jsonb
  ),
  (
    '00000000-0000-4000-8000-000000000103',
    'getresponse_unsubscribed', 'Wypisano z listy GetResponse', 'completed', '2026-07-25 14:45:00+00',
    'getresponse_webhook', 'demo-webhook-unsubscribe-103', NULL, NULL, NULL,
    'demo:ewa:unsubscribed', '{"demo":true}'::jsonb
  )
ON CONFLICT (dedupe_key) DO UPDATE SET
  description = EXCLUDED.description,
  status = EXCLUDED.status,
  occurred_at = EXCLUDED.occurred_at,
  form_name = EXCLUDED.form_name,
  event_slug = EXCLUDED.event_slug,
  event_name = EXCLUDED.event_name,
  metadata = EXCLUDED.metadata;

UPDATE crm_activities SET company = CASE contact
  WHEN '00000000-0000-4000-8000-000000000101'::uuid
    THEN '00000000-0000-4000-9000-000000000201'::uuid
  WHEN '00000000-0000-4000-8000-000000000102'::uuid
    THEN '00000000-0000-4000-9000-000000000202'::uuid
  WHEN '00000000-0000-4000-8000-000000000103'::uuid
    THEN '00000000-0000-4000-9000-000000000203'::uuid
END
WHERE dedupe_key IN (
  'demo:anna:contact-form',
  'demo:piotr:contact-form',
  'demo:ewa:contact-form'
);

INSERT INTO crm_consents (
  contact, consent_type, status, occurred_at, source_collection,
  source_item_id, clause_text, clause_version, dedupe_key, metadata
)
VALUES
  (
    '00000000-0000-4000-8000-000000000101',
    'marketing', 'granted', '2026-07-10 08:15:00+00',
    'contact_forms', 'demo-contact-form-101',
    'Wyrażam zgodę na przetwarzanie danych w celach marketingowych.',
    'demo-v1', 'demo:anna:consent-granted', '{"demo":true}'::jsonb
  ),
  (
    '00000000-0000-4000-8000-000000000102',
    'marketing', 'not_granted', '2026-07-15 12:00:00+00',
    'contact_forms', 'demo-contact-form-102',
    'Wyrażam zgodę na przetwarzanie danych w celach marketingowych.',
    'demo-v1', 'demo:piotr:consent-not-granted', '{"demo":true}'::jsonb
  ),
  (
    '00000000-0000-4000-8000-000000000103',
    'marketing', 'granted', '2026-06-05 09:00:00+00',
    'contact_forms', 'demo-contact-form-103',
    'Wyrażam zgodę na przetwarzanie danych w celach marketingowych.',
    'demo-v1', 'demo:ewa:consent-granted', '{"demo":true}'::jsonb
  ),
  (
    '00000000-0000-4000-8000-000000000103',
    'marketing', 'revoked', '2026-07-25 14:45:00+00',
    'getresponse_webhook', 'demo-webhook-unsubscribe-103', NULL,
    'getresponse_unsubscribe', 'demo:ewa:consent-revoked',
    '{"demo":true}'::jsonb
  )
ON CONFLICT (dedupe_key) DO NOTHING;

INSERT INTO crm_sync_jobs (
  contact, operation, status, payload, attempts, max_attempts,
  available_at, started_at, completed_at, dedupe_key, date_updated
)
VALUES
  (
    '00000000-0000-4000-8000-000000000101',
    'upsert_contact', 'completed',
    '{"email":"anna.demo@example.com","name":"Anna Demonstracyjna","tagNames":["Zrodlo_Strona_WWW","Formularz_ContactForm","Wydarzenie_OfficeTech_Day_Vol_2"]}'::jsonb,
    1, 8, '2026-07-10 08:15:00+00', '2026-07-10 08:15:30+00',
    '2026-07-10 08:16:00+00', 'demo:anna:sync-job', now()
  )
ON CONFLICT (dedupe_key) DO NOTHING;

INSERT INTO crm_webhook_events (
  request_id, webhook_type, payload, status, received_at, processed_at
)
VALUES
  (
    'demo-webhook-unsubscribe-103:0', 'contact_removed_link',
    '{"type":"contact_removed_link","demo":true,"contact":{"contactId":"demo-getresponse-103","email":"ewa.demo@example.com"}}'::jsonb,
    'processed', '2026-07-25 14:45:00+00', '2026-07-25 14:45:01+00'
  )
ON CONFLICT (request_id) DO NOTHING;

COMMIT;
