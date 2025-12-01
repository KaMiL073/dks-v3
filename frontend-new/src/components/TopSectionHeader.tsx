"use client";

import React from "react";

interface TopSectionHeaderProps {
  title: string;
  description?: string;
  img?: string;
}

export default function TopSectionHeader({ title, description, img }: TopSectionHeaderProps) {
  return (
    <div
      className="
        self-stretch
        p-9
        md:px-10 lg:px-28 md:py-20
        flex justify-start items-start
        flex-wrap content-start
        gap-10 md:gap-60
        bg-cover bg-center
      "
      style={{
        backgroundImage: img ? `url("${img}")` : "none",
      }}
    >
      <div className="flex-1 flex flex-col justify-center items-start gap-8 md:gap-12 max-w-[710px]">
        {/* 🔹 Tytuł */}
        <div
          className="
            text-Text-headings
            text-3xl md:text-5xl lg:text-6xl
            font-semibold font-['Montserrat']
            leading-10 md:leading-[1.2]
          "
        >
          {title}
        </div>

        {/* 🔹 Opis (tylko jeśli istnieje) */}
        {description && (
          <div
            className="
              text-Text-headings
              text-xl md:text-2xl
              font-normal font-['Montserrat']
              leading-6 md:leading-7
            "
          >
            {description}
          </div>
        )}
      </div>
    </div>
  );
}