-- Agency SEO migration for DKS
-- Generated from frontend-new/tests/wytyczne.txt
-- Safe to run on production: updates only SEO/H1/canonical fields by url/slug.
-- It does not delete data and does not touch submissions such as contact_form.

BEGIN;

-- 1. Ensure page rows from agency guidelines exist.
WITH expected AS (
  SELECT * FROM jsonb_to_recordset($agency_json$[
  {
    "url": "/oferta/rozwiazania-dla-biura/oprogramowanie-do-druku",
    "title": "PaperCut i Safe Q - oprogramowanie do druku | DKS",
    "name": "PaperCut i Safe Q - oprogramowanie do zarządzania drukiem"
  },
  {
    "url": "/promocje",
    "title": "Promocje na drukarki, kserokopiarki i urządzenia biurowe | DKS",
    "name": null
  },
  {
    "url": "/wydarzenia",
    "title": "Wydarzenia, szkolenia i aktualności branżowe | DKS",
    "name": null
  },
  {
    "url": "/oferta",
    "title": "Oferta DKS - drukarki, kserokopiarki i rozwiązania dla firm",
    "name": null
  },
  {
    "url": "/oferta/produkty",
    "title": "Drukarki, kserokopiarki i urządzenia biurowe | DKS",
    "name": null
  },
  {
    "url": "/blog",
    "title": null,
    "name": "Blog DKS"
  },
  {
    "url": "/blog/page/2",
    "title": null,
    "name": "Blog DKS - strona 2"
  },
  {
    "url": "/blog/oprogramowanie",
    "title": null,
    "name": "Oprogramowanie"
  },
  {
    "url": "/blog/case-study",
    "title": null,
    "name": "Case study"
  },
  {
    "url": "/blog/rozwiazania-dla-poligrafii",
    "title": null,
    "name": "Rozwiązania dla poligrafii"
  },
  {
    "url": "/blog/rozwiazania-dla-biura",
    "title": null,
    "name": "Rozwiązania dla biura"
  },
  {
    "url": "/blog/serwis",
    "title": null,
    "name": "Serwis"
  },
  {
    "url": "/blog/rozwiazania-wielkoformatowe",
    "title": null,
    "name": "Rozwiązania wielkoformatowe"
  },
  {
    "url": "/blog/aktualnosci",
    "title": null,
    "name": "Aktualności"
  },
  {
    "url": "/blog/aktualnosci/page/2",
    "title": null,
    "name": "Aktualności - strona 2"
  },
  {
    "url": "/blog/rozwiazania-dla-biura/page/2",
    "title": null,
    "name": "Rozwiązania dla biura - strona 2"
  },
  {
    "url": "/blog/rozwiazania-dla-poligrafii/page/2",
    "title": null,
    "name": "Rozwiązania dla poligrafii - strona 2"
  },
  {
    "url": "/blog/page/3",
    "title": null,
    "name": "Blog DKS - strona 3"
  },
  {
    "url": "/blog/page/4",
    "title": null,
    "name": "Blog DKS - strona 4"
  },
  {
    "url": "/blog/rozwiazania-dla-biura/page/3",
    "title": null,
    "name": "Rozwiązania dla biura - strona 3"
  },
  {
    "url": "/blog/aktualnosci/page/3",
    "title": null,
    "name": "Aktualności - strona 3"
  },
  {
    "url": "/blog/page/5",
    "title": null,
    "name": "Blog DKS - strona 5"
  },
  {
    "url": "/blog/rozwiazania-dla-biura/page/4",
    "title": null,
    "name": "Rozwiązania dla biura - strona 4"
  },
  {
    "url": "/blog/page/6",
    "title": null,
    "name": "Blog DKS - strona 6"
  },
  {
    "url": "/blog/page/7",
    "title": null,
    "name": "Blog DKS - strona 7"
  },
  {
    "url": "/blog/page/8",
    "title": null,
    "name": "Blog DKS - strona 8"
  },
  {
    "url": "/blog/page/9",
    "title": null,
    "name": "Blog DKS - strona 9"
  }
]$agency_json$::jsonb)
    AS x(url text, name text, title text)
)
INSERT INTO pages (id, url, name, title)
SELECT gen_random_uuid(), e.url, e.name, e.title
FROM expected e
WHERE NOT EXISTS (
  SELECT 1 FROM pages p WHERE trim(trailing '/' FROM p.url) = e.url
);

-- 2. Update pages H1 (name) and meta title (title).
WITH expected AS (
  SELECT * FROM jsonb_to_recordset($agency_json$[
  {
    "url": "/oferta/rozwiazania-dla-biura/oprogramowanie-do-druku",
    "title": "PaperCut i Safe Q - oprogramowanie do druku | DKS",
    "name": "PaperCut i Safe Q - oprogramowanie do zarządzania drukiem"
  },
  {
    "url": "/promocje",
    "title": "Promocje na drukarki, kserokopiarki i urządzenia biurowe | DKS",
    "name": null
  },
  {
    "url": "/wydarzenia",
    "title": "Wydarzenia, szkolenia i aktualności branżowe | DKS",
    "name": null
  },
  {
    "url": "/oferta",
    "title": "Oferta DKS - drukarki, kserokopiarki i rozwiązania dla firm",
    "name": null
  },
  {
    "url": "/oferta/produkty",
    "title": "Drukarki, kserokopiarki i urządzenia biurowe | DKS",
    "name": null
  },
  {
    "url": "/blog",
    "title": null,
    "name": "Blog DKS"
  },
  {
    "url": "/blog/page/2",
    "title": null,
    "name": "Blog DKS - strona 2"
  },
  {
    "url": "/blog/oprogramowanie",
    "title": null,
    "name": "Oprogramowanie"
  },
  {
    "url": "/blog/case-study",
    "title": null,
    "name": "Case study"
  },
  {
    "url": "/blog/rozwiazania-dla-poligrafii",
    "title": null,
    "name": "Rozwiązania dla poligrafii"
  },
  {
    "url": "/blog/rozwiazania-dla-biura",
    "title": null,
    "name": "Rozwiązania dla biura"
  },
  {
    "url": "/blog/serwis",
    "title": null,
    "name": "Serwis"
  },
  {
    "url": "/blog/rozwiazania-wielkoformatowe",
    "title": null,
    "name": "Rozwiązania wielkoformatowe"
  },
  {
    "url": "/blog/aktualnosci",
    "title": null,
    "name": "Aktualności"
  },
  {
    "url": "/blog/aktualnosci/page/2",
    "title": null,
    "name": "Aktualności - strona 2"
  },
  {
    "url": "/blog/rozwiazania-dla-biura/page/2",
    "title": null,
    "name": "Rozwiązania dla biura - strona 2"
  },
  {
    "url": "/blog/rozwiazania-dla-poligrafii/page/2",
    "title": null,
    "name": "Rozwiązania dla poligrafii - strona 2"
  },
  {
    "url": "/blog/page/3",
    "title": null,
    "name": "Blog DKS - strona 3"
  },
  {
    "url": "/blog/page/4",
    "title": null,
    "name": "Blog DKS - strona 4"
  },
  {
    "url": "/blog/rozwiazania-dla-biura/page/3",
    "title": null,
    "name": "Rozwiązania dla biura - strona 3"
  },
  {
    "url": "/blog/aktualnosci/page/3",
    "title": null,
    "name": "Aktualności - strona 3"
  },
  {
    "url": "/blog/page/5",
    "title": null,
    "name": "Blog DKS - strona 5"
  },
  {
    "url": "/blog/rozwiazania-dla-biura/page/4",
    "title": null,
    "name": "Rozwiązania dla biura - strona 4"
  },
  {
    "url": "/blog/page/6",
    "title": null,
    "name": "Blog DKS - strona 6"
  },
  {
    "url": "/blog/page/7",
    "title": null,
    "name": "Blog DKS - strona 7"
  },
  {
    "url": "/blog/page/8",
    "title": null,
    "name": "Blog DKS - strona 8"
  },
  {
    "url": "/blog/page/9",
    "title": null,
    "name": "Blog DKS - strona 9"
  }
]$agency_json$::jsonb)
    AS x(url text, name text, title text)
)
UPDATE pages p
SET
  name = COALESCE(e.name, p.name),
  title = COALESCE(e.title, p.title),
  date_updated = now()
FROM expected e
WHERE trim(trailing '/' FROM p.url) = e.url;

-- 3. Update blog article H1 values.
WITH expected AS (
  SELECT * FROM jsonb_to_recordset($agency_json$[
  {
    "slug": "dzierzawa-czy-zakup-kserokopiarki-ktora-opcja-bardziej-oplaca-sie-twojej-firmie",
    "title": "Dzierżawa czy zakup kserokopiarki - która opcja bardziej opłaca się Twojej firmie?"
  },
  {
    "slug": "microsoft-o-auth-2-0-nadchodzi-obowiazkowa-zmiana-ktorej-nie-mozesz-zignorowac",
    "title": "Microsoft OAuth 2.0 - obowiązkowa zmiana, której nie możesz zignorować"
  },
  {
    "slug": "dlaczego-dzierzawa-kserokopiarek-wielofunkcyjnych-to-oplacalna-opcja-dla-firm",
    "title": "Dlaczego dzierżawa kserokopiarek wielofunkcyjnych to opłacalna opcja dla firm?"
  },
  {
    "slug": "dks-wzmacnia-swoja-pozycje-w-segmencie-heavy-production-kolejne-wdrozenia-produkcyjnych-systemow-drukujacych-w-polskich-drukarniach-",
    "title": "DKS wzmacnia swoją pozycję w segmencie heavy production"
  },
  {
    "slug": "jak-wybrac-urzadzenia-drukujace-do-biura-w-duchu-zrownowazonego-rozwoju",
    "title": "Jak wybrać urządzenia drukujące do biura w duchu zrównoważonego rozwoju?"
  },
  {
    "slug": "najem-komputerow-lenovo-dla-firm-dlaczego-coraz-wiecej-przedsiebiorstw-rezygnuje-z-zakupu-sprzetu",
    "title": "Najem komputerów Lenovo dla firm - dlaczego przedsiębiorstwa rezygnują z zakupu sprzętu?"
  },
  {
    "slug": "biznes-w-formie-dks-na-rema-days-2026",
    "title": "Biznes w formie - DKS na Rema Days 2026"
  },
  {
    "slug": "jak-wymienic-toner-w-urzadzeniach-konica-minolta-bizhub-c3350i-c3351i-c4050i-i-c4051i-",
    "title": "Jak wymienić toner w urządzeniach Konica Minolta bizhub C3350i, C3351i, C4050i i C4051i?"
  },
  {
    "slug": "brother-idealny-partner-dla-biura-w-erze-cyfrowej-i-hybrydowej-pracy",
    "title": "Brother - idealny partner dla biura w erze cyfrowej i hybrydowej pracy"
  },
  {
    "slug": "umowa-serwisowa-ktora-dziala-za-ciebie",
    "title": "Umowa serwisowa, która działa za Ciebie"
  },
  {
    "slug": "kserokopiarki-kolorowe-czy-czarno-biale-jaki-model-wybrac-do-biura",
    "title": "Kserokopiarki kolorowe czy czarno-białe - jaki model wybrać do biura?"
  },
  {
    "slug": "rola-serwisu-w-utrzymaniu-sprawnosci-urzadzen-wielofunkcyjnych",
    "title": "Rola serwisu w utrzymaniu sprawności urządzeń wielofunkcyjnych"
  },
  {
    "slug": "drukowanie-na-wlasne-potrzeby-jest-latwe-firmowy-print-room-od-podstaw",
    "title": "Drukowanie na własne potrzeby jest łatwe - firmowy print room od podstaw"
  },
  {
    "slug": "ekologiczne-stoisko-dks-na-rema-days-2025",
    "title": "Ekologiczne stoisko DKS na Rema Days 2025"
  },
  {
    "slug": "zastosowania-wielkoformatowego-druku-cyfrowego",
    "title": "Zastosowania wielkoformatowego druku cyfrowego"
  },
  {
    "slug": "konferencja-odkryj-potencjal-druku-wielkoformatowego",
    "title": "Konferencja - odkryj potencjał druku wielkoformatowego"
  },
  {
    "slug": "czym-sa-skladarki-wielkoformatowe",
    "title": "Czym są składarki wielkoformatowe?"
  },
  {
    "slug": "czy-oplaca-sie-korzystac-z-poleasingowego-sprzetu-drukujacego",
    "title": "Czy opłaca się korzystać z poleasingowego sprzętu drukującego?"
  },
  {
    "slug": "4-dlaczego-drukarki-brother-sa-idealnym-rozwiazaniem-dla-biur",
    "title": "Dlaczego drukarki Brother są idealnym rozwiązaniem dla biur?"
  },
  {
    "slug": "czym-rozni-sie-drukarka-laserowa-do-domu-i-do-biura",
    "title": "Czym różni się drukarka laserowa do domu i do biura?"
  },
  {
    "slug": "zakup-wynajem-czy-leasing-sprzetu-drukujacego",
    "title": "Zakup, wynajem czy leasing sprzętu drukującego?"
  },
  {
    "slug": "dni-otwarte-22-23-maja-w-gdansku",
    "title": "Dni otwarte 22-23 maja w Gdańsku"
  },
  {
    "slug": "dni-otwarte-dks-w-rzeszowie-26-27-czerwca",
    "title": "Dni otwarte DKS w Rzeszowie 26-27 czerwca"
  },
  {
    "slug": "10-11-kwietnia-dni-otwarte-w-warszawskim-oddziale-dks",
    "title": "Dni otwarte w warszawskim oddziale DKS 10-11 kwietnia"
  },
  {
    "slug": "zastosowania-monochromatycznego-i-kolorowego-druku-produkcyjnego",
    "title": "Zastosowania monochromatycznego i kolorowego druku produkcyjnego"
  },
  {
    "slug": "czym-rozni-sie-druk-cyfrowy-i-druk-offsetowy",
    "title": "Czym różni się druk cyfrowy i druk offsetowy?"
  },
  {
    "slug": "ile-minut-trwa-druk-ksiazki-na-poligraficznej-maszynie-cyfrowej",
    "title": "Ile minut trwa druk książki na poligraficznej maszynie cyfrowej?"
  },
  {
    "slug": "uszlachetnij-i-wzbogac-swoj-biznes",
    "title": "Uszlachetnij i wzbogać swój biznes"
  },
  {
    "slug": "7-8-sierpnia-dni-otwarte-dks-we-wroclawiu",
    "title": "Dni otwarte DKS we Wrocławiu 7-8 sierpnia"
  },
  {
    "slug": "zastosowania-druku-3d",
    "title": "Zastosowania druku 3D"
  },
  {
    "slug": "10-11-lipca-dni-otwarte-dks-w-oddziale-katowice",
    "title": "Dni otwarte DKS w oddziale Katowice 10-11 lipca"
  },
  {
    "slug": "ekologiczne-papiery-premium-jakosc-i-zrownowazona-przyszlosc",
    "title": "Ekologiczne papiery premium - jakość i zrównoważona przyszłość"
  },
  {
    "slug": "systemy-druku-ograniczenie-kosztow-zwiazanych-z-wydrukiem-w-firmie",
    "title": "Systemy druku - ograniczenie kosztów związanych z wydrukiem w firmie"
  },
  {
    "slug": "5-korzysci-z-elektronicznego-obiegu-dokumentow-w-firmie",
    "title": "5 korzyści z elektronicznego obiegu dokumentów w firmie"
  },
  {
    "slug": "dks-glowny-dostawca-urzadzen-do-druku-dla-wielkopolskiego-centrum-zdrowia-dziecka-w-poznaniu",
    "title": "DKS główny dostawca urządzeń do druku dla Wielkopolskiego Centrum Zdrowia Dziecka w Poznaniu"
  },
  {
    "slug": "czy-drukarka-monitoruje-zuzycie-materialow-eksploatacyjnych",
    "title": "Czy drukarka monitoruje zużycie materiałów eksploatacyjnych?"
  },
  {
    "slug": "akademia-dks-vol3",
    "title": "Akademia DKS vol. 3"
  },
  {
    "slug": "rola-serwisu-w-utrzymaniu-sprawnosci-urzadzen-wielofunkcyjnych-a3-laser-",
    "title": "Rola serwisu w utrzymaniu sprawności urządzeń wielofunkcyjnych A3 laser"
  },
  {
    "slug": "skanery-canon-w-dks",
    "title": "Skanery Canon w DKS"
  },
  {
    "slug": "ploter-atramentowy-a-efektywnosc-produkcji-co-warto-wiedziec",
    "title": "Ploter atramentowy a efektywność produkcji - co warto wiedzieć?"
  },
  {
    "slug": "dks-konwent-informatykow-2025",
    "title": "DKS Konwent Informatyków 2025"
  },
  {
    "slug": "jak-nesperta-obnizyla-koszty-it",
    "title": "Jak Nesperta obniżyła koszty IT?"
  },
  {
    "slug": "officetech-day-2025",
    "title": "OfficeTech Day 2025"
  },
  {
    "slug": "sezon-na-mature",
    "title": "Sezon na maturę"
  },
  {
    "slug": "wynajem-sprzetu-biurowego-rozwiazanie-dla-malych-firm",
    "title": "Wynajem sprzętu biurowego - rozwiązanie dla małych firm"
  },
  {
    "slug": "laptop-dla-nauczyciela-bon-2500-zl",
    "title": "Laptop dla nauczyciela - bon 2500 zł"
  },
  {
    "slug": "dlaczego-warto-rozwazyc-leasing-drukarek-lexmark-dla-swojego-biura",
    "title": "Dlaczego warto rozważyć leasing drukarek Lexmark dla swojego biura?"
  },
  {
    "slug": "archiwizacja-dokumentacji-medycznej",
    "title": "Archiwizacja dokumentacji medycznej"
  },
  {
    "slug": "kto-potrzebuje-programow-do-optycznego-rozpoznawania-znakow",
    "title": "Kto potrzebuje programów do optycznego rozpoznawania znaków?"
  },
  {
    "slug": "jak-zapewnic-bezpieczenstwo-drukowanym-dokumentom",
    "title": "Jak zapewnić bezpieczeństwo drukowanym dokumentom?"
  },
  {
    "slug": "firma-dks-zaprasza-na-cykl-dni-otwartych",
    "title": "Firma DKS zaprasza na cykl dni otwartych"
  },
  {
    "slug": "na-jakich-maszynach-mozna-drukowac-etykiety-w-malych-nakladach",
    "title": "Na jakich maszynach można drukować etykiety w małych nakładach?"
  },
  {
    "slug": "czym-kierowac-sie-przy-wyborze-urzadzenia-do-druku-w-formacie-a3",
    "title": "Czym kierować się przy wyborze urządzenia do druku w formacie A3?"
  },
  {
    "slug": "na-co-zwrocic-uwage-przy-wyborze-wielofunkcyjnego-urzadzenia-drukujacego",
    "title": "Na co zwrócić uwagę przy wyborze wielofunkcyjnego urządzenia drukującego?"
  },
  {
    "slug": "dlaczego-w-biurach-dominuja-drukarki-laserowe",
    "title": "Dlaczego w biurach dominują drukarki laserowe?"
  },
  {
    "slug": "czy-kazda-cyfrowa-kserokopiarka-to-multi-function-printer",
    "title": "Czy każda cyfrowa kserokopiarka to multi-function printer?"
  },
  {
    "slug": "jakie-zalety-ma-czarno-biaa-drukarka-biurowa",
    "title": "Jakie zalety ma czarno-biała drukarka biurowa?"
  },
  {
    "slug": "audyt-optymalizacja-srodowiska-druku",
    "title": "Audyt i optymalizacja środowiska druku"
  },
  {
    "slug": "czy-w-biurze-potrzebna-jest-drukarka-obslugujaca-format-a3",
    "title": "Czy w biurze potrzebna jest drukarka obsługująca format A3?"
  },
  {
    "slug": "5-argumentow-za-wynajmem-biurowego-sprzetu-drukujacego",
    "title": "5 argumentów za wynajmem biurowego sprzętu drukującego"
  },
  {
    "slug": "jak-drukowac-ze-smartfona",
    "title": "Jak drukować ze smartfona?"
  },
  {
    "slug": "czym-kierowac-sie-przy-wyborze-urzadzen-drukujacych-do-firmy",
    "title": "Czym kierować się przy wyborze urządzeń drukujących do firmy?"
  },
  {
    "slug": "dks-na-viii-forum-kierownikow-it-w-administracji",
    "title": "DKS na VIII Forum Kierowników IT w Administracji"
  },
  {
    "slug": "jeden-dostawca-wiele-mozliwosci-dks",
    "title": "Jeden dostawca, wiele możliwości - DKS"
  },
  {
    "slug": "dks-na-7-ogolnopolskim-konwencie-informatykow-nowe-technologie-i-wyzwania-dla-administracji-publicznej",
    "title": "DKS na 7. Ogólnopolskim Konwencie Informatyków"
  },
  {
    "slug": "10-kwietnia-metropolitalne-targi-pracy",
    "title": "10 kwietnia - Metropolitalne Targi Pracy"
  },
  {
    "slug": "bezpieczenstwo-systemow-informatycznych-w-administracji-publicznej-na-vii-konwencie-informatykow-warmii-i-mazur",
    "title": "Bezpieczeństwo systemów informatycznych w administracji publicznej"
  },
  {
    "slug": "czym-rozni-sie-biurowy-i-poligraficzny-sprzet-drukujacy",
    "title": "Czym różni się biurowy i poligraficzny sprzęt drukujący?"
  },
  {
    "slug": "eko-optymalizacja-w-praktyce",
    "title": "Eko-optymalizacja w praktyce"
  },
  {
    "slug": "tak-bylo-czyli-podsumowanie-cyklu-dni-otwartych-2019r",
    "title": "Tak było, czyli podsumowanie cyklu dni otwartych 2019"
  },
  {
    "slug": "cyfrowa-rewolucja-odkryj-nowe-horyzonty-w-swiecie-opakowan",
    "title": "Cyfrowa rewolucja - odkryj nowe horyzonty w świecie opakowań"
  },
  {
    "slug": "dks-na-targach-festiwaldruku-pl",
    "title": "DKS na targach FestiwalDruku.pl"
  },
  {
    "slug": "dks-partnerem-bitwy-bramkarskiej-2019",
    "title": "DKS partnerem Bitwy Bramkarskiej 2019"
  },
  {
    "slug": "gala-z-okazji-30-lecia-istnienia-dks",
    "title": "Gala z okazji 30-lecia istnienia DKS"
  },
  {
    "slug": "wynajem-kserokopiarki-sposob-na-oszczednosci-w-twojej-firmie",
    "title": "Wynajem kserokopiarki - sposób na oszczędności w Twojej firmie"
  },
  {
    "slug": "jak-ograniczyc-koniecznosc-wzywania-serwisanta-urzadzen-wielofunkcyjnych",
    "title": "Jak ograniczyć konieczność wzywania serwisanta urządzeń wielofunkcyjnych?"
  },
  {
    "slug": "kserokopiarki-na-czym-polega-dzierzawa",
    "title": "Kserokopiarki - na czym polega dzierżawa?"
  },
  {
    "slug": "czy-tonery-i-serwis-sa-wliczone-w-cene-wynajmu-kserokopiarki",
    "title": "Czy tonery i serwis są wliczone w cenę wynajmu kserokopiarki?"
  },
  {
    "slug": "jaka-wybrac-kserokopiarke",
    "title": "Jaką wybrać kserokopiarkę?"
  },
  {
    "slug": "urzadzenie-wielofunkcyjne-kserokopiarka-a4-a3-czy-drukarka",
    "title": "Urządzenie wielofunkcyjne, kserokopiarka A4, A3 czy drukarka?"
  },
  {
    "slug": "kserokopiarka-do-szkoly-jak-wybrac",
    "title": "Kserokopiarka do szkoły - jak wybrać?"
  },
  {
    "slug": "polecani-producenci-kserokopiarek",
    "title": "Polecani producenci kserokopiarek"
  },
  {
    "slug": "jaka-drukarka-do-malej-i-sredniej-firmy",
    "title": "Jaka drukarka do małej i średniej firmy?"
  },
  {
    "slug": "dlaczego-warto-drukowac-w-kolorze",
    "title": "Dlaczego warto drukować w kolorze?"
  },
  {
    "slug": "kserokopiarki-zakup-czy-wynajem",
    "title": "Kserokopiarki - zakup czy wynajem?"
  },
  {
    "slug": "kserokopiarka-niezbedne-wyposazenie-biura",
    "title": "Kserokopiarka - niezbędne wyposażenie biura"
  },
  {
    "slug": "skanowanie-co-warto-wiedziec",
    "title": "Skanowanie - co warto wiedzieć?"
  },
  {
    "slug": "dks-na-targach-remadays-13-15-lutego-2019",
    "title": "DKS na targach RemaDays 13-15 lutego 2019"
  },
  {
    "slug": "gala-z-okazji-25-lecia-istnienia-dks",
    "title": "Gala z okazji 25-lecia istnienia DKS"
  },
  {
    "slug": "dks-na-targach-paperworld-2019-frankfurt",
    "title": "DKS na targach Paperworld 2019 Frankfurt"
  },
  {
    "slug": "rodzaje-ploterow-wielkoformatowych-jaki-wybrac-ploter",
    "title": "Rodzaje ploterów wielkoformatowych - jaki ploter wybrać?"
  },
  {
    "slug": "zarzadzanie-i-bezpieczenstwo-druku",
    "title": "Zarządzanie i bezpieczeństwo druku"
  },
  {
    "slug": "funkcje-kserokopiarki",
    "title": "Funkcje kserokopiarki"
  },
  {
    "slug": "korzysci-systemow-accoutingowych-jak-latwo-zarzadzac-wydrukiem-skanem-i-kopia",
    "title": "Korzyści systemów accountingowych - jak zarządzać wydrukiem, skanem i kopią?"
  },
  {
    "slug": "dni-otwarte-dks-poznan-1-2-pazdziernika-2019",
    "title": "Dni otwarte DKS Poznań 1-2 października 2019"
  },
  {
    "slug": "bezpieczenstwo-druku-jak-zadbac-o-dane",
    "title": "Bezpieczeństwo druku - jak zadbać o dane?"
  },
  {
    "slug": "dks-print-evolution-journey-premiery-i-znane-rozwiazania-na-remadays",
    "title": "DKS Print Evolution Journey - premiery i znane rozwiązania na RemaDays"
  },
  {
    "slug": "kamera-termowizyjna-mobotix-m16tb-wykrywajaca-osoby-z-podwyzszona-temperatura",
    "title": "Kamera termowizyjna Mobotix M16TB wykrywająca osoby z podwyższoną temperaturą"
  },
  {
    "slug": "najnowsze-drukarki-hp",
    "title": "Najnowsze drukarki HP"
  },
  {
    "slug": "jak-dziala-kserokopiarka",
    "title": "Jak działa kserokopiarka?"
  },
  {
    "slug": "kserokopiarka-mono-czy-kolor",
    "title": "Kserokopiarka mono czy kolor?"
  }
]$agency_json$::jsonb)
    AS x(slug text, title text)
)
UPDATE news n
SET title = e.title
FROM expected e
WHERE n.slug = e.slug;

-- 4. Update blog article meta titles.
WITH expected AS (
  SELECT * FROM jsonb_to_recordset($agency_json$[
  {
    "slug": "cyfrowa-rewolucja-odkryj-nowe-horyzonty-w-swiecie-opakowan",
    "seo_title": "Cyfrowa rewolucja w świecie opakowań | Blog DKS"
  }
]$agency_json$::jsonb)
    AS x(slug text, seo_title text)
)
UPDATE news n
SET seo_title = e.seo_title
FROM expected e
WHERE n.slug = e.slug;

-- 5. Update product meta titles.
WITH expected AS (
  SELECT * FROM jsonb_to_recordset($agency_json$[
  {
    "slug": "im-c2010",
    "seo_title": "IM C2010 | DKS"
  },
  {
    "slug": "xc-2335",
    "seo_title": "XC-2335 | DKS"
  },
  {
    "slug": "xm5370",
    "seo_title": "XM5370 | DKS"
  },
  {
    "slug": "m3346",
    "seo_title": "M3346 | DKS"
  },
  {
    "slug": "bizhub-3602p",
    "seo_title": "Bizhub 3602P | Konica Minolta | DKS"
  },
  {
    "slug": "bizhub-4752",
    "seo_title": "Bizhub 4752 | Konica Minolta | DKS"
  },
  {
    "slug": "bizhub-c287",
    "seo_title": "Bizhub C287 | Konica Minolta | DKS"
  },
  {
    "slug": "accuriopress-c4080",
    "seo_title": "AccurioPress C4080 | Konica Minolta | DKS"
  },
  {
    "slug": "accuriopress-c2060",
    "seo_title": "AccurioPress C2060 | Konica Minolta | DKS"
  },
  {
    "slug": "bizhub-4000i",
    "seo_title": "Bizhub 4000i | Konica Minolta | DKS"
  },
  {
    "slug": "bizhub-c300i",
    "seo_title": "Bizhub C300i | Konica Minolta | DKS"
  },
  {
    "slug": "bizhub-c558",
    "seo_title": "Bizhub C558 | Konica Minolta | DKS"
  },
  {
    "slug": "accurio-press-c5080",
    "seo_title": "AccurioPress C5080 | Konica Minolta | DKS"
  },
  {
    "slug": "bizhub-c308",
    "seo_title": "Bizhub C308 | Konica Minolta | DKS"
  },
  {
    "slug": "bizhub-c451i",
    "seo_title": "Bizhub C451i | Konica Minolta | DKS"
  },
  {
    "slug": "accuriowide-200",
    "seo_title": "AccurioWide 200 | Konica Minolta | DKS"
  },
  {
    "slug": "accurio-label-230",
    "seo_title": "AccurioLabel 230 | Konica Minolta | DKS"
  },
  {
    "slug": "accurio-label-400",
    "seo_title": "AccurioLabel 400 | Konica Minolta | DKS"
  },
  {
    "slug": "xc9235",
    "seo_title": "Lexmark XC9235 | Lexmark | DKS"
  },
  {
    "slug": "xc4150",
    "seo_title": "Lexmark XC4150 | Lexmark | DKS"
  },
  {
    "slug": "xc6152",
    "seo_title": "Lexmark XC6152 | Lexmark | DKS"
  },
  {
    "slug": "hp-design-jet-t850-mfp",
    "seo_title": "HP DesignJet T850 MFP | HP | DKS"
  },
  {
    "slug": "hp-design-jet-t2600-ps-36-in-mfp",
    "seo_title": "HP DesignJet T2600 PS 36-in MFP | HP | DKS"
  },
  {
    "slug": "hp-design-jet-z9",
    "seo_title": "HP DesignJet Z9 | HP | DKS"
  },
  {
    "slug": "hp-design-jet-t950-mfp",
    "seo_title": "HP DesignJet T950 MFP | HP | DKS"
  },
  {
    "slug": "image-press-v1000",
    "seo_title": "Canon imagePRESS V1000 | Canon | DKS"
  },
  {
    "slug": "canon-image-press-v1350",
    "seo_title": "Canon imagePRESS V1350 | Canon | DKS"
  },
  {
    "slug": "canon-image-press-v900",
    "seo_title": "Canon imagePRESS V900 | Canon | DKS"
  },
  {
    "slug": "image-prograf-tx-3200",
    "seo_title": "Canon imagePROGRAF TX-3200 | Canon | DKS"
  },
  {
    "slug": "image-prograf-tm-255",
    "seo_title": "Canon imagePROGRAF TM-255 | Canon | DKS"
  },
  {
    "slug": "colorpainter-m-64s",
    "seo_title": "ColorPainter M-64s | DKS"
  },
  {
    "slug": "estefold-2300",
    "seo_title": "Estefold 2300 | DKS"
  },
  {
    "slug": "estefold-2300w",
    "seo_title": "Estefold 2300W | DKS"
  },
  {
    "slug": "revoria-press-pc-1120",
    "seo_title": "Revoria Press PC1120 | DKS"
  }
]$agency_json$::jsonb)
    AS x(slug text, seo_title text)
)
UPDATE products p
SET seo_title = e.seo_title
FROM expected e
WHERE p.slug = e.slug;

-- 6. Update product self-canonicals.
UPDATE products
SET canonical = 'https://dks.pl/oferta/produkty/' || slug
WHERE slug IS NOT NULL
  AND slug <> '';

-- 7. Update event meta titles.
WITH expected AS (
  SELECT * FROM jsonb_to_recordset($agency_json$[
  {
    "slug": "cyfrowa-rewolucja",
    "seo_title": "Cyfrowa rewolucja - wydarzenie DKS"
  }
]$agency_json$::jsonb)
    AS x(slug text, seo_title text)
)
UPDATE events_create ev
SET seo_title = e.seo_title
FROM expected e
WHERE ev.slug = e.slug;

-- 8. Update event H1/name values and linked hero titles where a hero exists.
WITH expected AS (
  SELECT * FROM jsonb_to_recordset($agency_json$[
  {
    "slug": "remadays",
    "name": "RemaDays"
  },
  {
    "slug": "cyfrowa-rewolucja",
    "name": "Cyfrowa rewolucja"
  },
  {
    "slug": "akademia-dks",
    "name": "Akademia DKS"
  },
  {
    "slug": "ekologia-przyszlosci-ekoinwestycje-droga-do-sukcesu",
    "name": "Ekologia przyszłości - ekoinwestycje drogą do sukcesu"
  }
]$agency_json$::jsonb)
    AS x(slug text, name text)
)
UPDATE events_create ev
SET name = e.name
FROM expected e
WHERE ev.slug = e.slug;

WITH expected AS (
  SELECT * FROM jsonb_to_recordset($agency_json$[
  {
    "slug": "remadays",
    "name": "RemaDays"
  },
  {
    "slug": "cyfrowa-rewolucja",
    "name": "Cyfrowa rewolucja"
  },
  {
    "slug": "akademia-dks",
    "name": "Akademia DKS"
  },
  {
    "slug": "ekologia-przyszlosci-ekoinwestycje-droga-do-sukcesu",
    "name": "Ekologia przyszłości - ekoinwestycje drogą do sukcesu"
  }
]$agency_json$::jsonb)
    AS x(slug text, name text)
)
UPDATE hero_section h
SET title = e.name
FROM expected e
JOIN events_create ev ON ev.slug = e.slug
JOIN events_create_components_event_1 rel
  ON rel.events_create_id = ev.id
  AND rel.collection = 'hero_section'
WHERE h.id = nullif(rel.item, '')::int;

-- 9. Update promotion meta titles if present in guidelines.
WITH expected AS (
  SELECT * FROM jsonb_to_recordset($agency_json$[]$agency_json$::jsonb)
    AS x(slug text, seo_title text)
)
UPDATE promotions pr
SET seo_title = e.seo_title
FROM expected e
WHERE pr.slug = e.slug;

-- 10. Update promotion hero H1 values if present in guidelines. Do not update promotions.name.
WITH expected AS (
  SELECT * FROM jsonb_to_recordset($agency_json$[]$agency_json$::jsonb)
    AS x(slug text, title text)
)
UPDATE hero_section h
SET title = e.title
FROM expected e
JOIN promotions pr ON pr.slug = e.slug
JOIN promotions_components_promotions rel
  ON rel.promotions_id = pr.id
  AND rel.collection = 'hero_section'
WHERE h.id = nullif(rel.item, '')::int;

COMMIT;

-- Verification summary. Run after migration.
WITH product_check AS (
  SELECT count(*) AS total,
         count(*) FILTER (WHERE canonical IS NULL OR canonical = '') AS missing_canonical,
         count(*) FILTER (WHERE canonical IS DISTINCT FROM 'https://dks.pl/oferta/produkty/' || slug) AS canonical_mismatches
  FROM products
  WHERE slug IS NOT NULL AND slug <> ''
)
SELECT * FROM product_check;
