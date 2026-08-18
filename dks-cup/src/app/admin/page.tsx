import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { pool } from "@/lib/db";
import { UserAccount } from "@/components/UserAccount";

type Tournament = { id: string; name: string };

export default async function AdminPage() {
  const session = await auth();
  if (!session?.user || session.user.role !== "ORGANIZER") redirect("/");

  const { rows: tournaments } = await pool.query<Tournament>(
    `SELECT id, name
       FROM tournaments
      ORDER BY created_at DESC`,
  );

  return (
    <main className="org-main">
      <header className="org-menu">
        <UserAccount icon="/dks-cup/figma/org/account.svg"/>
      </header>

      <section className="org-actions" aria-label="Zarządzanie turniejami">
        {tournaments.map((tournament) => (
          <Link className="org-action org-action--tournament" href={`/admin/tournaments/${tournament.id}`} key={tournament.id}>
            <span>{tournament.name}</span>
            <Image src="/dks-cup/figma/org/arrow.svg" alt="" width={20} height={20} />
          </Link>
        ))}
        <Link className="org-action org-action--add" href="/admin/tournaments/new">
          <span>Dodaj turniej</span>
          <Image src="/dks-cup/figma/org/add.svg" alt="" width={20} height={20} />
        </Link>
        <Link className="org-action org-action--users" href="/users"><span>Użytkownicy</span><Image src="/dks-cup/figma/org/account-detail.svg" alt="" width={20} height={20}/></Link>
      </section>
    </main>
  );
}
