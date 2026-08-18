import Link from "next/link";
import { ArrowIcon } from "./ArrowIcon";

export function ActionButton({ href, children, tone = "dark" }: { href: string; children: React.ReactNode; tone?: "dark" | "burgundy" }) {
  return <Link className={`action-button action-button--${tone}`} href={href}><span>{children}</span><ArrowIcon /></Link>;
}
