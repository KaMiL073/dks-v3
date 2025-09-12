// src/app/page.tsx
import React from "react";
import { Heading1 } from "./_components/Heading1";
import { Heading2 } from "./_components/Heading2";
import { Heading3 } from "./_components/Heading3";
import { Heading4 } from "./_components/Heading4";
import { Heading5 } from "./_components/Heading5";
import { Heading6 } from "./_components/Heading6";

export default function HomePage() {
  return (
      <main className="py-6">
        <div className="flex items-center gap-3 my-12">
          <Heading1 variant="normal">
            H1 Explore the world of printing technology and its innovations.
          </Heading1>
          <Heading1 variant="semibold">
            H1 Explore the world of printing technology and its innovations.
          </Heading1>
          <Heading1 variant="underline">
            H1 Explore the world of printing technology and its innovations.
          </Heading1>
        </div>
        <div className="flex items-center gap-3 my-12">
          <Heading2 variant="normal">
            H2 Discover the future of technology and creativity.
          </Heading2>
          <Heading2 variant="semibold">
            H2 Discover the future of technology and creativity.
          </Heading2>
          <Heading2 variant="underline">
            H2 Discover the future of technology and creativity.
          </Heading2>
        </div>
        <div className="flex items-center gap-3 my-12">
          <Heading3 variant="normal">
            H3 Unleash your creativity with cutting-edge printing solutions.
          </Heading3>
          <Heading3 variant="semibold">
            H3 Unleash your creativity with cutting-edge printing solutions.
          </Heading3>
          <Heading3 variant="underline">
            H3 Unleash your creativity with cutting-edge printing solutions.
          </Heading3>
        </div>
        <div className="flex items-center gap-3 my-12">
          <Heading4 variant="normal">
            H4 Transform your ideas into reality with our printing expertise.
          </Heading4>
          <Heading4 variant="semibold">
            H4 Transform your ideas into reality with our printing expertise.
          </Heading4>
          <Heading4 variant="underline">
            H4 Transform your ideas into reality with our printing expertise.
          </Heading4>
                    <Heading4 variant="italic">
            H4 Transform your ideas into reality with our printing expertise.
          </Heading4>
        </div>
        <div className="flex items-center gap-3 my-12">
          <Heading5 variant="normal">
            H5 Experience the art of printing with precision and quality.
          </Heading5>
          <Heading5 variant="semibold">
            H5 Experience the art of printing with precision and quality.
          </Heading5>
          <Heading5 variant="underline">
            H5 Experience the art of printing with precision and quality.
          </Heading5>
        </div>
        <div className="flex items-center gap-3 my-12">
          <Heading6 variant="normal">
            H6 Elevate your brand with our innovative printing solutions.
          </Heading6>
          <Heading6 variant="semibold">
            H6 Elevate your brand with our innovative printing solutions.
          </Heading6>
          <Heading6 variant="underline">
            H6 Elevate your brand with our innovative printing solutions.
          </Heading6>
        </div>
    </main>
  );
}
