import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/Sections";
import ContactForm from "@/components/ContactForm";
import ContactDetailsSection from "@/components/ContactDetailsSection";
import ExportDepartmentSection from "@/components/ExportDepartmentSection";
import HeroSection from "../../../../frontend-new/src/app/(marketing)/HeroSection";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Contact the DKS export department in English, German, Italian or French.",
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  return (
    <>
      <Breadcrumbs current="Contact" />
      <HeroSection
        variant="full-height"
        title="Contact"
        subtitle="Contact our export department with any enquiries or questions. We speak English, German, Italian and French. Send us a message and we will respond as soon as possible."
        backgroundImage="/static/homepage/Header.webp"
        heroImage="/images/contact-person.png"
        contentPosition="left"
        imageVerticalAlign="bottom"
        imageFit="contain"
      />
      <ContactDetailsSection />
      <div className="w-full bg-gray-300">
        <ExportDepartmentSection />
        <div className="h-12 bg-white" aria-hidden="true" />
        <section className="w-full px-4 sm:px-6 md:px-12 xl:px-28 py-8 md:py-20 bg-gray-300">
          <div className="w-full max-w-full overflow-x-hidden flex flex-col xl:flex-row items-start gap-8 xl:gap-16">
            <div className="w-full xl:w-96 shrink-0">
              <h2 className="text-Text-headings text-3xl md:text-4xl font-semibold font-['Montserrat'] leading-10 md:leading-[56px]">
                Message us
              </h2>
              <p className="mt-6 text-Text-headings text-base md:text-xl font-normal font-['Montserrat'] leading-6">
                Fill and send the form to us or our qualified specialists to
                create a personalised offer just for you. We will help you find
                the best possible solutions for your business.
              </p>
            </div>
            <ContactForm />
          </div>
        </section>
      </div>
    </>
  );
}
