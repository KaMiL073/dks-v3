BEGIN;
-- Keep the original IDs for analysis, and derive a readable, exportable answer.
CREATE OR REPLACE FUNCTION survey_answer_text(answer jsonb, labels jsonb, kind text)
RETURNS text LANGUAGE sql IMMUTABLE AS $$
 SELECT CASE WHEN kind IN ('single_choice','multiple_choice')
 THEN COALESCE((SELECT string_agg(label, '; ' ORDER BY ordinal)
   FROM jsonb_array_elements_text(labels) WITH ORDINALITY AS x(label,ordinal)), '')
 ELSE COALESCE(answer #>> '{}','') END
$$;
ALTER TABLE survey_answers ADD COLUMN IF NOT EXISTS answer_text text
 GENERATED ALWAYS AS (survey_answer_text(value,option_labels,question_type)) STORED;
INSERT INTO directus_fields (collection,field,interface,readonly,hidden,sort,width,translations)
SELECT 'survey_answers','answer_text','input-multiline',true,false,4,'full',
 '[{"language":"pl-PL","translation":"Odpowiedź"}]'::json
WHERE NOT EXISTS (SELECT 1 FROM directus_fields WHERE collection='survey_answers' AND field='answer_text');
UPDATE directus_fields SET hidden=true,translations='[{"language":"pl-PL","translation":"Wartość techniczna"}]'::json
WHERE collection='survey_answers' AND field='value';
UPDATE directus_fields SET hidden=true WHERE collection='survey_answers' AND field='option_labels';
UPDATE directus_fields SET interface='select-dropdown',display='labels',
 options='{"choices":[{"text":"Krótki tekst","value":"short_text"},{"text":"Długi tekst","value":"long_text"},{"text":"Jednokrotny wybór","value":"single_choice"},{"text":"Wielokrotny wybór","value":"multiple_choice"}]}'::json,
 display_options='{"choices":[{"text":"Krótki tekst","value":"short_text"},{"text":"Długi tekst","value":"long_text"},{"text":"Jednokrotny wybór","value":"single_choice"},{"text":"Wielokrotny wybór","value":"multiple_choice"}]}'::json
WHERE collection='survey_answers' AND field='question_type';
UPDATE directus_fields SET options=jsonb_set(COALESCE(options::jsonb,'{}'),'{template}','"{{question_title}}: {{answer_text}}"')::json
WHERE collection='survey_submissions' AND field='answers';
-- Refresh saved answer tables, including the user's current column selection.
UPDATE directus_presets SET layout='tabular',
 layout_query=jsonb_set(COALESCE(layout_query::jsonb,'{}'),'{tabular}',
 COALESCE(layout_query::jsonb->'tabular','{}') || '{"fields":["submission.survey.title","question_title","question_type","answer_text","submission.date_created"]}'::jsonb)::json,
 layout_options=jsonb_set(COALESCE(layout_options::jsonb,'{}'),'{tabular}',
 COALESCE(layout_options::jsonb->'tabular','{}') || '{"widths":{"submission.survey.title":240,"question_title":420,"question_type":200,"answer_text":360,"submission.date_created":200}}'::jsonb)::json
WHERE collection='survey_answers';
INSERT INTO directus_presets (collection,layout,layout_query,layout_options)
SELECT 'survey_answers','tabular',
 '{"tabular":{"fields":["submission.survey.title","question_title","question_type","answer_text","submission.date_created"],"limit":100}}'::json,
 '{"tabular":{"widths":{"submission.survey.title":240,"question_title":420,"question_type":200,"answer_text":360,"submission.date_created":200}}}'::json
WHERE NOT EXISTS (SELECT 1 FROM directus_presets WHERE collection='survey_answers' AND "user" IS NULL AND role IS NULL AND bookmark IS NULL);
COMMIT;
