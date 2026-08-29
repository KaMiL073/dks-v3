export const siteUrl = (
  process.env.NEXT_PUBLIC_SITE_URL || "https://dks.com.pl"
).replace(/\/$/, "");

export const navigation = [
  { href: "/", label: "Home" },
  { href: "/offer", label: "Offer" },
  { href: "/about-us", label: "About us" },
] as const;

export const partners = [
  "Canon",
  "Ricoh",
  "Konica Minolta",
  "Kyocera",
  "HP",
  "Lexmark",
  "Sharp",
  "Brother",
  "Toshiba",
];
