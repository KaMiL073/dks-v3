import Link from "next/link";
export default function LoginPage() { return <main className="placeholder-page"><h1>Logowanie</h1><form><label>E-mail<input type="email" name="email" required /></label><label>Hasło<input type="password" name="password" required /></label><button type="submit">Zaloguj się</button></form><Link href="/">Powrót do turnieju</Link></main>; }
