# Linki handlowców i Insights — wdrożenie

Migracje są ręczne. Sam push ani restart kontenerów ich nie wykonuje.
Przed zmianą schematu wykonaj i sprawdź backup docelowej bazy.

## Kolejność

Wykonaj pliki przez `psql -v ON_ERROR_STOP=1` w poniższej kolejności
(nie alfabetycznie):

1. `20260902_event_salesperson_tracking.sql`
2. `20260902_event_salesperson_chart_label.sql`
3. `20260902_event_salesperson_insights.sql`
4. `20260902_event_salesperson_insights_graphql_fix.sql`
5. `20260902_event_salesperson_insights_selection.sql`
6. `20260902_event_salesperson_insights_bar_chart.sql`
7. `20260907_event_salesperson_unique_companies.sql`

Dashboard warszawski dodaje osobna migracja
`20260917_warsaw_event_salesperson_insights.sql`. Uruchom ją dopiero po
`20260902_event_salesperson_tracking.sql` i
`20260902_event_salesperson_chart_label.sql`; używa pola `salesperson_label`.
Nie uruchamia pliku testowych rekordów.

Po wykonaniu odśwież cache Directusa i zrestartuj usługę dla nowego schematu
GraphQL. Wdróż również frontend z obsługą parametru `handlowiec`.
Konto serwisowe frontendu musi móc odczytać `directus_users.id`, `status`
i `invitation_code` oraz tworzyć `events` z polem `salesperson`.
Nie przyznawaj tych uprawnień roli publicznej. Użytkownicy Insights potrzebują
uprawnień do odczytu dashboardu, paneli, zgłoszeń i pól używanych w filtrach.

## Używanie

Kod konta znajduje się w `directus_users.invitation_code`. Przykładowy adres:
`https://dks.pl/wydarzenia/dks-gdansk-innovation-days?handlowiec=KOD#rejestracja`.

Dashboard: `/admin/insights/3d1f61a4-12e6-4e91-8c31-020920260001`.
Warszawa: `/admin/insights/8a8c7026-0920-46aa-8c31-170920260001`.
Warszawski dashboard filtruje `events.event = warsaw-innovation-days`, liczy
unikalne wartości `company` i grupuje wykres po wszystkich przypisanych
handlowcach bez stałej listy nazwisk. Odczyt dashboardu i jego paneli nadaj
wyłącznie właściwym politykom Directusa; odczyt `events` ogranicz do
`warsaw-innovation-days` dla handlowców warszawskich.
Dashboard gdański ma podsumowania dla tego wydarzenia. Wykres jest ograniczony
do Katarzyny Kołodziejczyk, Marka Mudenta, Macieja Bednarskiego, Jakuba
Czarneckiego i Andrzeja Ćwiklińskiego. Po ostatniej migracji liczy unikalne
nazwy firm, nie liczbę osób.
Osoby bez zgłoszeń nie tworzą słupka. Konto Macieja Bednarskiego nie istniało
w lokalnej bazie podczas wdrożenia — migracje nie tworzą kont użytkowników.

Migracja z 7 września zmienia miarę dashboardu gdańskiego z liczby zapisanych osób na liczbę
unikalnych wartości pola `company`. Identyczna nazwa firmy jest liczona raz dla
danego panelu, natomiast różnice w pisowni lub odstępach są liczone osobno.

Etykieta `events.salesperson_label` służy tylko do grupowania wykresu; triggery
aktualizują ją na podstawie relacji `salesperson` oraz zmian nazwiska użytkownika.

## Testy lokalne

`backend/fixtures/gdansk-sales-test.sql` dodaje 10 oznaczonych rekordów przez SQL,
bez uruchamiania flow Directusa i wysyłki wiadomości. **Nie wykonuj go na produkcji.**
Rekordy mają firmę `TEST ONLY — gdansk-insights-20260902` i adresy
`gdansk-insights-test-20260902-…@example.invalid`.
Backupy i rzeczywiste lokalne dane nie należą do tego wdrożenia.
