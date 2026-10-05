# Lista obecności wydarzeń

To osobny układ „Lista obecności” (`event-attendance`) i osobna wspólna
zakładka. Klasyczny układ „Tabela” (`tabular`) nie ma przełączników obecności.
Zakładkę obecności otwieraj z menu kolekcji. Directus może zapamiętać ostatnio
używany układ w osobistych ustawieniach kolekcji; wybór „Tabela” przywraca
klasyczny widok.

Układ `event-attendance` pokazuje zgłoszenia `events` i pozwala przełączać
pole `attended` bez otwierania uczestnika. Zapis korzysta z API Directusa
i uprawnień zalogowanego użytkownika.

Rozszerzenie korzysta bezpośrednio z konfiguracji, komponentu i paneli
klasycznego układu `tabular` Directusa. Zachowuje jego sortowanie,
wyszukiwanie, filtry, wybór i ukrywanie kolumn, zmianę kolejności i szerokości,
wyrównanie, odstępy, paginację i rozmiar strony, zaznaczanie rekordów,
akcje zbiorcze, skróty i eksport. Zastępuje tylko slot komórki `attended`
przełącznikiem z automatycznym zapisem. Kliknięcie przełącznika nie otwiera
rekordu; kliknięcie pozostałych komórek zachowuje standardowe działanie tabeli.
Po zapisie odświeża dane przez klasyczny układ, zachowując jego filtry i sortowanie.

Adapter komórki został sprawdzony z Directusem **11.12.0**. Przed zmianą
wersji Directusa należy ponownie sprawdzić integrację slotu `item.attended`
z komponentem tabeli.

## Wdrożenie

1. Wykonaj i sprawdź kopię docelowej bazy.
2. Wykonaj migracje z `psql -v ON_ERROR_STOP=1`, w kolejności:
   - `backend/migrations/20261005_event_attendance.sql`
   - `backend/migrations/20261005_event_attendance_inline.sql`
3. Udostępnij katalog rozszerzenia w `/directus/extensions/event-attendance`.
   Gotowy plik `dist/index.js` jest dołączony do repozytorium.
4. Zrestartuj Directusa i odśwież panel w przeglądarce.
5. W kolekcji `events` wybierz wspólną zakładkę „Lista obecności”.

Jeśli obie migracje zostały już wykonane, aktualizacja samego rozszerzenia
wymaga jedynie pobrania jego plików, restartu Directusa i odświeżenia panelu.
Przy pierwszym otwarciu domyślne kolumny obejmują obecność i dane uczestnika;
wcześniej zapisany wybór kolumn jest zachowywany. Jeśli pole obecności zostało
ukryte, można je dodać standardowym przyciskiem `+` w nagłówku tabeli.

Sam push do repozytorium nie wykonuje migracji na innym środowisku.
Nie dodawaj uprawnień roli publicznej. Osoby obsługujące wydarzenie potrzebują
odczytu zgłoszeń i aktualizacji pola `attended` w ramach swoich polityk.

## Aktualizacja rozszerzenia

Uruchom `npm run build` w tym katalogu. Skrypt kopiuje moduł źródłowy do
`dist/index.js`; rozszerzenie nie wymaga dodatkowych zależności ani bundlera.
Ponieważ globalne reguły repozytorium ignorują `dist`, zaktualizowany plik
wynikowy należy dodać jawnie do commita.

## Weryfikacja

`npm test` sprawdza zachowanie slotów klasycznej tabeli, oba sposoby
renderowania komponentów Vue, zapis samego pola obecności, obsługę błędów,
tryb tylko do odczytu i blokadę powtórnego kliknięcia podczas zapisu.
W panelu Directusa 11.12.0 sprawdzono wyszukiwanie, zaznaczanie rekordów
i pojawienie się akcji zbiorczych, menu kolumn oraz zapis i cofnięcie
obecności na osobnym, później usuniętym rekordzie testowym.
