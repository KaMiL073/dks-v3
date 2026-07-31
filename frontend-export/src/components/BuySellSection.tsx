import Link from "next/link";

export default function BuySellSection() {
  return (
    <section className="w-full px-6 lg:px-28 py-20 bg-surface-page">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-28">
        <div>
          <h2 className="text-Text-headings text-xl font-semibold leading-tight">
            WHY BUY FROM DKS
          </h2>
          <Link
            href="mailto:export.copiers@dks.pl"
            className="text-Text-body text-base font-normal leading-tight hover:underline"
          >
            export.copiers@dks.pl
          </Link>

          <p className="mt-6 text-Text-body text-base font-normal leading-tight">
            We have over 10.000 machines in our warehouse from companies like
            Ricoh, Konica Minolta, Canon, Kyocera Mita, Sharp, HP, Lexmark &amp;
            Brother. Our offer includes:
          </p>

          <ul className="mt-4 pl-5 list-disc text-Text-body text-base font-normal leading-tight">
            <li>A3/A4 copiers &amp; printers</li>
            <li>scanners,</li>
            <li>large format,</li>
            <li>production machines.</li>
            <li>consumables</li>
          </ul>

          <p className="mt-6 text-Text-body text-base font-normal leading-tight">
            If you are interested in purchasing the devices send us an inquiry.
          </p>
        </div>

        <div>
          <h2 className="text-Text-headings text-xl font-semibold leading-tight">
            WHY SELL TO DKS
          </h2>
          <Link
            href="mailto:purchase.copiers@dks.pl"
            className="text-Text-body text-base font-normal leading-tight hover:underline"
          >
            purchase.copiers@dks.pl
          </Link>

          <p className="mt-6 text-Text-body text-base font-normal leading-tight">
            We purchase over 80.000 devices from our suppliers annually. We are
            able to purchase large quantities of machines at one time. We take
            part in tenders and gain trust from lots of suppliers. If you have
            more machines for sale send us your offer.
          </p>
        </div>
      </div>
    </section>
  );
}
