BEGIN;

-- GraphQL expects a nested user filter for an M2O relation, unlike REST's
-- shorthand UUID filter. Preserve all other panel settings and layout.
UPDATE directus_panels
SET options = jsonb_set(
  options::jsonb,
  '{filter,salesperson}',
  jsonb_build_object('id', options::jsonb #> '{filter,salesperson}')
)::json
WHERE dashboard = '3d1f61a4-12e6-4e91-8c31-020920260001'
  AND (
    (options::jsonb #> '{filter,salesperson}') ?| ARRAY['_eq', '_null', '_nnull']
  );

COMMIT;
