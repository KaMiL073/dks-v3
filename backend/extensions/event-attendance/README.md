# Lista obecności wydarzeń

Układ `event-attendance` pokazuje zgłoszenia `events` i pozwala przełączać
pole `attended` bez otwierania uczestnika. Zapis korzysta z API Directusa
i uprawnień zalogowanego użytkownika. Wyszukiwanie i filtry panelu obejmują
całą kolekcję, a tabela wyświetla po 100 zgłoszeń na stronę.

## Wdrożenie

1. Wykonaj i sprawdź kopię docelowej bazy.
2. Wykonaj migracje z `psql -v ON_ERROR_STOP=1`, w kolejności:
   - `backend/migrations/20261005_event_attendance.sql`
   - `backend/migrations/20261005_event_attendance_inline.sql`
3. Udostępnij katalog rozszerzenia w `/directus/extensions/event-attendance`.
   Gotowy plik `dist/index.js` jest dołączony do repozytorium.
4. Zrestartuj Directusa i odśwież panel w przeglądarce.
5. W kolekcji `events` wybierz wspólną zakładkę „Lista obecności”.

Sam push do repozytorium nie wykonuje migracji na innym środowisku.
Nie dodawaj uprawnień roli publicznej. Osoby obsługujące wydarzenie potrzebują
odczytu zgłoszeń i aktualizacji pola `attended` w ramach swoich polityk.

## Aktualizacja rozszerzenia

Uruchom `npm run build` w tym katalogu. Skrypt kopiuje moduł źródłowy do
`dist/index.js`; rozszerzenie nie wymaga dodatkowych zależności ani bundlera.
Ponieważ globalne reguły repozytorium ignorują `dist`, zaktualizowany plik
wynikowy należy dodać jawnie do commita.
