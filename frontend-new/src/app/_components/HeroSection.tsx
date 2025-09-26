import Image from "next/image";
import { Heading1 } from "./Typography/Heading1";
import { Heading5 } from "./Typography/Heading5";
import { Button } from "./Button";

export default function HeroSection() {
  return (
    <section
      className="w-full bg-cover bg-center"
      style={{ backgroundImage: 'url("/static/homepage/Header.webp")' }}
    >
      <div className="flex flex-col lg:flex-row items-start 2xl:items-center gap-6 lg:gap-12 
        px-4 sm:px-6 md:px-6 lg:px-8 xl:px-28 pt-8 lg:pt-20 mx-auto">
        <div className="flex-1 flex flex-col gap-4 lg:gap-8">
          <Heading1 variant="semibold">
            Twój partner w biznesie
          </Heading1>
          <Heading5 variant="normal">
            Sprawdzone technologie. Profesjonalne
            <br className="hidden lg:block" />
            wsparcie. Atrakcyjne ceny.
          </Heading5>
          <div className="flex">
            <Button>
              Zamów bezpłatny audyt
            </Button>
          </div>
        </div>

        <div className="flex-1 relative w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-2xl 
        xl:max-w-3xl aspect-[4/3] lg:aspect-auto lg:h-[400px] xl:h-[550px] 2xl:h-[500px] 
        flex items-center lg:items-end">
          <Image
            src="/static/homepage/Obraz.webp"
            alt="Nowoczesne rozwiązania biznesowe – Twój partner w rozwoju"
            fill
            style={{ objectFit: 'contain', objectPosition: 'bottom' }}
            priority
          />
        </div>
      </div>
    </section>
  );
}