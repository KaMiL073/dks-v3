import Image from "next/image";
import Link from "next/link";
import QuickMenu from "@/components/navigation/QuickMenu";
import SocialMedia from "@/components/navigation/SocialMedia";
import Button from "../../../frontend-new/src/components/ui/Button";
export default function Footer() {
  return (
    <footer className="bg-surface-page" role="contentinfo">
      {/* Mobile */}
      <div className="p-9 flex flex-col gap-16 lg:hidden">
        {/* CTA */}
        <div className="flex flex-col gap-6">
          <h2 className="text-Text-body text-xl font-semibold leading-normal">
            Contact us
          </h2>
          <p className="text-Text-body text-xl font-normal leading-normal">
            We are here to answer your questions and provide help
          </p>
          <Button href="/contact">Let&apos;s talk</Button>
        </div>

        {/* Firma + Social + Menu + Kontakt */}
        <div className="flex flex-col gap-8">
          {/* Firma + Social */}
          <address
            className="flex flex-col gap-7 w-48 not-italic"
            itemScope
            itemType="https://schema.org/Organization"
          >
            <Image
              src="https://dks.pl/static/logo-dks.svg"
              alt="DKS Logo"
              width={120}
              height={36}
              priority
              itemProp="logo"
            />
            <div itemProp="address" itemScope itemType="https://schema.org/PostalAddress">
              <span
                className="block text-Text-body text-xl font-semibold leading-normal"
                itemProp="name"
              >
                DKS Sp z o.o.
              </span>
              <p className="text-Text-body text-xl font-normal leading-normal">
                <span itemProp="streetAddress">Energetyczna 15</span>
                <br />
                <span itemProp="postalCode">80-180</span>{" "}
                <span itemProp="addressLocality">Kowale</span>
                <br />
                <br />
                Export warehouse:
                <br />
                Magazynowa 23A
                <br />
                80-180 Kowale
              </p>
            </div>
            <div>
              <SocialMedia />
            </div>
          </address>

          {/* Quick menu */}
          <nav className="flex flex-col gap-8 w-48" aria-label="Quick menu">
            <QuickMenu />
          </nav>

          {/* Kontakt */}
          <address
            className="flex flex-col gap-4 not-italic"
            itemProp="contactPoint"
            itemScope
            itemType="https://schema.org/ContactPoint"
          >
            <h3 className="text-Text-body text-xl font-semibold leading-normal">
              Contact
            </h3>
            <p className="text-Text-body text-xl font-normal leading-normal">
              <Link href="tel:+48664941146" passHref>
                <span className="underline" itemProp="telephone">
                  +48 664 941 146
                </span>
              </Link>
              <br />
              <Link href="tel:+48600338951" passHref>
                <span className="underline" itemProp="telephone">
                  +48 600 338 951
                </span>
              </Link>
              <br />
              <Link href="mailto:export.copiers@dks.pl" passHref>
                <span className="underline" itemProp="email">
                  export.copiers@dks.pl
                </span>
              </Link>
            </p>
          </address>
        </div>
      </div>

      {/* Desktop */}
      <div className="hidden lg:flex px-28 py-20 justify-start gap-64 flex-wrap">
        <div className="flex-1 flex justify-between flex-wrap gap-8">
          {/* Firma + Social */}
          <address
            className="flex flex-col gap-8 w-56 not-italic"
            itemScope
            itemType="https://schema.org/Organization"
          >
            <Image
              src="https://dks.pl/static/logo-dks.svg"
              alt="DKS Logo"
              width={120}
              height={36}
              priority
              itemProp="logo"
            />
            <div itemProp="address" itemScope itemType="https://schema.org/PostalAddress">
              <span
                className="block text-Text-body text-base font-semibold leading-tight"
                itemProp="name"
              >
                DKS Sp z o.o.
              </span>
              <p className="text-Text-body text-base font-normal leading-tight">
                <span itemProp="streetAddress">Energetyczna 15</span>
                <br />
                <span itemProp="postalCode">80-180</span>{" "}
                <span itemProp="addressLocality">Kowale</span>
                <br />
                <br />
                Export warehouse:
                <br />
                Magazynowa 23A
                <br />
                80-180 Kowale
              </p>
            </div>
            <div>
              <SocialMedia />
            </div>
          </address>

          {/* Kontakt */}
          <address
            className="flex flex-col gap-8 w-56 not-italic"
            itemProp="contactPoint"
            itemScope
            itemType="https://schema.org/ContactPoint"
          >
            <h3 className="text-Text-body text-base font-semibold leading-tight">
              Contact
            </h3>
            <p className="text-Text-body text-base font-normal leading-tight">
              <a href="tel:+48664941146" className="underline" itemProp="telephone">
                +48 664 941 146
              </a>
              <br />
              <a href="tel:+48600338951" className="underline" itemProp="telephone">
                +48 600 338 951
              </a>
              <br />
              <a href="mailto:export.copiers@dks.pl" className="underline" itemProp="email">
                export.copiers@dks.pl
              </a>
            </p>
          </address>

          {/* Quick menu */}
          <nav className="w-56 flex flex-col gap-8" aria-label="Quick menu">
            <QuickMenu />
          </nav>
        </div>

        {/* CTA */}
        <div className="flex flex-col gap-8 w-56">
          <div>
            <h2 className="text-Text-body text-xl font-semibold leading-normal">
              Contact us
            </h2>
            <p className="text-Text-body text-base font-normal leading-tight">
              We are here to answer your questions and provide help
            </p>
          </div>
          <Button href="/contact">Let&apos;s talk</Button>
        </div>
      </div>
    </footer>
  );
}
