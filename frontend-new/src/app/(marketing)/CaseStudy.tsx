"use client";
import { useState, useRef } from "react";
import Image from "next/image";
import { Heading3 } from "@/components/ui/Typography/Heading3";
import { Button } from "@/components/ui/Button";

type Slide = {
  title: string;
  desc: string;
  image: string;
};

const slides: Slide[] = [
  {
    title: "Jak Nesperta uprościła zarządzanie sprzętem IT i obniżyła koszty",
    desc: "Wysokie koszty, brak elastyczności i skomplikowane procedury - z tym mierzyła się firma Nesperta, korzystając z klasycznego leasingu sprzętu IT. Zobacz, jak zmiana modelu na wynajem komputerów pozwoliła jej uprościć procesy i osiągnąć realne oszczędności.",
    image: "/static/homepage/Obraz-a.webp",
  },
  {
    title: "Case study – optymalizacja druku w firmie XYZ",
    desc: "Firma XYZ zmniejszyła koszty druku o 40% dzięki naszym rozwiązaniom.",
    image: "/static/homepage/Obraz.webp",
  },
  {
    title: "Nowoczesne rozwiązania dla biura",
    desc: "Poznaj, jak wdrożenie nowych technologii pozwoliło zwiększyć wydajność pracy o 30%.",
    image: "/static/homepage/Obraz-a.webp",
  },
];

export default function CaseStudy() {
  const [current, setCurrent] = useState(0);
  const touchStartX = useRef<number | null>(null);

  const handlePrev = () => {
    setCurrent((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrent((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
  };

  const handleDotClick = (index: number) => {
    setCurrent(index);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (diff > 50) handleNext(); // swipe left
    if (diff < -50) handlePrev(); // swipe right
    touchStartX.current = null;
  };

  return (
<section
  className="self-stretch min-h-[626px] px-4 sm:px-6 md:px-6 lg:px-8 xl:px-28 py-12 md:py-20 flex flex-col items-center justify-center gap-8 overflow-hidden"
  onTouchStart={handleTouchStart}
  onTouchEnd={handleTouchEnd}
  style={{
    backgroundImage: 'url("/static/homepage/Header.webp")',
    backgroundSize: "cover",
    backgroundPosition: "center",
  }}
>
  <div className="grid grid-cols-[auto_1fr_auto] items-center gap-4 lg:gap-8 w-full">
    {/* Strzałka lewa */}
    <button
      onClick={handlePrev}
      aria-label="Poprzedni slajd"
      className="flex justify-center items-center"
    >
      <Image
        src="/static/icons/ArrowBack.svg"
        alt="Poprzedni"
        width={32}
        height={32}
        className="md:w-8 md:h-8 lg:w-9 lg:h-9"
      />
    </button>

    {/* CONTENT */}
    <div className="flex flex-col lg:flex-row items-center gap-6 lg:gap-16">
      {/* Tekst */}
      <div className="flex-1 flex flex-col gap-4 lg:gap-8 text-left">
        <Heading3 variant="semibold">{slides[current].title}</Heading3>
        <p className="text-base md:text-xl lg:text-2xl font-normal leading-snug">
          {slides[current].desc}
        </p>
        <Button className="w-1/2">Dowiedz się więcej</Button>
      </div>

      {/* Obraz */}
      <div className="flex-1 flex justify-center mt-6 lg:mt-0">
        <Image
          src={slides[current].image}
          alt={slides[current].title}
          width={467}
          height={272}
          className="h-44 md:h-64 w-auto object-contain"
        />
      </div>
    </div>

    {/* Strzałka prawa */}
    <button
      onClick={handleNext}
      aria-label="Następny slajd"
      className="flex justify-center items-center"
    >
      <Image
        src="/static/icons/ArrowNext.svg"
        alt="Następny"
        width={32}
        height={32}
        className="md:w-8 md:h-8 lg:w-9 lg:h-9"
      />
    </button>
  </div>

  {/* DOTS */}
  <div className="flex gap-2 mt-6">
    {slides.map((_, i) => (
      <button
        key={i}
        onClick={() => handleDotClick(i)}
        className={`w-3 h-3 rounded-full ${
          i === current ? "bg-red-600" : "bg-red-100"
        }`}
      />
    ))}
  </div>
</section>
  );
}