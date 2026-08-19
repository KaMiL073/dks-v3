import DksHeader, {
  type NavItem,
} from "../../../frontend-new/src/components/navigation/Header";

export default function Header() {
  const navigation: NavItem[] = [
    { label: "Home", href: "/" },
    { label: "Offer", href: "/offer" },
    { label: "About us", href: "/about-us" },
  ];

  return (
    <DksHeader
      navItems={navigation}
      contactHref="/contact"
      contactLabel="Contact"
      menuLabel="Menu"
    />
  );
}
