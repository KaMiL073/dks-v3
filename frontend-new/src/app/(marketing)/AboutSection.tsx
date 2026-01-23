import RichContentStatic from '@/components/RichContent';
import Image from 'next/image'; // Importujemy komponent Image

export default function AboutSection() {
const leftHtml = `<div>
  <strong >Jesteśmy blisko naszych Klientów</strong>
  <br/>
  <p>
    Prowadzimy 12 oddziałów w największych miastach wojewódzkich w Polsce. Jesteśmy blisko
    naszych Klientów. Dzięki temu możemy skrócić znacznie czas realizacji zamówień 
    i zagwarantować błyskawiczną reakcję serwisową. Prowadzimy serwis urządzeń 
    wielofunkcyjnych, maszyn produkcyjnych i drukarek wielkoformatowych.
    <br/> <br />
    Zapraszamy do kontaktu telefonicznego, mailowego i wizyt w oddziałach 
    DKS!ądzeń drukujących, ale nie chcą ponosić kosztów ich zakupu.
  </p>
</div>`;

const rightHtml = `<div>
  <strong>Sprzedaż i dzierżawa nowych i używanych maszyn drukujących</strong>
  <p>
    Sprzedajemy nowy i używany (poleasingowy) sprzęt drukujący. Alternatywą 
    dla zakupu jest wynajem urządzeń wielofunkcyjnych: zamieniasz kosztowną 
    inwestycję na miesięczną opłatę czynszową.
  </p>
  <br />
  <p>
    Wszystkie używane maszyny drukujące są drobiazgowo sprawdzane, naprawiane 
    i testowane. Oszczędzasz pieniądze i masz pewność długiej, niezawodnej 
    pracy. W przypadku nowych maszyn zabezpieczeniem przed kosztami awarii 
    jest gwarancja. Z myślą o użytkownikach sprzętu w okresie pogwarancyjnym 
    stworzyliśmy Kontrakt Obsługi Serwisowej. Naszym celem jest zabezpieczenie 
    komfortu i poczucia bezpieczeństwa ekonomicznego wszystkich użytkowników.
  </p>
</div>`;

  return (
    <section className="px-6 xl:px-28 py-20 bg-surface-page flex flex-col gap-8">
      <RichContentStatic
        image="/static/homepage/Obraz-a.webp"
        layout="text_left"
        content={`
          <div className="flex-1 text-Text-body text-base font-normal leading-tight">
          Jesteśmy czołowym polskim dostawcą sprzętu drukującego czterech renomowanych marek: Canon, Lexmark, HP i Konica Minolta. 
          Oferujemy nowe i używane urządzenia do użytku biurowego, do zastosowań poligraficznych i druku wielkoformatowego. 
          Dostarczamy drukarki i <span className="underline">urządzenia wielofunkcyjne do biura</span>, kserokopiarki, skanery i niszczarki. 
          W naszej ofercie znajdziesz też oprogramowanie do zarządzania drukiem, skanowaniem i obiegiem dokumentów.<br/>
          Niezwykle ważną i różnorodną częścią naszej oferty są maszyny do wysokonakładowego druku produkcyjnego. 
          Dostarczamy drukarki i <span className="underline">sprzęt poligraficzny</span> dla drukarń cyfrowych. 
          Instalujemy maszyny i przeprowadzamy rozruch systemów druku u naszych Klientów. 
          Obok urządzeń drukujących wprowadziliśmy do oferty maszyny introligatorskie cenionej na całym świecie marki Duplo.<br/>
          Ostatni z trzech głównych działów naszej oferty wypełniają wielkoformatowe urządzenia drukujące, szeroko wykorzystywane w usługach i branży reklamowej. 
          Sprzedajemy m.in. skanery Contex, plotery tonerowe KIP, <span className="underline">składarki offline</span> es-te, plotery atramentowe Océ, OKI, Canon, Konica Minolta.
          </div>
        `}
        expanded_columns={2}
        expand_left={leftHtml}
        expand_right={rightHtml}
        />

      {/* <div className="flex flex-col lg:flex-row gap-12">
        <div className="flex-1 text-Text-body text-base font-normal leading-tight">
          Jesteśmy czołowym polskim dostawcą sprzętu drukującego czterech renomowanych marek: Canon, Lexmark, HP i Konica Minolta. 
          Oferujemy nowe i używane urządzenia do użytku biurowego, do zastosowań poligraficznych i druku wielkoformatowego. 
          Dostarczamy drukarki i <span className="underline">urządzenia wielofunkcyjne do biura</span>, kserokopiarki, skanery i niszczarki. 
          W naszej ofercie znajdziesz też oprogramowanie do zarządzania drukiem, skanowaniem i obiegiem dokumentów.<br/>
          Niezwykle ważną i różnorodną częścią naszej oferty są maszyny do wysokonakładowego druku produkcyjnego. 
          Dostarczamy drukarki i <span className="underline">sprzęt poligraficzny</span> dla drukarń cyfrowych. 
          Instalujemy maszyny i przeprowadzamy rozruch systemów druku u naszych Klientów. 
          Obok urządzeń drukujących wprowadziliśmy do oferty maszyny introligatorskie cenionej na całym świecie marki Duplo.<br/>
          Ostatni z trzech głównych działów naszej oferty wypełniają wielkoformatowe urządzenia drukujące, szeroko wykorzystywane w usługach i branży reklamowej. 
          Sprzedajemy m.in. skanery Contex, plotery tonerowe KIP, <span className="underline">składarki offline</span> es-te, plotery atramentowe Océ, OKI, Canon, Konica Minolta.
        </div>

        <Image
          src="/static/homepage/Obraz-a.webp" 
          alt="Ilustracja firmy"
          // Używamy width i height podanych w URL (576x429)
          width={576} 
          height={429} 
          // Atrybut `className` jest przekazywany do elementu <img> generowanego przez Next.js
          className="flex-1 h-96 min-w-72 max-h-[1296px] min-h-96 object-contain"
          // Opcjonalnie: Dla placeholderów lub gdy obraz nie ma być optymalizowany
          unoptimized={true} 
        />
      </div>

      <div className="pr-2 py-4">
        <span className="text-Text-action text-base font-normal underline cursor-pointer">
          Czytaj dalej...
        </span>
      </div> */}
    </section>
  );
}