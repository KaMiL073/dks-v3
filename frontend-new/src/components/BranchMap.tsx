/* plik: src/components/BranchMap.tsx */
'use client';
import React from 'react';
import { Branch } from '../data/branches'; // Ścieżka do definicji typu i danych

type BranchMapProps = {
  branch: Branch;
};

const BranchMap: React.FC<BranchMapProps> = ({ branch }) => {
  const { fullName, address, phone, email, salesContact, serviceContact, srcMap } = branch;

  return (
    <section className="py-20 w-full bg-surface-page overflow-hidden">
      {/* Mapa (iframe) */}
      <div className="w-full h-[350px] sm:h-[450px] mb-16">
        <iframe
          title={`Mapa oddziału ${fullName}`}
          src={srcMap}
          width="100%"
          height="100%"
          style={{ border: 0 }}
          loading="lazy"
        />
      </div>

      {/* Kontakty: na desktopie 3 kolumny, na mobile stosowane jedna pod drugą */}
      <div className="flex flex-col lg:flex-row justify-between items-start gap-8 px-8 lg:px-28">
        {/* Kolumna 1 – dane oddziału */}
        <div className="flex-1 min-w-[220px]">
          <p className="text-Text-body text-xl font-semibold">{fullName}</p>
          <p className="text-Text-body text-xl">{address}</p>
          <p className="mt-2">
            <span className="font-semibold">Tel:</span>{' '}
            <span className="underline">{phone}</span>
          </p>
          <p>
            <span className="font-semibold">E-mail:</span>{' '}
            <span className="underline">{email}</span>
          </p>
        </div>

        {/* Kolumna 2 – dział handlowy */}
        <div className="flex-1 min-w-[220px]">
          <p className="text-Text-body text-xl font-semibold">Kontakt z działem handlowym:</p>
          <p className="mt-2">
            <span className="font-semibold">Tel:</span>{' '}
            <span className="underline">{salesContact.phones[0]}</span>
          </p>
          <p>
            <span className="font-semibold">E-mail:</span>{' '}
            <span className="underline">{salesContact.emails[0]}</span>
          </p>
        </div>

        {/* Kolumna 3 – serwis */}
        <div className="flex-1 min-w-[220px]">
          <p className="text-Text-body text-xl font-semibold">Kontakt z działem serwisu:</p>
          <p className="mt-2">
            <span className="font-semibold">Tel:</span>{' '}
            <span className="underline">{serviceContact.phones[0]}</span>
          </p>
          <p>
            <span className="font-semibold">E-mail:</span>{' '}
            <span className="underline">{serviceContact.emails[0]}</span>
          </p>
        </div>
      </div>
    </section>
  );
};

export default BranchMap;