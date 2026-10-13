BEGIN;
CREATE TABLE IF NOT EXISTS surveys (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(), title varchar(250) NOT NULL,
 slug varchar(160) NOT NULL UNIQUE CHECK (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
 description text, status varchar(20) NOT NULL DEFAULT 'draft' CHECK (status IN ('draft','published','archived')),
 mode varchar(20) NOT NULL DEFAULT 'anonymous' CHECK (mode IN ('anonymous','contact')),
 contact_name varchar(20) NOT NULL DEFAULT 'optional' CHECK (contact_name IN ('hidden','optional','required')),
 contact_email varchar(20) NOT NULL DEFAULT 'required' CHECK (contact_email IN ('hidden','optional','required')),
 contact_phone varchar(20) NOT NULL DEFAULT 'hidden' CHECK (contact_phone IN ('hidden','optional','required')),
 contact_company varchar(20) NOT NULL DEFAULT 'hidden' CHECK (contact_company IN ('hidden','optional','required')),
 privacy_notice text, success_message text NOT NULL DEFAULT 'Dziękujemy za wypełnienie ankiety.',
 date_created timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE IF NOT EXISTS survey_questions (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(), survey uuid NOT NULL REFERENCES surveys(id) ON DELETE CASCADE,
 sort integer NOT NULL DEFAULT 0, title varchar(1000) NOT NULL, description text,
 type varchar(30) NOT NULL CHECK (type IN ('short_text','long_text','single_choice','multiple_choice')),
 required boolean NOT NULL DEFAULT false
);
CREATE TABLE IF NOT EXISTS survey_options (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(), question uuid NOT NULL REFERENCES survey_questions(id) ON DELETE CASCADE,
 sort integer NOT NULL DEFAULT 0, label varchar(500) NOT NULL
);
CREATE TABLE IF NOT EXISTS survey_submissions (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(), survey uuid NOT NULL REFERENCES surveys(id) ON DELETE RESTRICT,
 date_created timestamptz NOT NULL DEFAULT now(), name varchar(250), email varchar(250), phone varchar(250), company varchar(250)
);
CREATE TABLE IF NOT EXISTS survey_answers (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(), submission uuid NOT NULL REFERENCES survey_submissions(id) ON DELETE CASCADE,
 question uuid NOT NULL REFERENCES survey_questions(id) ON DELETE RESTRICT,
 question_title text NOT NULL, question_type varchar(30) NOT NULL, value jsonb NOT NULL, option_labels jsonb NOT NULL DEFAULT '[]',
 UNIQUE(submission, question)
);
-- Short-lived HMAC keys for abuse prevention; no link to submissions, no raw IP.
CREATE TABLE IF NOT EXISTS survey_rate_limits (key varchar(64) NOT NULL, bucket bigint NOT NULL, attempts integer NOT NULL, PRIMARY KEY(key,bucket));
-- Drafts can be deleted together with their questions/options. The triggers below
-- prevent deleting any structure while the survey has submitted responses.
ALTER TABLE survey_questions DROP CONSTRAINT IF EXISTS survey_questions_survey_fkey;
ALTER TABLE survey_questions ADD CONSTRAINT survey_questions_survey_fkey FOREIGN KEY (survey) REFERENCES surveys(id) ON DELETE CASCADE;
ALTER TABLE survey_options DROP CONSTRAINT IF EXISTS survey_options_question_fkey;
ALTER TABLE survey_options ADD CONSTRAINT survey_options_question_fkey FOREIGN KEY (question) REFERENCES survey_questions(id) ON DELETE CASCADE;
CREATE INDEX IF NOT EXISTS survey_questions_parent ON survey_questions(survey,sort);
CREATE INDEX IF NOT EXISTS survey_options_parent ON survey_options(question,sort);
CREATE INDEX IF NOT EXISTS survey_submissions_parent ON survey_submissions(survey,date_created);

INSERT INTO directus_collections (collection,icon,note,hidden,singleton,translations) SELECT 'surveys','quiz','Twórz ankiety i publikuj je pod /ankiety/{slug}.',false,false,'[{"language": "pl-PL", "translation": "Ankiety"}]'::json WHERE NOT EXISTS (SELECT 1 FROM directus_collections WHERE collection='surveys');
INSERT INTO directus_collections (collection,icon,note,hidden,singleton,translations) SELECT 'survey_questions','help','Pytania i ich kolejność.',false,false,'[{"language": "pl-PL", "translation": "Pytania ankiet"}]'::json WHERE NOT EXISTS (SELECT 1 FROM directus_collections WHERE collection='survey_questions');
INSERT INTO directus_collections (collection,icon,note,hidden,singleton,translations) SELECT 'survey_options','checklist','Opcje pytań zamkniętych.',false,false,'[{"language": "pl-PL", "translation": "Opcje odpowiedzi"}]'::json WHERE NOT EXISTS (SELECT 1 FROM directus_collections WHERE collection='survey_options');
INSERT INTO directus_collections (collection,icon,note,hidden,singleton,translations) SELECT 'survey_submissions','inbox','Wyniki ankiet. Eksportuj zgłoszenia wraz z relacją odpowiedzi.',false,false,'[{"language": "pl-PL", "translation": "Zgłoszenia ankiet"}]'::json WHERE NOT EXISTS (SELECT 1 FROM directus_collections WHERE collection='survey_submissions');
INSERT INTO directus_collections (collection,icon,note,hidden,singleton,translations) SELECT 'survey_answers','question_answer','Odpowiedzi z zachowanym tekstem pytania i etykietami opcji.',false,false,'[{"language": "pl-PL", "translation": "Odpowiedzi ankiet"}]'::json WHERE NOT EXISTS (SELECT 1 FROM directus_collections WHERE collection='survey_answers');
INSERT INTO directus_fields (collection,field,special,interface,options,readonly,hidden,sort,width,required,note,translations) SELECT 'surveys','id','uuid','input',NULL,true,true,1,'full',false,NULL,'[{"language": "pl-PL", "translation": "ID"}]'::json WHERE NOT EXISTS (SELECT 1 FROM directus_fields WHERE collection='surveys' AND field='id');
INSERT INTO directus_fields (collection,field,special,interface,options,readonly,hidden,sort,width,required,note,translations) SELECT 'survey_questions','id','uuid','input',NULL,true,true,1,'full',false,NULL,'[{"language": "pl-PL", "translation": "ID"}]'::json WHERE NOT EXISTS (SELECT 1 FROM directus_fields WHERE collection='survey_questions' AND field='id');
INSERT INTO directus_fields (collection,field,special,interface,options,readonly,hidden,sort,width,required,note,translations) SELECT 'survey_options','id','uuid','input',NULL,true,true,1,'full',false,NULL,'[{"language": "pl-PL", "translation": "ID"}]'::json WHERE NOT EXISTS (SELECT 1 FROM directus_fields WHERE collection='survey_options' AND field='id');
INSERT INTO directus_fields (collection,field,special,interface,options,readonly,hidden,sort,width,required,note,translations) SELECT 'survey_submissions','id','uuid','input',NULL,true,true,1,'full',false,NULL,'[{"language": "pl-PL", "translation": "ID"}]'::json WHERE NOT EXISTS (SELECT 1 FROM directus_fields WHERE collection='survey_submissions' AND field='id');
INSERT INTO directus_fields (collection,field,special,interface,options,readonly,hidden,sort,width,required,note,translations) SELECT 'survey_answers','id','uuid','input',NULL,true,true,1,'full',false,NULL,'[{"language": "pl-PL", "translation": "ID"}]'::json WHERE NOT EXISTS (SELECT 1 FROM directus_fields WHERE collection='survey_answers' AND field='id');
INSERT INTO directus_fields (collection,field,special,interface,options,readonly,hidden,sort,width,required,note,translations) SELECT 'surveys','title',NULL,'input',NULL,false,false,2,'full',true,NULL,'[{"language": "pl-PL", "translation": "Tytuł"}]'::json WHERE NOT EXISTS (SELECT 1 FROM directus_fields WHERE collection='surveys' AND field='title');
INSERT INTO directus_fields (collection,field,special,interface,options,readonly,hidden,sort,width,required,note,translations) SELECT 'surveys','slug',NULL,'input',NULL,false,false,3,'full',true,'Małe litery, cyfry i myślniki. Adres: /ankiety/{slug}.','[{"language": "pl-PL", "translation": "Slug"}]'::json WHERE NOT EXISTS (SELECT 1 FROM directus_fields WHERE collection='surveys' AND field='slug');
INSERT INTO directus_fields (collection,field,special,interface,options,readonly,hidden,sort,width,required,note,translations) SELECT 'surveys','description',NULL,'input-multiline',NULL,false,false,4,'full',false,NULL,'[{"language": "pl-PL", "translation": "Opis"}]'::json WHERE NOT EXISTS (SELECT 1 FROM directus_fields WHERE collection='surveys' AND field='description');
INSERT INTO directus_fields (collection,field,special,interface,options,readonly,hidden,sort,width,required,note,translations) SELECT 'surveys','status',NULL,'select-dropdown','{"choices": [{"text": "Robocza", "value": "draft"}, {"text": "Opublikowana", "value": "published"}, {"text": "Archiwalna", "value": "archived"}]}'::json,false,false,5,'full',false,NULL,'[{"language": "pl-PL", "translation": "Status"}]'::json WHERE NOT EXISTS (SELECT 1 FROM directus_fields WHERE collection='surveys' AND field='status');
INSERT INTO directus_fields (collection,field,special,interface,options,readonly,hidden,sort,width,required,note,translations) SELECT 'surveys','mode',NULL,'select-dropdown','{"choices": [{"text": "Anonimowa", "value": "anonymous"}, {"text": "Z danymi kontaktowymi", "value": "contact"}]}'::json,false,false,6,'full',false,NULL,'[{"language": "pl-PL", "translation": "Tryb ankiety"}]'::json WHERE NOT EXISTS (SELECT 1 FROM directus_fields WHERE collection='surveys' AND field='mode');
INSERT INTO directus_fields (collection,field,special,interface,options,readonly,hidden,sort,width,required,note,translations) SELECT 'surveys','contact_name',NULL,'select-dropdown','{"choices": [{"text": "Ukryte", "value": "hidden"}, {"text": "Opcjonalne", "value": "optional"}, {"text": "Wymagane", "value": "required"}]}'::json,false,false,7,'full',false,'Dotyczy tylko ankiet z danymi kontaktowymi.','[{"language": "pl-PL", "translation": "Imię i nazwisko"}]'::json WHERE NOT EXISTS (SELECT 1 FROM directus_fields WHERE collection='surveys' AND field='contact_name');
INSERT INTO directus_fields (collection,field,special,interface,options,readonly,hidden,sort,width,required,note,translations) SELECT 'surveys','contact_email',NULL,'select-dropdown','{"choices": [{"text": "Ukryte", "value": "hidden"}, {"text": "Opcjonalne", "value": "optional"}, {"text": "Wymagane", "value": "required"}]}'::json,false,false,8,'full',false,'Dotyczy tylko ankiet z danymi kontaktowymi.','[{"language": "pl-PL", "translation": "E-mail"}]'::json WHERE NOT EXISTS (SELECT 1 FROM directus_fields WHERE collection='surveys' AND field='contact_email');
INSERT INTO directus_fields (collection,field,special,interface,options,readonly,hidden,sort,width,required,note,translations) SELECT 'surveys','contact_phone',NULL,'select-dropdown','{"choices": [{"text": "Ukryte", "value": "hidden"}, {"text": "Opcjonalne", "value": "optional"}, {"text": "Wymagane", "value": "required"}]}'::json,false,false,9,'full',false,'Dotyczy tylko ankiet z danymi kontaktowymi.','[{"language": "pl-PL", "translation": "Telefon"}]'::json WHERE NOT EXISTS (SELECT 1 FROM directus_fields WHERE collection='surveys' AND field='contact_phone');
INSERT INTO directus_fields (collection,field,special,interface,options,readonly,hidden,sort,width,required,note,translations) SELECT 'surveys','contact_company',NULL,'select-dropdown','{"choices": [{"text": "Ukryte", "value": "hidden"}, {"text": "Opcjonalne", "value": "optional"}, {"text": "Wymagane", "value": "required"}]}'::json,false,false,10,'full',false,'Dotyczy tylko ankiet z danymi kontaktowymi.','[{"language": "pl-PL", "translation": "Firma"}]'::json WHERE NOT EXISTS (SELECT 1 FROM directus_fields WHERE collection='surveys' AND field='contact_company');
INSERT INTO directus_fields (collection,field,special,interface,options,readonly,hidden,sort,width,required,note,translations) SELECT 'surveys','privacy_notice',NULL,'input-multiline',NULL,false,false,11,'full',false,NULL,'[{"language": "pl-PL", "translation": "Informacja o przetwarzaniu danych"}]'::json WHERE NOT EXISTS (SELECT 1 FROM directus_fields WHERE collection='surveys' AND field='privacy_notice');
INSERT INTO directus_fields (collection,field,special,interface,options,readonly,hidden,sort,width,required,note,translations) SELECT 'surveys','success_message',NULL,'input-multiline',NULL,false,false,12,'full',true,NULL,'[{"language": "pl-PL", "translation": "Komunikat po wysłaniu"}]'::json WHERE NOT EXISTS (SELECT 1 FROM directus_fields WHERE collection='surveys' AND field='success_message');
INSERT INTO directus_fields (collection,field,special,interface,options,readonly,hidden,sort,width,required,note,translations) SELECT 'surveys','date_created','date-created','datetime',NULL,true,false,13,'full',false,NULL,'[{"language": "pl-PL", "translation": "Utworzono"}]'::json WHERE NOT EXISTS (SELECT 1 FROM directus_fields WHERE collection='surveys' AND field='date_created');
INSERT INTO directus_fields (collection,field,special,interface,options,readonly,hidden,sort,width,required,note,translations) SELECT 'survey_questions','sort',NULL,'input',NULL,false,true,2,'full',false,NULL,'[{"language": "pl-PL", "translation": "Kolejność"}]'::json WHERE NOT EXISTS (SELECT 1 FROM directus_fields WHERE collection='survey_questions' AND field='sort');
INSERT INTO directus_fields (collection,field,special,interface,options,readonly,hidden,sort,width,required,note,translations) SELECT 'survey_questions','title',NULL,'input',NULL,false,false,3,'full',true,NULL,'[{"language": "pl-PL", "translation": "Treść pytania"}]'::json WHERE NOT EXISTS (SELECT 1 FROM directus_fields WHERE collection='survey_questions' AND field='title');
INSERT INTO directus_fields (collection,field,special,interface,options,readonly,hidden,sort,width,required,note,translations) SELECT 'survey_questions','description',NULL,'input-multiline',NULL,false,false,4,'full',false,NULL,'[{"language": "pl-PL", "translation": "Podpowiedź"}]'::json WHERE NOT EXISTS (SELECT 1 FROM directus_fields WHERE collection='survey_questions' AND field='description');
INSERT INTO directus_fields (collection,field,special,interface,options,readonly,hidden,sort,width,required,note,translations) SELECT 'survey_questions','type',NULL,'select-dropdown','{"choices": [{"text": "Krótki tekst", "value": "short_text"}, {"text": "Długi tekst", "value": "long_text"}, {"text": "Jednokrotny wybór", "value": "single_choice"}, {"text": "Wielokrotny wybór", "value": "multiple_choice"}]}'::json,false,false,5,'full',true,NULL,'[{"language": "pl-PL", "translation": "Typ pytania"}]'::json WHERE NOT EXISTS (SELECT 1 FROM directus_fields WHERE collection='survey_questions' AND field='type');
INSERT INTO directus_fields (collection,field,special,interface,options,readonly,hidden,sort,width,required,note,translations) SELECT 'survey_questions','required','cast-boolean','boolean',NULL,false,false,6,'full',false,NULL,'[{"language": "pl-PL", "translation": "Wymagane"}]'::json WHERE NOT EXISTS (SELECT 1 FROM directus_fields WHERE collection='survey_questions' AND field='required');
INSERT INTO directus_fields (collection,field,special,interface,options,readonly,hidden,sort,width,required,note,translations) SELECT 'survey_options','sort',NULL,'input',NULL,false,true,2,'full',false,NULL,'[{"language": "pl-PL", "translation": "Kolejność"}]'::json WHERE NOT EXISTS (SELECT 1 FROM directus_fields WHERE collection='survey_options' AND field='sort');
INSERT INTO directus_fields (collection,field,special,interface,options,readonly,hidden,sort,width,required,note,translations) SELECT 'survey_options','label',NULL,'input',NULL,false,false,3,'full',true,NULL,'[{"language": "pl-PL", "translation": "Treść opcji"}]'::json WHERE NOT EXISTS (SELECT 1 FROM directus_fields WHERE collection='survey_options' AND field='label');
INSERT INTO directus_fields (collection,field,special,interface,options,readonly,hidden,sort,width,required,note,translations) SELECT 'survey_submissions','date_created','date-created','datetime',NULL,true,false,2,'full',false,NULL,'[{"language": "pl-PL", "translation": "Data zgłoszenia"}]'::json WHERE NOT EXISTS (SELECT 1 FROM directus_fields WHERE collection='survey_submissions' AND field='date_created');
INSERT INTO directus_fields (collection,field,special,interface,options,readonly,hidden,sort,width,required,note,translations) SELECT 'survey_submissions','name',NULL,'input',NULL,true,false,3,'full',false,NULL,'[{"language": "pl-PL", "translation": "Imię i nazwisko"}]'::json WHERE NOT EXISTS (SELECT 1 FROM directus_fields WHERE collection='survey_submissions' AND field='name');
INSERT INTO directus_fields (collection,field,special,interface,options,readonly,hidden,sort,width,required,note,translations) SELECT 'survey_submissions','email',NULL,'input',NULL,true,false,4,'full',false,NULL,'[{"language": "pl-PL", "translation": "E-mail"}]'::json WHERE NOT EXISTS (SELECT 1 FROM directus_fields WHERE collection='survey_submissions' AND field='email');
INSERT INTO directus_fields (collection,field,special,interface,options,readonly,hidden,sort,width,required,note,translations) SELECT 'survey_submissions','phone',NULL,'input',NULL,true,false,5,'full',false,NULL,'[{"language": "pl-PL", "translation": "Telefon"}]'::json WHERE NOT EXISTS (SELECT 1 FROM directus_fields WHERE collection='survey_submissions' AND field='phone');
INSERT INTO directus_fields (collection,field,special,interface,options,readonly,hidden,sort,width,required,note,translations) SELECT 'survey_submissions','company',NULL,'input',NULL,true,false,6,'full',false,NULL,'[{"language": "pl-PL", "translation": "Firma"}]'::json WHERE NOT EXISTS (SELECT 1 FROM directus_fields WHERE collection='survey_submissions' AND field='company');
INSERT INTO directus_fields (collection,field,special,interface,options,readonly,hidden,sort,width,required,note,translations) SELECT 'survey_answers','question_title',NULL,'input',NULL,true,false,2,'full',false,NULL,'[{"language": "pl-PL", "translation": "Pytanie"}]'::json WHERE NOT EXISTS (SELECT 1 FROM directus_fields WHERE collection='survey_answers' AND field='question_title');
INSERT INTO directus_fields (collection,field,special,interface,options,readonly,hidden,sort,width,required,note,translations) SELECT 'survey_answers','question_type',NULL,'input',NULL,true,false,3,'full',false,NULL,'[{"language": "pl-PL", "translation": "Typ pytania"}]'::json WHERE NOT EXISTS (SELECT 1 FROM directus_fields WHERE collection='survey_answers' AND field='question_type');
INSERT INTO directus_fields (collection,field,special,interface,options,readonly,hidden,sort,width,required,note,translations) SELECT 'survey_answers','value','cast-json','input-code','{"language": "json"}'::json,true,false,4,'full',false,NULL,'[{"language": "pl-PL", "translation": "Odpowiedź"}]'::json WHERE NOT EXISTS (SELECT 1 FROM directus_fields WHERE collection='survey_answers' AND field='value');
INSERT INTO directus_fields (collection,field,special,interface,options,readonly,hidden,sort,width,required,note,translations) SELECT 'survey_answers','option_labels','cast-json','input-code','{"language": "json"}'::json,true,false,5,'full',false,NULL,'[{"language": "pl-PL", "translation": "Wybrane opcje"}]'::json WHERE NOT EXISTS (SELECT 1 FROM directus_fields WHERE collection='survey_answers' AND field='option_labels');
INSERT INTO directus_fields (collection,field,special,interface,options,readonly,hidden,sort,width,required,note,translations) SELECT 'survey_questions','survey','m2o','select-dropdown-m2o','{"template": "{{title}}"}'::json,false,false,7,'full',true,NULL,'[{"language": "pl-PL", "translation": "Ankieta"}]'::json WHERE NOT EXISTS (SELECT 1 FROM directus_fields WHERE collection='survey_questions' AND field='survey');
INSERT INTO directus_fields (collection,field,special,interface,options,readonly,hidden,sort,width,required,note,translations) SELECT 'surveys','questions','o2m','list-o2m','{"template": "{{title}}", "enableCreate": true, "enableSelect": false}'::json,false,false,14,'full',false,NULL,'[{"language": "pl-PL", "translation": "Pytania"}]'::json WHERE NOT EXISTS (SELECT 1 FROM directus_fields WHERE collection='surveys' AND field='questions');
INSERT INTO directus_relations (many_collection,many_field,one_collection,one_field,sort_field,one_deselect_action) SELECT 'survey_questions','survey','surveys','questions','sort','delete' WHERE NOT EXISTS (SELECT 1 FROM directus_relations WHERE many_collection='survey_questions' AND many_field='survey');
INSERT INTO directus_fields (collection,field,special,interface,options,readonly,hidden,sort,width,required,note,translations) SELECT 'survey_options','question','m2o','select-dropdown-m2o','{"template": "{{title}}"}'::json,false,false,4,'full',true,NULL,'[{"language": "pl-PL", "translation": "Pytanie"}]'::json WHERE NOT EXISTS (SELECT 1 FROM directus_fields WHERE collection='survey_options' AND field='question');
INSERT INTO directus_fields (collection,field,special,interface,options,readonly,hidden,sort,width,required,note,translations) SELECT 'survey_questions','options','o2m','list-o2m','{"template": "{{label}}", "enableCreate": true, "enableSelect": false}'::json,false,false,8,'full',false,NULL,'[{"language": "pl-PL", "translation": "Opcje odpowiedzi"}]'::json WHERE NOT EXISTS (SELECT 1 FROM directus_fields WHERE collection='survey_questions' AND field='options');
INSERT INTO directus_relations (many_collection,many_field,one_collection,one_field,sort_field,one_deselect_action) SELECT 'survey_options','question','survey_questions','options','sort','delete' WHERE NOT EXISTS (SELECT 1 FROM directus_relations WHERE many_collection='survey_options' AND many_field='question');
INSERT INTO directus_fields (collection,field,special,interface,options,readonly,hidden,sort,width,required,note,translations) SELECT 'survey_submissions','survey','m2o','select-dropdown-m2o','{"template": "{{title}}"}'::json,true,false,7,'full',true,NULL,'[{"language": "pl-PL", "translation": "Ankieta"}]'::json WHERE NOT EXISTS (SELECT 1 FROM directus_fields WHERE collection='survey_submissions' AND field='survey');
INSERT INTO directus_fields (collection,field,special,interface,options,readonly,hidden,sort,width,required,note,translations) SELECT 'surveys','submissions','o2m','list-o2m','{"template": "{{date_created}}", "enableCreate": false, "enableSelect": false}'::json,true,false,15,'full',false,NULL,'[{"language": "pl-PL", "translation": "Zgłoszenia"}]'::json WHERE NOT EXISTS (SELECT 1 FROM directus_fields WHERE collection='surveys' AND field='submissions');
INSERT INTO directus_relations (many_collection,many_field,one_collection,one_field,sort_field,one_deselect_action) SELECT 'survey_submissions','survey','surveys','submissions',NULL,'delete' WHERE NOT EXISTS (SELECT 1 FROM directus_relations WHERE many_collection='survey_submissions' AND many_field='survey');
INSERT INTO directus_fields (collection,field,special,interface,options,readonly,hidden,sort,width,required,note,translations) SELECT 'survey_answers','submission','m2o','select-dropdown-m2o','{"template": "{{date_created}}"}'::json,true,false,6,'full',true,NULL,'[{"language": "pl-PL", "translation": "Zgłoszenie"}]'::json WHERE NOT EXISTS (SELECT 1 FROM directus_fields WHERE collection='survey_answers' AND field='submission');
INSERT INTO directus_fields (collection,field,special,interface,options,readonly,hidden,sort,width,required,note,translations) SELECT 'survey_submissions','answers','o2m','list-o2m','{"template": "{{question_title}}: {{value}}", "enableCreate": false, "enableSelect": false}'::json,true,false,8,'full',false,NULL,'[{"language": "pl-PL", "translation": "Odpowiedzi"}]'::json WHERE NOT EXISTS (SELECT 1 FROM directus_fields WHERE collection='survey_submissions' AND field='answers');
INSERT INTO directus_relations (many_collection,many_field,one_collection,one_field,sort_field,one_deselect_action) SELECT 'survey_answers','submission','survey_submissions','answers',NULL,'delete' WHERE NOT EXISTS (SELECT 1 FROM directus_relations WHERE many_collection='survey_answers' AND many_field='submission');
INSERT INTO directus_fields (collection,field,special,interface,options,readonly,hidden,sort,width,required,note,translations) SELECT 'survey_answers','question','m2o','select-dropdown-m2o','{"template": "{{title}}"}'::json,true,false,7,'full',true,NULL,'[{"language": "pl-PL", "translation": "Pytanie"}]'::json WHERE NOT EXISTS (SELECT 1 FROM directus_fields WHERE collection='survey_answers' AND field='question');
INSERT INTO directus_relations (many_collection,many_field,one_collection,one_field,sort_field,one_deselect_action) SELECT 'survey_answers','question','survey_questions',NULL,NULL,'delete' WHERE NOT EXISTS (SELECT 1 FROM directus_relations WHERE many_collection='survey_answers' AND many_field='question');

-- All structure edits and submissions lock the survey row, including concurrent edits.
CREATE OR REPLACE FUNCTION protect_survey_structure() RETURNS trigger LANGUAGE plpgsql AS $$
DECLARE sid uuid; ids uuid[];
BEGIN
 IF TG_TABLE_NAME = 'surveys' THEN
   sid := OLD.id;
   IF TG_OP = 'UPDATE' AND NEW.mode = OLD.mode THEN RETURN NEW; END IF;
   ids := ARRAY[sid];
 ELSIF TG_TABLE_NAME = 'survey_questions' THEN
   IF TG_OP = 'INSERT' THEN ids := ARRAY[NEW.survey];
   ELSIF TG_OP = 'DELETE' THEN ids := ARRAY[OLD.survey];
   ELSE ids := ARRAY[OLD.survey, NEW.survey]; END IF;
 ELSE
   IF TG_OP = 'INSERT' THEN SELECT ARRAY[survey] INTO ids FROM survey_questions WHERE id=NEW.question;
   ELSIF TG_OP = 'DELETE' THEN SELECT ARRAY[survey] INTO ids FROM survey_questions WHERE id=OLD.question;
   ELSE SELECT array_agg(DISTINCT survey ORDER BY survey) INTO ids FROM survey_questions WHERE id IN (OLD.question,NEW.question); END IF;
 END IF;
 FOR sid IN SELECT DISTINCT unnest(ids) ORDER BY 1 LOOP
   PERFORM id FROM surveys WHERE id=sid FOR UPDATE;
   IF EXISTS (SELECT 1 FROM survey_submissions WHERE survey=sid) THEN
     RAISE EXCEPTION 'Ankieta ma odpowiedzi. Nie można zmieniać pytań, opcji ani trybu. Utwórz nową ankietę.';
   END IF;
 END LOOP;
 IF TG_OP = 'DELETE' THEN RETURN OLD; END IF;
 RETURN NEW;
END $$;
DROP TRIGGER IF EXISTS survey_structure_lock ON surveys;
CREATE TRIGGER survey_structure_lock BEFORE UPDATE OR DELETE ON surveys FOR EACH ROW EXECUTE FUNCTION protect_survey_structure();
DROP TRIGGER IF EXISTS survey_structure_lock ON survey_questions;
CREATE TRIGGER survey_structure_lock BEFORE INSERT OR UPDATE OR DELETE ON survey_questions FOR EACH ROW EXECUTE FUNCTION protect_survey_structure();
DROP TRIGGER IF EXISTS survey_structure_lock ON survey_options;
CREATE TRIGGER survey_structure_lock BEFORE INSERT OR UPDATE OR DELETE ON survey_options FOR EACH ROW EXECUTE FUNCTION protect_survey_structure();
CREATE OR REPLACE FUNCTION protect_survey_submission() RETURNS trigger LANGUAGE plpgsql AS $$
DECLARE survey_mode text;
BEGIN
 SELECT mode INTO survey_mode FROM surveys WHERE id=NEW.survey FOR UPDATE;
 IF survey_mode='anonymous' AND (NEW.name IS NOT NULL OR NEW.email IS NOT NULL OR NEW.phone IS NOT NULL OR NEW.company IS NOT NULL) THEN
   RAISE EXCEPTION 'Anonimowa ankieta nie może zawierać danych kontaktowych.';
 END IF;
 RETURN NEW;
END $$;
DROP TRIGGER IF EXISTS survey_anonymous_guard ON survey_submissions;
CREATE TRIGGER survey_anonymous_guard BEFORE INSERT OR UPDATE ON survey_submissions FOR EACH ROW EXECUTE FUNCTION protect_survey_submission();
-- Draft example: it remains private until an administrator publishes it.
DO $$ BEGIN
IF NOT EXISTS (SELECT 1 FROM surveys WHERE id='ec1e7a8f-7a84-4905-9c24-e0c499ef9001' OR slug='przykladowa-ankieta') THEN
INSERT INTO surveys (id,title,slug,description) VALUES ('ec1e7a8f-7a84-4905-9c24-e0c499ef9001','Przykładowa ankieta','przykladowa-ankieta','Pomóż nam poprawić jakość obsługi.') ON CONFLICT DO NOTHING;
INSERT INTO survey_questions (id,survey,sort,title,type,required) VALUES
 ('ec1e7a8f-7a84-4905-9c24-e0c499ef9011','ec1e7a8f-7a84-4905-9c24-e0c499ef9001',1,'Jak oceniasz obsługę?','single_choice',true),
 ('ec1e7a8f-7a84-4905-9c24-e0c499ef9012','ec1e7a8f-7a84-4905-9c24-e0c499ef9001',2,'Co możemy poprawić?','long_text',false)
 ON CONFLICT DO NOTHING;
INSERT INTO survey_options (id,question,sort,label) VALUES
 ('ec1e7a8f-7a84-4905-9c24-e0c499ef9021','ec1e7a8f-7a84-4905-9c24-e0c499ef9011',1,'Bardzo dobrze'),
 ('ec1e7a8f-7a84-4905-9c24-e0c499ef9022','ec1e7a8f-7a84-4905-9c24-e0c499ef9011',2,'Dobrze'),
 ('ec1e7a8f-7a84-4905-9c24-e0c499ef9023','ec1e7a8f-7a84-4905-9c24-e0c499ef9011',3,'Wymaga poprawy')
 ON CONFLICT DO NOTHING;
END IF;
END $$;
COMMIT;
