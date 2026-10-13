# Ankiety

Ankiety obsługuje standardowy panel Directusa. Publiczny formularz jest dostępny pod `/ankiety/{slug}` wyłącznie dla statusu „Opublikowana”.

## Obsługa

1. Otwórz **Ankiety** w Directusie i dodaj ankietę.
2. Podaj tytuł, opis i unikalny slug (małe litery, cyfry, myślniki).
3. Wybierz tryb: **Anonimowa** albo **Z danymi kontaktowymi**.
4. Dla trybu kontaktowego ustaw imię i nazwisko, e-mail, telefon oraz firmę jako ukryte, opcjonalne lub wymagane. Uzupełnij informację o przetwarzaniu danych właściwą dla tej ankiety.
5. Dodaj pytania w relacji **Pytania**. Typy: krótki tekst (500 znaków), długi tekst (10 000 znaków), jednokrotny wybór, wielokrotny wybór. Zaznacz pytania wymagane. Dla wyborów dodaj opcje. Kolejność zmienia się przez przeciąganie w relacji.
6. Ustaw komunikat po wysłaniu. Zmień status na **Opublikowana** i otwórz `/ankiety/{slug}`.
7. Wyniki są w **Wypełnione ankiety**. Jeden wpis oznacza jedno wypełnienie. Po jego otwarciu tabela **Wszystkie odpowiedzi** pokazuje pytania i odpowiedzi tej osoby. W edytorze ankiety sekcja **Wypełnione ankiety** zawiera listę zgłoszeń i linki do ich pełnego podglądu. Filtruj po ankiecie i dacie. Do eksportu odpowiedzi wybierz także `submission.survey.title`, `submission.date_created`, `question_title`, `answer_text`; dla ankiet kontaktowych odpowiednie pola `submission.name`, `submission.email`, `submission.phone`, `submission.company`.
8. Status **Robocza** lub **Archiwalna** wyłącza formularz i przyjmowanie zgłoszeń.

Po pierwszym zgłoszeniu baza blokuje dodawanie, usuwanie i edycję pytań oraz opcji, a także zmianę trybu anonimowego/kontaktowego. Tytuł, opis, status, komunikat końcowy i ustawienia pól kontaktowych można nadal zmieniać. Aby zmienić strukturę pytań, utwórz nową ankietę z nowym slugiem. Duplikuj konfigurację bez relacji zgłoszeń.

Migracja zawiera prywatną ankietę roboczą `przykladowa-ankieta`. Nie jest automatycznie publikowana.

## Instalacja na kolejnym środowisku

Przed migracją wykonaj kopię bazy. Na środowisku Docker z kontenerami `database`, `directus`, `frontend-new`:

```sh
docker exec -i database psql -U directus -d directus -v ON_ERROR_STOP=1 < backend/migrations/20261013_surveys.sql
docker exec -i database psql -U directus -d directus -v ON_ERROR_STOP=1 < backend/migrations/20261013_surveys_readable_answers.sql
docker exec -i database psql -U directus -d directus -v ON_ERROR_STOP=1 < backend/migrations/20261013_surveys_submission_view.sql
```

Następnie uruchom ponownie lokalnego Directusa, aby odświeżył schemat i wczytał rozszerzenie:

```sh
docker restart directus
```

Rozszerzenie `backend/extensions/surveys` zawiera zwykły JavaScript i nie wymaga kompilacji. Wdrożenie musi obejmować cały katalog z manifestem, `src/index.js` i `src/validation.js`. Manifest wskazuje plik źródłowy jako punkt wejścia. Frontend należy przebudować w środowisku produkcyjnym.

Administrator Directusa ma dostęp do kreatora i wyników. Dla innych redaktorów przyznaj osobno odczyt/tworzenie/edycję konfiguracji `surveys`, `survey_questions`, `survey_options` oraz odczyt wyników `survey_submissions`, `survey_answers`. Nie przyznawaj publicznej roli żadnych uprawnień do ankiet ani wyników. Strona korzysta z podpisanego endpointu, który zwraca wyłącznie opublikowaną konfigurację; odczyt ankiet i ich zapis nie korzystają z istniejącego konta administratora strony.

## Konfiguracja i ochrona danych

- Frontend i Directus muszą mieć ten sam `FORMS_HMAC_SECRET`.
- Frontend korzysta z `API_INTERNAL_URL`/`DIRECTUS_INTERNAL_URL`, `RECAPTCHA_SECRET_KEY` i `NEXT_PUBLIC_RECAPTCHA_SITE_KEY`.
- reCAPTCHA używa akcji `survey_submit`, minimalnego wyniku 0,5 oraz `RECAPTCHA_ALLOWED_HOSTNAMES` (domyślnie `dks.pl,www.dks.pl`).
- Bypass reCAPTCHA działa wyłącznie poza produkcją, na localhost, przy `RECAPTCHA_BYPASS_LOCAL=true` i `NEXT_PUBLIC_RECAPTCHA_BYPASS_LOCAL=true`.
- Proxy musi nadpisywać `X-Real-IP`; istniejące konfiguracje projektu robią to. Limit to 10 podpisanych prób na adres w oknie 10 minut, wspólny dla instancji aplikacji. Przy dostępie bez proxy brak nagłówka oznacza wspólny limit. Nie wystawiaj produkcyjnego portu Next.js z pominięciem proxy.
- Limit używa rotującego HMAC adresu; tabela techniczna nie ma relacji do odpowiedzi. Surowe IP, token reCAPTCHA ani identyfikator konta respondenta nie są zapisywane w wynikach. Stare liczniki są czyszczone przy kolejnych próbach; po ustaniu ruchu można okresowo czyścić `survey_rate_limits`.
- W trybie anonimowym endpoint ignoruje dane kontaktowe, a baza zabrania zapisania ich przy zgłoszeniu. Osoba wypełniająca może samodzielnie ujawnić dane w pytaniu otwartym; formularz prosi, by tego nie robić. Globalne narzędzia analityczne i logi infrastruktury pozostają częścią istniejącej strony.
- Walidacja i zapis wszystkich odpowiedzi odbywają się w jednej transakcji. Wyniki przechowują też tekst pytań i etykiety opcji. Endpoint nie zapisuje treści zgłoszeń w logach i nie wysyła wiadomości e-mail.

## Testy

```sh
node --test backend/extensions/surveys/test/*.test.mjs frontend-new/tests/form-recaptcha.test.mjs
cd frontend-new
npx tsc --noEmit
npx eslint 'src/app/ankiety/[slug]/page.tsx' 'src/app/api/ankiety/[slug]/route.ts' src/components/surveys/SurveyForm.tsx src/lib/surveys.ts
```

Pełny test lokalny (po migracjach, z lokalnym bypassem reCAPTCHA i istniejącym lokalnym administracyjnym `SERVICE_USER_TOKEN` używanym wyłącznie do utworzenia konfiguracji testowej) tworzy osobną ankietę i usuwa dane w `finally`:

```sh
docker exec directus node /directus/extensions/surveys/test/integration.mjs
```
