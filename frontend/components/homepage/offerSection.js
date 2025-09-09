import Link from 'next/link';
import IconElement from '../elements/iconElement';

const styleLink = 'text-dks-red underline';
export default function OfferSection() {
  return (
    <section className="md:max-w-screen-xl pt-10">
      <div className="px-3 md:px-4">
        <h1 className="text-center text-3xl md:text-5xl font-bold">
          DKS – dostawca sprzętu do druku biurowego, poligraficznego i wielkoformatowego
        </h1>
        <p className="text-dks-font-gray text-sm mt-8 leading-relaxed">
          Jesteśmy
          {' '}
          <strong>
            czołowym polskim
            dostawcą sprzętu drukującego
          </strong>
          {' '}
          czterech
          renomowanych marek: Canon, Lexmark, HP i Konica Minolta.
          Oferujemy nowe i używane urządzenia do użytku biurowego,
          do zastosowań poligraficznych i druku wielkoformatowego.
          Dostarczamy drukarki i
          {' '}
          <a
            className={styleLink}
            title="urządzenia wielofunkcyjne do biura"
            href="https://www.dks.pl/oferta/rozwiazania-dla-biura/"
            target="_self"
          >
            urządzenia wielofunkcyjne do biura
          </a>
          , kserokopiarki,
          skanery i niszczarki. W naszej ofercie znajdziesz też oprogramowanie
          do zarządzania drukiem, skanowaniem i obiegiem dokumentów.
        </p>
        <p className="text-dks-font-gray text-sm mt-8 leading-relaxed">
          Niezwykle ważną i różnorodną częścią naszej oferty są
          {' '}
          <strong>
            maszyny
            do wysokonakładowego druku produkcyjnego
          </strong>
          . Dostarczamy drukarki
          i
          {' '}
          <a
            className={styleLink}
            title="sprzęt poligraficzny"
            href="https://www.dks.pl/oferta/rozwiazania-dla-poligrafii"
            target="_self"
          >
            sprzęt poligraficzny
          </a>
          {' '}
          dla drukarń cyfrowych.
          Instalujemy maszyny i przeprowadzamy rozruch systemów druku
          u naszych Klientów. Obok urządzeń drukujących wprowadziliśmy
          do oferty maszyny introligatorskie cenionej na całym świecie marki Duplo.
        </p>
        <p className="text-dks-font-gray text-sm mt-8 leading-relaxed">
          Ostatni z trzech głównych działów naszej oferty wypełniają
          {' '}
          <strong>
            wielkoformatowe
            urządzenia drukujące
          </strong>
          , szeroko wykorzystywane w usługach
          i branży reklamowej. Sprzedajemy m.in.
          skanery Contex, plotery tonerowe KIP,
          {' '}
          <a
            className={styleLink}
            title="składarki offline"
            href="https://www.dks.pl/oferta/rozwiazania-wielkoformatowe"
            target="_self"
          >
            składarki offline
          </a>
          {' '}
          es-te, plotery atramentowe Océ, OKI,
          Canon, Konica Minolta.
        </p>
        <h2 className="font-bold pt-8">Sprzedaż i dzierżawa nowych i używanych maszyn drukujących</h2>
        <p className="text-dks-font-gray text-sm mt-8 leading-relaxed">
          Sprzedajemy
          {' '}
          <strong>nowy i używany (poleasingowy) sprzęt drukujący</strong>
          .
          Alternatywą dla zakupu jest
          {' '}
          <a
            className={styleLink}
            title="wynajem urządzeń wielofunkcyjnych"
            href="https://www.dks.pl/wynajem-urzadzen-wielofunkcyjnych"
            target="_self"
          >
            wynajem urządzeń wielofunkcyjnych
          </a>
          : zamieniasz
          kosztowną inwestycję na miesięczną opłatę czynszową.
        </p>
        <p className="text-dks-font-gray text-sm mt-8 leading-relaxed">
          Wszystkie
          {' '}
          <strong>
            używane maszyny drukujące są drobiazgowo sprawdzane, naprawiane
            i testowane
          </strong>
          . Oszczędzasz pieniądze i masz pewność długiej,
          niezawodnej pracy. W przypadku nowych maszyn zabezpieczeniem
          przed kosztami awarii jest gwarancja. Z myślą o użytkownikach sprzętu
          w okresie pogwarancyjnym stworzyliśmy
          {' '}
          <a
            className={styleLink}
            title="Kontrakt Obsługi Serwisowej"
            href="https://www.dks.pl/kontrakt-obslugi-serwisowej"
            target="_self"
          >
            Kontrakt Obsługi Serwisowej
          </a>
          . Naszym celem jest zabezpieczenie
          komfortu i poczucia bezpieczeństwa ekonomicznego wszystkich użytkowników.
        </p>
        <h2>Jesteśmy blisko naszych Klientów</h2>
        <p className="text-dks-font-gray text-sm mt-8 leading-relaxed">
          Prowadzimy
          {' '}
          <strong>
            12 oddziałów
            w największych miastach wojewódzkich w Polsce
          </strong>
          . Jesteśmy blisko
          naszych Klientów. Dzięki temu możemy skrócić znacznie czas realizacji zamówień
          i zagwarantować błyskawiczną reakcję serwisową.
          Prowadzimy
          {' '}
          <strong>serwis urządzeń wielofunkcyjnych</strong>
          ,
          {' '}
          maszyn produkcyjnych
          i drukarek wielkoformatowych.
        </p>
        <p className="text-dks-font-gray text-sm mt-8 leading-relaxed">
          Zapraszamy do kontaktu telefonicznego, mailowego i wizyt w oddziałach DKS!
        </p>
      </div>
      <div className="flex sm:flex-col justify-between my-16 text-center mx-3 sm:space-y-6 md:space-x-4 md-h-64">
        <Link href="/oferta/rozwiazania-dla-biura">
          <a href="/oferta/rozwiazania-dla-biura">
            <IconElement
              icon="/static/homepage/1.svg"
              name="Rozwiązania dla biura"
              subtitle="Kolorowe i czarno-białe urządzenia wielofunkcyjne, drukarki, niszczarki"
            />
          </a>
        </Link>
        <Link href="/oferta/rozwiazania-dla-poligrafii">
          <a href="/oferta/rozwiazania-dla-poligrafii">
            <IconElement
              icon="/static/homepage/2.svg"
              name="Rozwiązania dla poligrafii"
              subtitle="Maszyny produkcyjne, bigówki, oklejarki, foliarki, falcerki, gilotyny"
            />
          </a>
        </Link>
        <Link href="/oferta/rozwiazania-wielkoformatowe">
          <a href="/oferta/rozwiazania-wielkoformatowe">
            <IconElement
              icon="/static/homepage/3.svg"
              name="Rozwiązania wielkoformatowe"
              subtitle="Plotery, skanery, drukarki wielkoformatowe"
            />
          </a>
        </Link>
        <Link href="/materialy-eksploatacyjne">
          <a href="/materialy-eksploatacyjne">
            <IconElement
              icon="/static/homepage/4.svg"
              name="Materiały eksploatacyjne"
              subtitle="Tonery, developery, bębny, tusze, części zamienne"
            />
          </a>
        </Link>
        <Link href="/oferta/oprogramowanie-dla-biura">
          <a href="/oferta/oprogramowanie-dla-biura">
            <IconElement
              icon="/static/homepage/5.svg"
              name="Oprogramowanie dla biura"
              subtitle="Oprogramowanie do zarządzania drukiem, accountingowe, OCR"
            />
          </a>
        </Link>
        <Link href="/oferta/oprogramowanie-dla-poligrafii-i-cad-gis">
          <a href="/oferta/oprogramowanie-dla-poligrafii-i-cad-gis">
            <IconElement
              icon="/static/homepage/5.svg"
              name="Oprogramowanie dla poligrafii, CAD/GIS"
              subtitle="Oprogramowanie do profesjonalnych wydruków, oprogramowanie do skanowania"
            />
          </a>
        </Link>
      </div>
    </section>
  );
}
