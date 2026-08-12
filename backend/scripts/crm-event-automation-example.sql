-- Safe draft example. Complete the GetResponse identifiers and future reminder
-- date in Directus before changing status to active.
INSERT INTO crm_event_automations (
  event,
  name,
  status,
  tag_name,
  workflow_name,
  timezone,
  notes
)
SELECT
  event.id,
  'Przypomnienie — ' || event.name,
  'draft',
  'Wydarzenie_OfficeTech_Day_Vol_2',
  'Przypomnienie — ' || event.name,
  'Europe/Warsaw',
  'Uzupełnij termin, ID workflow i ID lub dokładny temat wiadomości, a następnie ustaw status Aktywna.'
FROM events_create event
WHERE event.slug = 'officetech-day'
  AND NOT EXISTS (
    SELECT 1
    FROM crm_event_automations automation
    WHERE automation.event = event.id
      AND automation.tag_name = 'Wydarzenie_OfficeTech_Day_Vol_2'
  );
