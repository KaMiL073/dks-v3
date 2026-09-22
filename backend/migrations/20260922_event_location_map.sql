BEGIN;
UPDATE directus_collections
SET note = 'Lokalizacja, termin, mapa Google oraz przyciski dodania do kalendarza.'
WHERE collection = 'event_location';
UPDATE directus_fields
SET hidden = true
WHERE collection = 'event_location' AND field IN ('image', 'image_alt');
UPDATE directus_fields
SET note = 'Pełny adres z miejscowością lub nazwa miejsca rozpoznawana przez Google Maps. Na tej podstawie wyświetlana jest mapa. Pozostaw puste, aby użyć lokalizacji wydarzenia.'
WHERE collection = 'event_location' AND field = 'location';
COMMIT;
