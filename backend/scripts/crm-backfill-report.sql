-- Read-only preview. Run this before crm-backfill.sql.
WITH source_rows AS (
  SELECT
    lower(trim(email)) AS email,
    'contact_forms'::text AS source_collection,
    (lower(coalesce(trim(clause), '')) IN ('true', '1', 'yes', 'on')) AS marketing_consent
  FROM contact_forms
  WHERE nullif(trim(email), '') IS NOT NULL

  UNION ALL

  SELECT
    lower(trim(email)) AS email,
    'events'::text AS source_collection,
    (
      lower(coalesce(consent::text, '')) IN ('true', '"true"', '1', '"1"')
      OR coalesce(consent::text, '') ILIKE '%marketing%'
    ) AS marketing_consent
  FROM events
  WHERE nullif(trim(email), '') IS NOT NULL

  UNION ALL

  SELECT
    lower(trim(email)) AS email,
    'complaint'::text AS source_collection,
    false AS marketing_consent
  FROM complaint
  WHERE nullif(trim(email), '') IS NOT NULL
)
SELECT metric, value
FROM (
  SELECT 1 AS sort, 'Unikalne kontakty' AS metric, count(DISTINCT email)::bigint AS value
  FROM source_rows
  UNION ALL
  SELECT 2, 'Aktywności formularzy, reklamacji i wydarzeń', count(*)::bigint
  FROM source_rows
  UNION ALL
  SELECT 3, 'Wpisy historii zgód', count(*) FILTER (
    WHERE source_collection <> 'complaint'
  )::bigint
  FROM source_rows
  UNION ALL
  SELECT 4, 'Kontakty ze zgodą do synchronizacji', count(*)::bigint
  FROM (
    SELECT email FROM source_rows GROUP BY email HAVING bool_or(marketing_consent)
  ) consenting
  UNION ALL
  SELECT 5, 'Rekordy bez poprawnego e-maila',
    ((SELECT count(*) FROM contact_forms WHERE nullif(trim(email), '') IS NULL)
      + (SELECT count(*) FROM events WHERE nullif(trim(email), '') IS NULL)
      + (SELECT count(*) FROM complaint WHERE nullif(trim(email), '') IS NULL))::bigint
  UNION ALL
  SELECT 6, 'Unikalne firmy z poprawnym formatem NIP', count(DISTINCT nip)::bigint
  FROM (
    SELECT regexp_replace(
      coalesce(nullif(trim(nip), ''), form_data->>'nip', ''),
      '[^0-9]', '', 'g'
    ) AS nip
    FROM contact_forms
    UNION ALL
    SELECT regexp_replace(coalesce(nip, ''), '[^0-9]', '', 'g')
    FROM complaint
  ) companies
  WHERE nip ~ '^[0-9]{10}$'
  UNION ALL
  SELECT 7, 'Formularze bez poprawnego formatu NIP', count(*)::bigint
  FROM (
    SELECT regexp_replace(
      coalesce(nullif(trim(nip), ''), form_data->>'nip', ''),
      '[^0-9]', '', 'g'
    ) AS nip FROM contact_forms
    UNION ALL
    SELECT regexp_replace(coalesce(nip, ''), '[^0-9]', '', 'g')
    FROM complaint
  ) business_forms
  WHERE nip !~ '^[0-9]{10}$'
) report
ORDER BY sort;
