import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { UserAccount } from "@/components/UserAccount";
import { pool } from "@/lib/db";

function makeSlug(name: string) {
  return name
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 64) || "turniej";
}

async function createTournament(formData: FormData) {
  "use server";

  const session = await auth();
  if (!session?.user || session.user.role !== "ORGANIZER") redirect("/");

  const name = String(formData.get("name") ?? "").trim();
  if (!name || name.length > 120) redirect("/admin/tournaments/new");

  const baseSlug = makeSlug(name);
  const client = await pool.connect();
  let tournamentId: string;
  try {
    await client.query("BEGIN");
    const { rows } = await client.query<{ id: string }>(
    `INSERT INTO tournaments (name, slug)
     VALUES (
       $1,
       CASE WHEN EXISTS (SELECT 1 FROM tournaments WHERE slug = $2)
         THEN $2 || '-' || substring(gen_random_uuid()::text, 1, 8)
         ELSE $2
       END
     ) RETURNING id`,
    [name, baseSlug],
    );
    tournamentId = rows[0].id;
    await client.query(
      `INSERT INTO groups (tournament_id, name) VALUES ($1, 'Grupa A'), ($1, 'Grupa B')`,
      [tournamentId],
    );
    await client.query(
      `INSERT INTO pitches (tournament_id, name, position) VALUES ($1, 'Boisko A', 1), ($1, 'Boisko B', 2)`,
      [tournamentId],
    );
    await client.query("COMMIT");
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }

  redirect(`/admin/tournaments/${tournamentId}`);
}

export default async function NewTournamentPage() {
  const session = await auth();
  if (!session?.user || session.user.role !== "ORGANIZER") redirect("/");

  return (
    <main className="org-main org-create-tournament">
      <header className="org-menu org-menu--split">
        <Link className="org-menu-icon" href="/admin" aria-label="Wróć do listy turniejów">
          <Image src="/dks-cup/figma/org/back.svg" alt="" width={48} height={48} priority />
        </Link>
        <UserAccount icon="/dks-cup/figma/org/account-add-tournament.svg"/>
      </header>

      <form className="org-tournament-form" action={createTournament}>
        <label htmlFor="tournament-name">Nazwa turnieju</label>
        <input id="tournament-name" name="name" type="text" required maxLength={120} autoFocus />
        <button type="submit">Utwórz</button>
      </form>
    </main>
  );
}
