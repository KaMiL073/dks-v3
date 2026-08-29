import Link from "next/link";

type MenuItem = {
  label: string;
  href: string;
};

const menuItems: MenuItem[] = [
  { label: "Home", href: "/" },
  { label: "About us", href: "/about-us" },
  { label: "Offer", href: "/offer" },
  { label: "Contact", href: "/contact" },
];

export default function QuickMenu() {
  return (
    <nav aria-label="Quick menu">
      <div className="text-Text-body text-base font-semibold leading-tight mb-2">
        Quick menu
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
