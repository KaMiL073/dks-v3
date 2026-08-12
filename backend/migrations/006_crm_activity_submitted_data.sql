-- Enrich existing CRM activities with user-submitted source data.
-- This migration does not create GetResponse synchronization jobs.
BEGIN;

UPDATE crm_activities activity
SET metadata = coalesce(activity.metadata, '{}'::jsonb) || jsonb_build_object(
  'submittedData',
  coalesce(form.form_data::jsonb, '{}'::jsonb)
    - 'recaptchaToken' - 'recaptchaResponse' - 'recaptcha' - '__sig'
)
FROM contact_forms form
WHERE activity.source_collection = 'contact_forms'
  AND activity.source_item_id = form.id::text;

UPDATE crm_activities activity
SET metadata = coalesce(activity.metadata, '{}'::jsonb) || jsonb_build_object(
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
WHERE activity.source_collection = 'events'
  AND activity.source_item_id = registration.id::text;

UPDATE crm_activities activity
SET metadata = coalesce(activity.metadata, '{}'::jsonb) || jsonb_build_object(
  'submittedData',
  to_jsonb(item)
    - ARRAY[
      'id', 'status', 'sort', 'user_created', 'date_created',
      'user_updated', 'date_updated', 'crm_contact', 'crm_company'
    ]::text[]
)
FROM complaint item
WHERE activity.source_collection = 'complaint'
  AND activity.source_item_id = item.id::text;

COMMIT;
