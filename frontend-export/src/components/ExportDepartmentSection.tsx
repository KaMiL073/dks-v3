import Link from "next/link";

const contacts = [
  {
    language: "ENGLISH",
    phones: [
      { label: "+48 664 941 146", href: "+48664941146" },
      { label: "+48 600 338 951", href: "+48600338951" },
    ],
  },
  {
    language: "GERMAN",
    phones: [
      { label: "+48 602 570 574", href: "+48602570574" },
      { label: "+48 600 338 951", href: "+48600338951" },
    ],
  },
  {
    language: "ITALIAN",
    phones: [
      { label: "+48 539 735 215", href: "+48539735215" },
      { label: "+48 576 734 453", href: "+48576734453" },
    ],
  },
  {
    language: "FRENCH",
    phones: [{ label: "+48 532 720 185", href: "+48532720185" }],
  },
];

export default function ExportDepartmentSection() {
  return (
    <section className="w-full px-4 sm:px-6 lg:px-8 xl:px-28 py-20 bg-gray-300">
      <h2 className="text-Text-headings text-4xl font-semibold leading-[56px]">
        Contact our export department
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-16 mt-12">
        {contacts.map((contact) => (
          <div key={contact.language}>
            <h3 className="text-Text-headings text-base font-semibold leading-tight">
              {contact.language}
            </h3>
            <div className="text-Text-body text-base font-normal leading-tight">
              {contact.phones.map((phone) => (
                <Link
                  key={phone.href}
                  href={`tel:${phone.href}`}
                  className="block w-fit hover:underline"
                >
                  {phone.label}
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
