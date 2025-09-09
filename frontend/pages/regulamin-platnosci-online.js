import Layout from '../components/layouts/layout';
import HeaderTop from '../components/elements/headerTop';
import Breadcrumb from '../components/elements/breadcrumb';
import styles from '../styles/pages.module.scss';

const TITLE = 'Regulamin płatności online';
const DESCRIPTION = '';

export default function ServiceContract() {
  const attachments = [
    { href: `${process.env.assetsPath}c0bb826a-8774-4d2e-8eba-3920580ea415.pdf`, text: 'Formularz zgłoszenia nieprawidłowości w DKS sp. z o.o.' },

  ];

  return (
    <Layout title={TITLE} description={DESCRIPTION}>
      <HeaderTop title="Regulamin płatności online" />
      <div className="md:max-w-screen-xl px-4 xl:px-0">
        <Breadcrumb />
        <div className="flex sm:flex-col gap-x-6 my-8">
          <div className="w-full">
            <div className="flex sm:flex-col gap-6">
              <div className={`${styles.htmlContent}`}>
                <h2>1. Definicje</h2>
                <p><strong>DKS</strong> - DKS Spółka z ograniczoną odpowiedzialnością z siedzibą w Kowalach, adres: ul. Energetyczna 15, 80-180 Kowale, zarejestrowana w rejestrze przedsiębiorców Krajowego Rejestru Sądowego, prowadzonego przez Sąd Rejonowy Gdańsk-Północ w Gdańsku, VII Wydział Gospodarczy Krajowego Rejestru Sądowego, pod numerem KRS: 0000099557, posiadająca nr: REGON: 190917946 i nr NIP: 5832790417.</p>
                <p><strong>Klient</strong> - osoby fizyczne prowadzące działalność gospodarczą, z wyłączeniem osób fizycznych prowadzących działalność gospodarczą zawierających umowę sprzedaży związaną z prowadzoną działalnością gospodarczą, z której treści wynika, że nie posiada ona dla nich charakteru zawodowego, osoby prawne lub jednostki organizacyjne nieposiadające osobowości prawnej, ale posiadające zdolność prawną, z którymi DKS zawarł umowę sprzedaży towaru, umowę najmu urządzeń, umowę dzierżawy urządzeń, umowę ramową najmu urządzeń lub umowę o świadczenie usług serwisowych.</p>
                <p><strong>Operator Płatności</strong> – ING Bank Śląski Spółka Akcyjna z siedzibą w Katowicach, adres: ul. Sokolska 34, 40-086 Katowice, zarejestrowana w rejestrze przedsiębiorców Krajowego Rejestru Sądowego, prowadzonego przez Sąd Rejonowy Katowice - Wschód w Katowicach, VIII Wydział Gospodarczy Krajowego Rejestru Sądowego, pod numerem KRS: 0000005459, posiadająca nr REGON: 271514909 i nr NIP: 6340135475, obsługująca płatność realizowaną przez Klienta online za pośrednictwem linku do płatności w systemie imoje.</p>
                <p><strong>Regulamin Operatora Płatności</strong> – regulamin wydany przez Operator Płatności, dot. realizacji płatności online za pośrednictwem linku do płatności w systemie imoje, dostępny pod adresem: <a href="https://data.imoje.pl/docs/imoje_regulamin_platnosci.pdf">https://data.imoje.pl/docs/imoje_regulamin_platnosci.pdf</a>.</p>
                <p><strong>Umowa</strong> – umowa sprzedaży urządzeń, umowa najmu urządzeń, umowa dzierżawy urządzeń, umowa ramowa najmu urządzeń lub umowa o świadczenie usług serwisowych zawarta przez DKS z Klientem w formie pisemnej.</p>

                <h2>2. Rodzaje należności, za które możliwe jest dokonywanie płatności online</h2>
                <p>Klient ma możliwość dokonania płatności online z tytułu należności pieniężnych wynikających z Umowy, w tym w szczególności dot. ceny zakupu towarów, czynszu najmu, opłat za wydruki czarno-białe i kolorowe oraz opłat za usługi serwisowe, zgodnie z zawartymi w Umowie warunkami płatności.</p>
                <p>Ceny widniejące w bramce płatniczej, służącej do dokonywania płatności, ustalone są na podstawie kosztów uzgodnionych indywidualnie z Klientem w zawartej z nim Umowie i wystawionej na ich podstawie odpowiedniej fakturze VAT.</p>
                <p>Ceny z tytułu zakupu towarów ustalane są z Klientem indywidualnie, po wcześniejszej wycenie zamówienia. Wysokość ceny uwarunkowana jest rodzajem towaru, wielkością zamówienia oraz kosztami dostawy (z uwzględnieniem rozmiaru przesyłki). Klient informowany jest o kosztach przed zawarciem umowy sprzedaży.</p>
                <p>Ceny kosztów usług realizowanych przez DKS ustalane są z Klientem indywidualnie na podstawie łączących go umów najmu urządzeń, umów dzierżawy urządzeń, umów ramowych najmu urządzeń lub umów o świadczenie usług serwisowych zawartych w formie pisemnej. Wysokość ceny uwarunkowana jest rodzajem usług, zakresem czynności wykonywanych w ramach danej usługi i czasem trwania realizowanych usług. Klient informowany jest o kosztach przed zawarciem umowy najmu urządzeń, umowy dzierżawy urządzeń, umowy ramowej najmu urządzeń lub umowy o świadczenie usług serwisowych.</p>
                <p>Klienci mogą sprawdzić wszystkie ceny zakupu towarów lub usług oraz ewentualnych kosztów dostawy przed dokonaniem płatności.</p>

                <h2>3. Akceptowane metody płatności</h2>
                <p>Klient ma możliwość dokonania płatności z tytułu należności pieniężnych wynikających z Umowy za pośrednictwem przelewu elektronicznego poprzez zewnętrzny system płatności imoje, obsługiwany przez Operatora Płatności, na podstawie przesłanego mu przez DKS linku do płatności.</p>
                <p>Płatność za pośrednictwem linku do systemu płatności imoje może zostać dokonana w jednej z następujących form płatności:</p>
                <ul className="ml-4">
                    <li>przelew online,</li>
                    <li>płatności BLIK,</li>
                    <li>karta płatnicza.</li>
                </ul>

                <h2>4. Sposób dokonywania płatności</h2>
                <p>Płatność jest dokonywana przez Klienta poprzez kliknięcie w przesłany mu przez DKS link do zewnętrznego systemu płatności imoje. Klient w celu dokonania płatności winien podać dane obejmujące:</p>
                <ul className="ml-4">
                    <li>imię i nazwisko,</li>
                    <li>numer telefonu,</li>
                    <li>adres e-mail.</li>
                </ul>
                <p>Klient w celu dokonania płatności jest zobowiązany do wyboru jednej z form płatności, o której mowa w pkt. 3 powyżej.</p>
                <p>Przed dokonaniem płatności Klient winien zapoznać się z Regulaminem Operatora Płatności dostępnym pod adresem: <a href="https://data.imoje.pl/docs/imoje_regulamin_platnosci.pdf">https://data.imoje.pl/docs/imoje_regulamin_platnosci.pdf</a> oraz informacją o ochronie danych osobowych Operatora Płatności dostępną pod adresem: <a href="https://data.imoje.pl/docs/imoje_informacja_administratora_danych_osobowych.pdf">https://data.imoje.pl/docs/imoje_informacja_administratora_danych_osobowych.pdf</a>, a także do złożenia oświadczenia o zapoznaniu się z ich treścią za pomocą zaznaczenia odpowiedniego pola dostępnego w bramce płatniczej.</p>
                <p>Przelew dokonywany jest po kliknięciu w przycisk „Zapłać” oraz wykonaniu dalszych kroków uwierzytelniających płatność zgodnie z procedurą płatności wymaganą przez formę płatności wybraną przez Klienta zgodnie z pkt. 3.</p>

                <h2>5. Odstąpienie od Umowy i reklamacje z tytułu Umowy</h2>
                <p>Warunki odstąpienia od Umowy, w tym koszt przesyłki związany ze zwrotem towaru spowodowanego odstąpieniem od Umowy, są uregulowane w treści zawartej przez Klienta Umowy.</p>
                <p>Warunki zgłoszenia reklamacji związanej z realizacją Umowy są uregulowane w treści zawartej przez Klienta Umowy.</p>

                <h2>6. Dane osobowe</h2>
                <p>Podanie danych osobowych, o których mowa w pkt. 4 jest dobrowolne, ale konieczne w celu dokonania płatności online.</p>
                <p>Administratorem danych osobowych podanych w związku z dokonywaniem płatności jest ING Bank Śląski Spółka Akcyjna z siedzibą w Katowicach, adres: ul. Sokolska 34, 40-086 Katowice, zarejestrowana w rejestrze przedsiębiorców Krajowego Rejestru Sądowego, prowadzonego przez Sąd Rejonowy Katowice - Wschód w Katowicach, VIII Wydział Gospodarczy Krajowego Rejestru Sądowego, pod numerem KRS: 0000005459, posiadająca nr REGON: 271514909 i nr NIP: 6340135475.</p>
                <p>Informacje na temat przetwarzania danych osobowych podanych w związku z realizacją płatności online dostępne są pod adresem: <a href="https://data.imoje.pl/docs/imoje_informacja_administratora_danych_osobowych.pdf">https://data.imoje.pl/docs/imoje_informacja_administratora_danych_osobowych.pdf</a></p>
                <p>Administratorem danych osobowych podanych przez Klienta w związku z realizacją Umowy jest DKS Spółka z ograniczoną odpowiedzialnością z siedzibą w Kowalach, adres: ul. Energetyczna 15, 80-180 Kowale, zarejestrowana w rejestrze przedsiębiorców Krajowego Rejestru Sądowego, prowadzonego przez Sąd Rejonowy Gdańsk-Północ w Gdańsku, VII Wydział Gospodarczy Krajowego Rejestru Sądowego, pod numerem KRS: 0000099557, posiadająca nr REGON: 190917946 i nr NIP: 5832790417. Dane te są przetwarzane na podstawie i zgodnie z postanowieniami Umowy oraz Klauzuli Ochrony Danych Osobowych dostępnej na stronie: <a href="https://dks.pl/klauzula-ochrony-danych-data-protection">https://dks.pl/klauzula-ochrony-danych-data-protection</a>.</p>

                <h2>7. Sposób zgłaszania reklamacji dot. płatności</h2>
                <p>W przypadku problemów z realizacją płatności, Klient powinien w pierwszej kolejności skontaktować się z wydawcą swojego instrumentu płatniczego.</p>
                <p>Klient ma również możliwość złożenia skargi do Operatora Płatności w przypadku świadczenia przez niego usług niezgodnie z postanowieniami Regulaminu Operatora Płatności.</p>
                <p>Szczegóły dot. składania i rozpatrywania skarg przez Operatora Płatności dostępne są pod adresem: <a href="https://data.imoje.pl/docs/imoje_regulamin_platnosci.pdf">https://data.imoje.pl/docs/imoje_regulamin_platnosci.pdf</a></p>

                <p>W przypadku pytań lub dodatkowych informacji, zachęcamy do kontaktu z naszym zespołem Obsługi Klienta.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
