import Image from "next/image";
import Link from "next/link";
import QuickMenu from "@/components/navigation/QuickMenu";
import SocialMedia from "@/components/navigation/SocialMedia";
import Button from "@/components/ui/Button";
export default function Footer() {
  return (
    <footer className="bg-surface-page" role="contentinfo">
      {/* Mobile */}
      <div className="p-9 flex flex-col gap-16 lg:hidden">
        {/* CTA */}
        <div className="flex flex-col gap-6">
          <h2 className="text-Text-body text-xl font-semibold leading-normal">
            Skontaktuj się z nami!
          </h2>
          <p className="text-Text-body text-xl font-normal leading-normal">
            Jesteśmy tutaj, aby odpowiedzieć na Twoje pytania i pomóc w każdej sprawie.
          </p>
          <Button>Porozmawiajmy</Button>
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
                DKS Sp. z o.o.
              </span>
              <p className="text-Text-body text-xl font-normal leading-normal">
                <span itemProp="streetAddress">ul. Energetyczna 15</span>
                <br />
                <span itemProp="postalCode">80-180</span>{" "}
                <span itemProp="addressLocality">Kowale</span>
                <br />
                NIP: 583-27-90-417
                <br />
                KRS: 0000099557
                <br />
                REGON: 190917946
              </p>
            </div>
            <div>
              <SocialMedia />
            </div>
          </address>

          {/* Quick menu */}
          <nav className="flex flex-col gap-8 w-48" aria-label="Szybkie menu">
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
              Kontakt
            </h3>
            <p className="text-Text-body text-xl font-normal leading-normal">
              Centrala
              <br />
              Telefon:{" "}
              <Link href="tel:+48583090307" passHref>
                <span className="underline" itemProp="telephone">
                  58 309 03 07
                </span>
              </Link>
              <br />
              E-mail:{" "}
              <Link href="mailto:kontakt@dks.pl" passHref>
                <span className="underline" itemProp="email">
                  kontakt@dks.pl
                </span>
              </Link>
              <br />
              <br />
              Dział Obsługi Klienta
              <br />
              Telefon:{" "}
              <a href="tel:+48583506605" className="underline" itemProp="telephone">
                58 350 66 05
              </a>
              <br />
              E-mail:{" "}
              <a href="mailto:serwis@dks.pl" className="underline" itemProp="email">
                serwis@dks.pl
              </a>
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
                DKS Sp. z o.o.
              </span>
              <p className="text-Text-body text-base font-normal leading-tight">
                <span itemProp="streetAddress">ul. Energetyczna 15</span>
                <br />
                <span itemProp="postalCode">80-180</span>{" "}
                <span itemProp="addressLocality">Kowale</span>
                <br />
                NIP: 583-27-90-417
                <br />
                KRS: 0000099557
                <br />
                REGON: 190917946
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
              Kontakt
            </h3>
            <p className="text-Text-body text-base font-normal leading-tight">
              Centrala
              <br />
              Telefon:{" "}
              <a href="tel:+48583090307" className="underline" itemProp="telephone">
                58 309 03 07
              </a>
              <br />
              E-mail:{" "}
              <a href="mailto:kontakt@dks.pl" className="underline" itemProp="email">
                kontakt@dks.pl
              </a>
              <br />
              <br />
              Dział Obsługi Klienta
              <br />
              Telefon:{" "}
              <a href="tel:+48583506605" className="underline" itemProp="telephone">
                58 350 66 05
              </a>
              <br />
              E-mail:{" "}
              <Link href="mailto:serwis@dks.pl" passHref>
                <span className="underline" itemProp="email">
                  serwis@dks.pl
                </span>
              </Link>
            </p>
          </address>

          {/* Quick menu */}
          <nav className="w-56 flex flex-col gap-8" aria-label="Szybkie menu">
            <QuickMenu />
          </nav>
        </div>

        {/* CTA */}
        <div className="flex flex-col gap-8 w-56">
          <div>
            <h2 className="text-Text-body text-xl font-semibold leading-normal">
              Skontaktuj się z nami!
            </h2>
            <p className="text-Text-body text-base font-normal leading-tight">
              Jesteśmy tutaj, aby odpowiedzieć na Twoje pytania i pomóc w każdej sprawie.
            </p>
          </div>
          <Button>Porozmawiajmy</Button>
        </div>
      </div>
    </footer>
  );
}