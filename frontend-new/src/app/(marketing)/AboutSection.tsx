import Image from 'next/image'; // Importujemy komponent Image

export default function AboutSection() {
  return (
    <section className="px-6 xl:px-28 py-20 bg-surface-page flex flex-col gap-8">
      <div className="flex flex-col lg:flex-row gap-12">
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

        {/* Użycie komponentu Image */}
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
      </div>
    </section>
  );
}