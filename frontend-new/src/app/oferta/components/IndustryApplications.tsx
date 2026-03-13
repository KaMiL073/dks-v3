"use client";

import type { ReactNode } from "react";
import Image from "next/image";
import { Heading } from "@/components/ui/Typography/Heading";

interface Application {
  icon?: string | ReactNode; // ✅ zamiast JSX.Element
  title: string;
  description: string;
  benefit: string;
}

interface IndustryApplicationsProps {
  title?: string;
  subtitle?: string;
  applications: Application[];
}

export default function IndustryApplications({ applications }: IndustryApplicationsProps) {
  return (
    <section className="self-stretch px-4 sm:px-10 lg:px-28 py-20 bg-surface-page flex flex-col justify-center items-start gap-16">
      <div className="self-stretch flex flex-col justify-start items-start gap-16">
        {applications.map((app, i) => (
          <div
            key={i}
            className="self-stretch min-h-[9rem] flex flex-col lg:flex-row justify-center items-center gap-8 lg:gap-10"
          >
            <div className="flex-1 flex flex-col justify-start items-center gap-6 text-center">
              <div className="w-24 h-24 bg-icon-secondary rounded-[64px] flex justify-center items-center overflow-hidden">
                {typeof app.icon === "string" ? (
                  <Image
                    src={app.icon}
                    alt={app.title}
                    width={56}
                    height={56}
                    className="w-24 h-24 object-contain"
                  />
                ) : (
                  app.icon ?? <div className="w-12 h-14 bg-icon-primary rounded-md" />
                )}
              </div>

              <Heading as="h5" headingValue="h5_semibold">
                {app.title}
              </Heading>
            </div>

            <div className="flex-1 text-Text-headings text-xl font-normal font-['Montserrat'] leading-6 text-left">
              {app.description}
            </div>

            <Image
              src="/static/icons/Arrow.svg"
              alt=""
              aria-hidden="true"
              width={56}
              height={56}
              className="w-12 h-12 object-contain"
            />

            <div className="flex-1 text-Text-headings text-xl font-semibold font-['Montserrat'] leading-6 text-left">
              {app.benefit}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
// "use client";

// import Image from "next/image";
// import { Heading } from "@/components/ui/Typography/Heading";

// interface Application {
//   icon?: string | JSX.Element; // 🔹 może być ścieżka do SVG lub JSX z ikoną inline
//   title: string;
//   description: string;
//   benefit: string;
// }

// interface IndustryApplicationsProps {
//   title?: string;
//   subtitle?: string;
//   applications: Application[];
// }

// /**
//  * 🔹 Sekcja "Zastosowania branżowe"
//  * Renderuje listę branż z ikoną, opisem i korzyścią
//  */
// export default function IndustryApplications({
//   applications,
// }: IndustryApplicationsProps) {
//   return (
//     <section className="self-stretch px-4 sm:px-10 lg:px-28 py-20 bg-surface-page flex flex-col justify-center items-start gap-16">
//       <div className="self-stretch flex flex-col justify-start items-start gap-16">
//         {applications.map((app, i) => (
//           <div
//             key={i}
//             className="self-stretch min-h-[9rem] flex flex-col lg:flex-row justify-center items-center gap-8 lg:gap-10"
//           >
//             {/* 🧩 Ikona + tytuł */}
//             <div className="flex-1 flex flex-col justify-start items-center gap-6 text-center">
//               <div className="w-24 h-24 bg-icon-secondary rounded-[64px] flex justify-center items-center overflow-hidden">
//                 {typeof app.icon === "string" ? (
//                   <Image
//                     src={app.icon}
//                     alt={app.title}
//                     width={56}
//                     height={56}
//                     className="w-24 h-24 object-contain"
//                   />
//                 ) : (
//                   app.icon || (
//                     <div className="w-12 h-14 bg-icon-primary rounded-md" />
//                   )
//                 )}
//               </div>

//               <Heading as="h5" headingValue="h5_semibold">
//                 {app.title}
//               </Heading>
//             </div>

//             {/* 🧠 Opis */}
//             <div className="flex-1 text-Text-headings text-xl font-normal font-['Montserrat'] leading-6 text-left">
//               {app.description}
//             </div>

//             {/* 🔸 Separator */}
//             <Image
//               src="/static/icons/Arrow.svg"
//               alt={app.title}
//               width={56}
//               height={56}
//               className="w-12 h-12 object-contain"
//             />

//             {/* 💡 Korzyść */}
//             <div className="flex-1 text-Text-headings text-xl font-semibold font-['Montserrat'] leading-6 text-left">
//               {app.benefit}
//             </div>
//           </div>
//         ))}
//       </div>
//     </section>
//   );
// }