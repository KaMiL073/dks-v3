-- Add readable list and sent-payload details to historical GetResponse sync events.
BEGIN;

UPDATE crm_activities activity
SET metadata = coalesce(activity.metadata, '{}'::jsonb) || jsonb_build_object(
  'listId', coalesce(activity.metadata->>'listId', contact.getresponse_list_id),
  'listName', 'Strona WWW',
  'list', jsonb_build_object(
    'id', coalesce(activity.metadata->>'listId', contact.getresponse_list_id),
    'name', 'Strona WWW'
  ),
  'sentData', jsonb_strip_nulls(jsonb_build_object(
    'email', job.payload->>'email',
    'name', job.payload->>'name',
    'listId', coalesce(activity.metadata->>'listId', contact.getresponse_list_id),
    'listName', 'Strona WWW',
    'tags', job.payload->'tagNames'
  ))
)
FROM crm_sync_jobs job
JOIN crm_contacts contact ON contact.id = job.contact
WHERE activity.dedupe_key IN (
    'getresponse_synced:' || job.id::text,
    'getresponse_sync_failed:' || job.id::text
  );

COMMIT;
