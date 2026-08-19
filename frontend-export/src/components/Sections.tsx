import Image from "next/image";
import Link from "next/link";

export function Breadcrumbs({ current }: { current: string }) {
  return (
    <div className="container breadcrumbs" aria-label="Breadcrumb">
      <Link href="/">Home</Link><span>/</span><span>{current}</span>
    </div>
  );
}

export function SplitSection({
  title,
  text,
  image,
  reverse = false,
  children,
}: {
  title: string;
  text: string;
  image: string;
  reverse?: boolean;
  children?: React.ReactNode;
}) {
  return (
    <section className={`section split ${reverse ? "reverse" : ""}`}>
      <div className="container split-grid">
        <div className="split-image">
          <Image src={image} alt="" fill sizes="(max-width: 800px) 100vw, 50vw" />
        </div>
        <div className="split-copy">
          <h2>{title}</h2>
          <p>{text}</p>
          {children}
        </div>
      </div>
    </section>
  );
}

export function ContactCta() {
  return (
    <section className="contact-cta">
      <div className="container">
        <div>
          <span className="eyebrow">Your reliable export partner</span>
          <h2>Ready to discuss your next shipment?</h2>
        </div>
        <Link className="button button-light" href="/contact">Let&apos;s talk</Link>
      </div>
    </section>
  );
}
