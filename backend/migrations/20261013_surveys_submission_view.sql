BEGIN;
UPDATE directus_collections SET
 translations='[{"language":"pl-PL","translation":"Wypełnione ankiety"}]'::json,
 display_template='{{survey.title}} — {{date_created}}',
 note='Jeden wpis to jedno wypełnienie ankiety. Otwórz go, aby zobaczyć wszystkie odpowiedzi.'
WHERE collection='survey_submissions';
UPDATE directus_collections SET hidden=true WHERE collection='survey_answers';
UPDATE directus_fields SET sort=1 WHERE collection='survey_submissions' AND field='survey';
UPDATE directus_fields SET sort=2 WHERE collection='survey_submissions' AND field='date_created';
UPDATE directus_fields SET sort=3, interface='list-o2m',readonly=true,hidden=false,
 translations='[{"language":"pl-PL","translation":"Wszystkie odpowiedzi"}]'::json,
 options='{"layout":"table","fields":["question_title","answer_text"],"tableSpacing":"comfortable","limit":100,"sort":"question.sort","sortDirection":"+","enableCreate":false,"enableSelect":false,"enableLink":true}'::json
WHERE collection='survey_submissions' AND field='answers';
UPDATE directus_fields SET sort=4 WHERE collection='survey_submissions' AND field='name';
UPDATE directus_fields SET sort=5 WHERE collection='survey_submissions' AND field='email';
UPDATE directus_fields SET sort=6 WHERE collection='survey_submissions' AND field='phone';
UPDATE directus_fields SET sort=7 WHERE collection='survey_submissions' AND field='company';
UPDATE directus_fields SET readonly=true,
 translations='[{"language":"pl-PL","translation":"Wypełnione ankiety"}]'::json,
 options='{"layout":"table","fields":["date_created","name","email"],"tableSpacing":"comfortable","limit":25,"sort":"date_created","sortDirection":"-","enableCreate":false,"enableSelect":false,"enableLink":true}'::json
WHERE collection='surveys' AND field='submissions';
UPDATE directus_presets SET layout='tabular',
 layout_query=jsonb_set(COALESCE(layout_query::jsonb,'{}'),'{tabular}',
 COALESCE(layout_query::jsonb->'tabular','{}') || '{"fields":["survey.title","date_created","name","email"],"sort":["-date_created"]}'::jsonb)::json
WHERE collection='survey_submissions';
INSERT INTO directus_presets (collection,layout,layout_query,layout_options)
SELECT 'survey_submissions','tabular',
 '{"tabular":{"fields":["survey.title","date_created","name","email"],"sort":["-date_created"],"limit":100}}'::json,
 '{"tabular":{"widths":{"survey.title":400,"date_created":220,"name":240,"email":300}}}'::json
WHERE NOT EXISTS (SELECT 1 FROM directus_presets WHERE collection='survey_submissions' AND "user" IS NULL AND role IS NULL AND bookmark IS NULL);
COMMIT;
