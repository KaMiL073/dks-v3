// "use client";

// import { useState, useEffect, useRef } from "react";
// import Image from "next/image";

// export interface News {
//   id: string;
//   title: string;
//   lead: string;
//   slug: string;
//   image: string | null;
// }

// export default function NewsSection() {
//   const [newsItems, setNewsItems] = useState<News[]>([]);
//   const [current, setCurrent] = useState(0);
//   const touchStartX = useRef<number | null>(null);

//   // pobieranie danych z własnego API route
//   useEffect(() => {
//     fetch("/api/news?limit=4")
//       .then((res) => res.json())
//       .then((data: News[]) => setNewsItems(data))
//       .catch((err) => console.error("Błąd pobierania newsów:", err));
//   }, []);

//   const handlePrev = () =>
//     setCurrent((prev) => (prev === 0 ? newsItems.length - 1 : prev - 1));
//   const handleNext = () =>
//     setCurrent((prev) => (prev === newsItems.length - 1 ? 0 : prev + 1));
//   const handleDotClick = (index: number) => setCurrent(index);

//   const handleTouchStart = (e: React.TouchEvent) => {
//     touchStartX.current = e.touches[0].clientX;
//   };
//   const handleTouchEnd = (e: React.TouchEvent) => {
//     if (touchStartX.current === null) return;
//     const diff = touchStartX.current - e.changedTouches[0].clientX;
//     if (diff > 50) handleNext();
//     if (diff < -50) handlePrev();
//     touchStartX.current = null;
//   };

//   return (
//     <section
//       className="p-6 xl:px-28 py-20 flex flex-col items-center gap-16 bg-surface-page"
//       onTouchStart={handleTouchStart}
//       onTouchEnd={handleTouchEnd}
//     >
//       <h2 className="text-4xl font-semibold text-Text-body text-center">
//         Dowiedz się więcej
//       </h2>

//       <div className="flex w-full items-center gap-6">
//         {/* Strzałka lewa */}
//         <button onClick={handlePrev} aria-label="Poprzedni slajd">
//           <Image
//             src="./static/icons/ArrowBack.svg"
//             alt="Poprzedni"
//             width={32}
//             height={32}
//           />
//         </button>

//         {/* Karuzela */}
//         <div className="flex-1 overflow-hidden">
//           <div
//             className="flex transition-transform duration-500 gap-6"
//             style={{
//               transform: `translateX(-${current * (592 + 24)}px)`,
//             }}
//           >
//             {newsItems.map((item) => (
//               <div
//                 key={item.id}
//                 className="flex-shrink-0 w-full md:w-[592px] px-6 py-10 bg-gray-300 shadow"
//               >
//                 <div className="flex flex-col md:flex-row gap-6">
//                   <Image
//                     src={item.image ?? "/static/default-news.jpg"}
//                     alt={item.title}
//                     width={272}
//                     height={190}
//                     className="h-48 w-full md:w-auto object-cover"
//                   />
//                   <div className="flex-1 flex flex-col justify-center">
//                     <p className="text-xl md:text-2xl font-semibold text-Text-body text-center md:text-left">
//                       {item.title}
//                     </p>
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>

//         {/* Strzałka prawa */}
//         <button onClick={handleNext} aria-label="Następny slajd">
//           <Image
//             src="./static/icons/ArrowNext.svg"
//             alt="Następny"
//             width={32}
//             height={32}
//           />
//         </button>
//       </div>

//       {/* Kropki */}
//       <div className="flex gap-2 mt-4">
//         {newsItems.map((_, i) => (
//           <button
//             key={i}
//             onClick={() => handleDotClick(i)}
//             className={`w-3 h-3 rounded-full ${
//               i === current ? "bg-[#E7000B]" : "bg-[#FFA2A2]"
//             }`}
//             aria-label={`Przejdź do artykułu ${i + 1}`}
//           />
//         ))}
//       </div>
//     </section>
//   );
// }

"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";

export interface News {
  id: string;
  title: string;
  lead: string;
  slug: string;
  image: string | null;
}

export default function NewsSection() {
  const [newsItems, setNewsItems] = useState<News[]>([]);
  const [current, setCurrent] = useState(0);
  const touchStartX = useRef<number | null>(null);

  // Pobieranie newsów z API
  useEffect(() => {
    fetch("/api/news?limit=4")
      .then((res) => res.json())
      .then((data: News[]) => setNewsItems(data))
      .catch((err) => console.error("Błąd pobierania newsów:", err));
  }, []);

  const handlePrev = () =>
    setCurrent((prev) => (prev === 0 ? newsItems.length - 1 : prev - 1));
  const handleNext = () =>
    setCurrent((prev) => (prev === newsItems.length - 1 ? 0 : prev + 1));
  const handleDotClick = (index: number) => setCurrent(index);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };
  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (diff > 50) handleNext();
    if (diff < -50) handlePrev();
    touchStartX.current = null;
  };

  return (
    <section
      className="p-6 xl:px-28 py-20 flex flex-col items-center gap-16 bg-surface-page"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <h2 className="text-4xl font-semibold text-Text-body text-center">
        Dowiedz się więcej
      </h2>

      <div className="flex w-full items-center gap-6">
        <button onClick={handlePrev} aria-label="Poprzedni slajd">
          <Image
            src="/static/icons/ArrowBack.svg"
            alt="Poprzedni"
            width={32}
            height={32}
          />
        </button>

        <div className="flex-1 overflow-hidden">
          <div
            className="flex transition-transform duration-500 gap-6"
            style={{
              transform: `translateX(-${current * (592 + 24)}px)`,
            }}
          >
            {newsItems.map((item) => (
              <div
                key={item.id}
                className="flex-shrink-0 w-full md:w-[592px] px-6 py-10 bg-gray-300 shadow"
              >
                <div className="flex flex-col md:flex-row gap-6">
                  <Image
                    src={item.image ?? "/static/default-news.jpg"}
                    alt={item.title}
                    width={272}
                    height={190}
                    className="h-48 w-full md:w-auto object-cover"
                  />
                  <div className="flex-1 flex flex-col justify-center">
                    <p className="text-xl md:text-2xl font-semibold text-Text-body text-center md:text-left">
                      {item.title}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <button onClick={handleNext} aria-label="Następny slajd">
          <Image
            src="/static/icons/ArrowNext.svg"
            alt="Następny"
            width={32}
            height={32}
          />
        </button>
      </div>

      <div className="flex gap-2 mt-4">
        {newsItems.map((_, i) => (
          <button
            key={i}
            onClick={() => handleDotClick(i)}
            className={`w-3 h-3 rounded-full ${
              i === current ? "bg-[#E7000B]" : "bg-[#FFA2A2]"
            }`}
            aria-label={`Przejdź do artykułu ${i + 1}`}
          />
        ))}
      </div>
    </section>
  );
}
