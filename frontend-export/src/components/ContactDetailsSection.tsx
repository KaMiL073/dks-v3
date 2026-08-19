import Image from "next/image";
import Link from "next/link";

export default function ContactDetailsSection() {
  return (
    <section className="w-full px-4 sm:px-6 lg:px-8 xl:px-28 py-20 bg-surface-page">
      <div className="w-full mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-[3fr_4fr] gap-8">
          <div className="relative h-[300px] lg:h-[560px] overflow-hidden bg-white">
            <Image
              src="/images/world-map.png"
              alt="DKS location in Europe"
              fill
              sizes="(max-width: 768px) 100vw, 43vw"
              className="object-cover object-[57%_50%]"
            />

            <div className="absolute left-[57%] top-[39%] -translate-x-1/2 flex flex-col items-center">
              <svg
                viewBox="0 0 24 32"
                className="w-10 h-12 text-red-600"
                fill="currentColor"
                aria-hidden="true"
              >
                <path d="M12 0C5.37 0 0 5.37 0 12c0 9 12 20 12 20s12-11 12-20C24 5.37 18.63 0 12 0Zm0 16.2A4.2 4.2 0 1 1 12 7.8a4.2 4.2 0 0 1 0 8.4Z" />
              </svg>
              <Image
                src="https://dks.pl/static/logo-dks.svg"
                alt="DKS"
                width={120}
                height={36}
                className="mt-2"
              />
            </div>
          </div>

          <div className="relative h-[300px] lg:h-[560px]">
            <Image
              src="/images/map.png"
              alt="Location of DKS export warehouse"
              fill
              sizes="(max-width: 768px) 100vw, 57vw"
              className="object-cover"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-12 text-Text-body text-base font-normal leading-tight">
          <address className="not-italic">
            <strong className="font-semibold">DKS Sp. z o.o.</strong>
            <br />
            MAGAZYNOWA 23A STREET
            <br />
            80-180 KOWALE
            <br />
            POLAND
          </address>

          <div>
            <strong className="font-semibold">Telefon:</strong>{" "}
            <Link href="tel:+48583090307" className="hover:underline">
              58 309 03 07
            </Link>
            <br />
            <strong className="font-semibold">Tel.:</strong>{" "}
            <Link
              href="mailto:export.copiers@dks.pl"
              className="underline"
            >
              export.copiers@dks.pl
            </Link>
            <br />
            <strong className="font-semibold">Purchasing:</strong>{" "}
            <Link
              href="mailto:purchasing.export@dks.pl"
              className="underline"
            >
              purchasing.export@dks.pl
            </Link>
          </div>

          <div>
            VAT number: PL583-27-90-417
            <br />
            KRS: 0000099557
            <br />
            REGON: 190917946
          </div>
        </div>
      </div>
    </section>
  );
}
