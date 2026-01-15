import type { Metadata } from "next";
import Breadcrumb from "../oferta/components/Breadcrumb";
import HeroSection from "../(marketing)/HeroSection";

export const metadata: Metadata = {
  title: "Regulamin płatności online – DKS",
  description:
    "Regulamin płatności online realizowanych za pośrednictwem linku do płatności w systemie imoje.",
  alternates: { canonical: "/regulamin-platnosci-online" },
};

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="self-stretch flex flex-col gap-6 lg:flex-row lg:items-start lg:gap-12">
      <div className="w-full lg:w-80 flex items-center gap-2.5">
        <div className="w-full text-black text-2xl font-semibold leading-7">
          {title}
        </div>
      </div>

      <div className="flex-1 text-black text-base font-normal leading-5">
        {children}
      </div>
    </div>
  );
}

function P({ children }: { children: React.ReactNode }) {
  return <p className="text-black text-base font-normal leading-5">{children}</p>;
}

function Strong({ children }: { children: React.ReactNode }) {
  return (
    <strong className="text-black text-base font-semibold leading-5">
      {children}
    </strong>
  );
}

function LinkA({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      className="text-black text-base font-normal underline leading-5 break-words"
      target="_blank"
      rel="noreferrer"
    >
      {children}
    </a>
  );
}

export default function RegulaminPlatnosciOnlinePage() {
  const imojeRegulamin =
    "https://data.imoje.pl/docs/imoje_regulamin_platnosci.pdf";
  const imojeRodo =
    "https://data.imoje.pl/docs/imoje_informacja_administratora_danych_osobowych.pdf";

  return (

    <>
        <Breadcrumb />

        <HeroSection
        title="Klauzula Ochrony Danych / Data Protection"
        backgroundImage="/static/homepage/Header.webp"
        contentPosition="left"
        />
        <div className="w-full px-6 md:px-12 xl:px-28 py-20 bg-white flex flex-col justify-start items-start gap-12 overflow-hidden">
        <Section title="1. Definicje">
            <div className="flex flex-col gap-4">
            <P>
                <Strong>DKS</Strong>
                {" – "}
                DKS Spółka z ograniczoną odpowiedzialnością z siedzibą w Kowalach,
                adres: ul. Energetyczna 15, 80-180 Kowale, zarejestrowana w rejestrze
                przedsiębiorców Krajowego Rejestru Sądowego, prowadzonego przez Sąd
                Rejonowy Gdańsk-Północ w Gdańsku, VII Wydział Gospodarczy Krajowego
                Rejestru Sądowego, pod numerem KRS: 0000099557, posiadająca nr:
                REGON: 190917946 i nr NIP: 5832790417.
            </P>

            <P>
                <Strong>Klient</Strong>
                {" – "}
                osoby fizyczne prowadzące działalność gospodarczą, z wyłączeniem osób
                fizycznych prowadzących działalność gospodarczą zawierających umowę
                sprzedaży związaną z prowadzoną działalnością gospodarczą, z której
                treści wynika, że nie posiada ona dla nich charakteru zawodowego,
                osoby prawne lub jednostki organizacyjne nieposiadające osobowości
                prawnej, ale posiadające zdolność prawną, z którymi DKS zawarł umowę
                sprzedaży towaru, umowę najmu urządzeń, umowę dzierżawy urządzeń,
                umowę ramową najmu urządzeń lub umowę o świadczenie usług serwisowych.
            </P>

            <P>
                <Strong>Operator Płatności</Strong>
                {" – "}
                ING Bank Śląski Spółka Akcyjna z siedzibą w Katowicach, adres: ul.
                Sokolska 34, 40-086 Katowice, zarejestrowana w rejestrze
                przedsiębiorców Krajowego Rejestru Sądowego, prowadzonego przez Sąd
                Rejonowy Katowice - Wschód w Katowicach, VIII Wydział Gospodarczy
                Krajowego Rejestru Sądowego, pod numerem KRS: 0000005459, posiadająca
                nr REGON: 271514909 i nr NIP: 6340135475, obsługująca płatność
                realizowaną przez Klienta online za pośrednictwem linku do płatności
                w systemie imoje.
            </P>

            <P>
                <Strong>Regulamin Operatora Płatności</Strong>
                {" – "}
                regulamin wydany przez Operatora Płatności, dot. realizacji płatności
                online za pośrednictwem linku do płatności w systemie imoje, dostępny
                pod adresem: <LinkA href={imojeRegulamin}>{imojeRegulamin}</LinkA>.
            </P>

            <P>
                <Strong>Umowa</Strong>
                {" – "}
                umowa sprzedaży urządzeń, umowa najmu urządzeń, umowa dzierżawy
                urządzeń, umowa ramowa najmu urządzeń lub umowa o świadczenie usług
                serwisowych zawarta przez DKS z Klientem w formie pisemnej.
            </P>
            </div>
        </Section>

        <Section title="2. Rodzaje należności, za które możliwe jest dokonywanie płatności online">
            <div className="flex flex-col gap-4">
            <P>
                Klient ma możliwość dokonania płatności online z tytułu należności
                pieniężnych wynikających z Umowy, w tym w szczególności dot. ceny
                zakupu towarów, czynszu najmu, opłat za wydruki czarno-białe i
                kolorowe oraz opłat za usługi serwisowe, zgodnie z zawartymi w Umowie
                warunkami płatności.
                <br />
                Ceny widniejące w bramce płatniczej, służącej do dokonywania
                płatności, ustalone są na podstawie kosztów uzgodnionych
                indywidualnie z Klientem w zawartej z nim Umowie i wystawionej na ich
                podstawie odpowiedniej fakturze VAT.
                <br />
                Ceny z tytułu zakupu towarów ustalane są z Klientem indywidualnie, po
                wcześniejszej wycenie zamówienia. Wysokość ceny uwarunkowana jest
                rodzajem towaru, wielkością zamówienia oraz kosztami dostawy (z
                uwzględnieniem rozmiaru przesyłki). Klient informowany jest o
                kosztach przed zawarciem umowy sprzedaży.
                <br />
                Ceny kosztów usług realizowanych przez DKS ustalane są z Klientem
                indywidualnie na podstawie łączących go umów najmu urządzeń, umów
                dzierżawy urządzeń, umów ramowych najmu urządzeń lub umów o
                świadczenie usług serwisowych zawartych w formie pisemnej. Wysokość
                ceny uwarunkowana jest rodzajem usług, zakresem czynności
                wykonywanych w ramach danej usługi i czasem trwania realizowanych
                usług. Klient informowany jest o kosztach przed zawarciem umowy najmu
                urządzeń, umowy dzierżawy urządzeń, umowy ramowej najmu urządzeń lub
                umowy o świadczenie usług serwisowych.
                <br />
                Klienci mogą sprawdzić wszystkie ceny zakupu towarów lub usług oraz
                ewentualnych kosztów dostawy przed dokonaniem płatności.
            </P>
            </div>
        </Section>

        <Section title="3. Akceptowane metody płatności">
            <div className="flex flex-col gap-4">
            <P>
                Klient ma możliwość dokonania płatności z tytułu należności pieniężnych
                wynikających z Umowy za pośrednictwem przelewu elektronicznego poprzez
                zewnętrzny system płatności imoje, obsługiwany przez Operatora
                Płatności, na podstawie przesłanego mu przez DKS linku do płatności.
                <br />
                Płatność za pośrednictwem linku do systemu płatności imoje może zostać
                dokonana w jednej z następujących form płatności:
            </P>

            <div className="text-black text-base font-normal leading-5">
                przelew online,
                <br />
                płatności BLIK,
                <br />
                karta płatnicza.
            </div>
            </div>
        </Section>

        <Section title="4. Sposób dokonywania płatności">
            <div className="flex flex-col gap-4">
            <P>
                Płatność jest dokonywana przez Klienta poprzez kliknięcie w przesłany
                mu przez DKS link do zewnętrznego systemu płatności imoje. Klient w
                celu dokonania płatności winien podać dane obejmujące:
            </P>

            <div className="text-black text-base font-normal leading-5">
                imię i nazwisko,
                <br />
                numer telefonu,
                <br />
                adres e-mail.
            </div>

            <P>
                Klient w celu dokonania płatności jest zobowiązany do wyboru jednej z
                form płatności, o której mowa w pkt. 3 powyżej.
                <br />
                Przed dokonaniem płatności Klient winien zapoznać się z Regulaminem
                Operatora Płatności dostępnym pod adresem:{" "}
                <LinkA href={imojeRegulamin}>{imojeRegulamin}</LinkA> oraz informacją o
                ochronie danych osobowych Operatora Płatności dostępną pod adresem:{" "}
                <LinkA href={imojeRodo}>{imojeRodo}</LinkA>, a także do złożenia
                oświadczenia o zapoznaniu się z ich treścią za pomocą zaznaczenia
                odpowiedniego pola dostępnego w bramce płatniczej.
                <br />
                Przelew dokonywany jest po kliknięciu w przycisk „Zapłać” oraz
                wykonaniu dalszych kroków uwierzytelniających płatność zgodnie z
                procedurą płatności wymaganą przez formę płatności wybraną przez
                Klienta zgodnie z pkt. 3.
            </P>
            </div>
        </Section>

        <Section title="5. Odstąpienie od Umowy i reklamacje z tytułu Umowy">
            <P>
            Warunki odstąpienia od Umowy, w tym koszt przesyłki związany ze zwrotem
            towaru spowodowanego odstąpieniem od Umowy, są uregulowane w treści
            zawartej przez Klienta Umowy.
            <br />
            Warunki zgłoszenia reklamacji związanej z realizacją Umowy są
            uregulowane w treści zawartej przez Klienta Umowy.
            </P>
        </Section>

        <Section title="6. Dane osobowe">
            <div className="flex flex-col gap-4">
            <P>
                Podanie danych osobowych, o których mowa w pkt. 4 jest dobrowolne,
                ale konieczne w celu dokonania płatności online.
                <br />
                Administratorem danych osobowych podanych w związku z dokonywaniem
                płatności jest ING Bank Śląski Spółka Akcyjna z siedzibą w Katowicach,
                adres: ul. Sokolska 34, 40-086 Katowice, zarejestrowana w rejestrze
                przedsiębiorców Krajowego Rejestru Sądowego, prowadzonego przez Sąd
                Rejonowy Katowice - Wschód w Katowicach, VIII Wydział Gospodarczy
                Krajowego Rejestru Sądowego, pod numerem KRS: 0000005459, posiadająca
                nr REGON: 271514909 i nr NIP: 6340135475.
                <br />
                Informacje na temat przetwarzania danych osobowych podanych w związku
                z realizacją płatności online dostępne są pod adresem:{" "}
                <LinkA href={imojeRodo}>{imojeRodo}</LinkA>
            </P>

            <P>
                Administratorem danych osobowych podanych przez Klienta w związku z
                realizacją Umowy jest DKS Spółka z ograniczoną odpowiedzialnością z
                siedzibą w Kowalach, adres: ul. Energetyczna 15, 80-180 Kowale,
                zarejestrowana w rejestrze przedsiębiorców Krajowego Rejestru
                Sądowego, prowadzonego przez Sąd Rejonowy Gdańsk-Północ w Gdańsku, VII
                Wydział Gospodarczy Krajowego Rejestru Sądowego, pod numerem KRS:
                0000099557, posiadająca nr REGON: 190917946 i nr NIP: 5832790417.
                Dane te są przetwarzane na podstawie i zgodnie z postanowieniami Umowy
                oraz Klauzuli Ochrony Danych Osobowych dostępnej na stronie:{" "}
                <LinkA href="https://dks.pl/klauzula-ochrony-danych-data-protection">
                https://dks.pl/klauzula-ochrony-danych-data-protection
                </LinkA>
                .
            </P>
            </div>
        </Section>

        <Section title="7. Sposób zgłaszania reklamacji dot. płatności">
            <P>
            W przypadku problemów z realizacją płatności, Klient powinien w pierwszej
            kolejności skontaktować się z wydawcą swojego instrumentu płatniczego.
            <br />
            Klient ma również możliwość złożenia skargi do Operatora Płatności w
            przypadku świadczenia przez niego usług niezgodnie z postanowieniami
            Regulaminu Operatora Płatności.
            <br />
            Szczegóły dot. składania i rozpatrywania skarg przez Operatora Płatności
            dostępne są pod adresem:{" "}
            <LinkA href={imojeRegulamin}>{imojeRegulamin}</LinkA>
            <br />
            W przypadku pytań lub dodatkowych informacji, zachęcamy do kontaktu z
            naszym zespołem Obsługi Klienta.
            </P>
        </Section>
        </div>

    </>
  );
}