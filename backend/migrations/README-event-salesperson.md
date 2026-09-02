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
Podsumowania liczą wszystkie zgłoszenia tego wydarzenia. Wykres jest ograniczony
do Katarzyny Kołodziejczyk, Marka Mudenta, Macieja Bednarskiego, Jakuba
Czarneckiego i Andrzeja Ćwiklińskiego. Zgłoszenia nie są deduplikowane po kliencie.
Osoby bez zgłoszeń nie tworzą słupka. Konto Macieja Bednarskiego nie istniało
w lokalnej bazie podczas wdrożenia — migracje nie tworzą kont użytkowników.

Etykieta `events.salesperson_label` służy tylko do grupowania wykresu; triggery
aktualizują ją na podstawie relacji `salesperson` oraz zmian nazwiska użytkownika.

## Testy lokalne

`backend/fixtures/gdansk-sales-test.sql` dodaje 10 oznaczonych rekordów przez SQL,
bez uruchamiania flow Directusa i wysyłki wiadomości. **Nie wykonuj go na produkcji.**
Rekordy mają firmę `TEST ONLY — gdansk-insights-20260902` i adresy
`gdansk-insights-test-20260902-…@example.invalid`.
Backupy i rzeczywiste lokalne dane nie należą do tego wdrożenia.
