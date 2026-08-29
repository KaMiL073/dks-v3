import Link from "next/link";

export default function Logo() {
  return (
    <Link href="/" className="logo" aria-label="DKS Export home">
      <span>DKS</span>
      <small>EXPORT</small>
    </Link>
  );
}
