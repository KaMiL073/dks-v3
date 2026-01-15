import Link from "next/link";

type MenuItem = {
  label: string;
  href: string;
};

const menuItems: MenuItem[] = [
  { label: "O nas", href: "/o-firmie" },
  { label: "Zgłoszenie serwisowe", href: "/zgloszenie-serwisowe" },
  { label: "Eksport", href: "/export" },
  { label: "Oddziały", href: "/oddzialy" },
  { label: "Kariera", href: "/kariera" },
  { label: "Regulamin płatności online", href: "/regulamin-platnosci-online" },
  { label: "Ochrona sygnalistów", href: "/ochrona-sygnalistow" },
  {
    label: "Klauzula Ochrony Danych / Data Protection",
    href: "/klauzula-ochrony-danych-data-protection",
  },
];

export default function QuickMenu() {
  return (
    <nav aria-label="Szybkie menu">
      <div className="text-Text-body text-base font-semibold leading-tight mb-2">
        Szybkie menu
      </div>
      <ul className="flex flex-col gap-2">
        {menuItems.map((item) => (
          <li key={item.href}>
            <Link
              href={item.href}
              className="flex justify-between items-center hover:text-primary transition-colors"
            >
              <span className="text-Text-body text-base font-normal leading-tight">
                {item.label}
              </span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-gray-500 group-hover:text-primary"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}