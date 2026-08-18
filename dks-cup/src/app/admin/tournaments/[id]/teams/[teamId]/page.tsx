import { randomUUID } from "node:crypto";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import Image from "next/image";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { pool } from "@/lib/db";
import { TeamNameEditModal } from "@/components/TeamNameEditModal";
import { TeamLogoEditModal } from "@/components/TeamLogoEditModal";
import { TeamPlayersCard } from "@/components/TeamPlayersCard";
import { UserAccount } from "@/components/UserAccount";

type TeamRow = { id: string; name: string; logo_url: string | null; tournament_name: string };
type NamedRow = { id: string; name: string };
type MatchRow = { home_name: string; away_name: string; home_score: number; away_score: number; status: string };

async function requireOrganizer() {
  const session = await auth();
  if (!session?.user || session.user.role !== "ORGANIZER") redirect("/");
  return session;
}

async function ensurePlayersTable() {
  await pool.query(`CREATE TABLE IF NOT EXISTS team_players (id uuid PRIMARY KEY DEFAULT gen_random_uuid(), team_id uuid NOT NULL REFERENCES teams ON DELETE CASCADE, name text NOT NULL, created_at timestamptz NOT NULL DEFAULT now())`);
}

async function saveLogo(file: File) {
  if (!file.size) return null;
  const extensions: Record<string,string> = { "image/jpeg":"jpg", "image/png":"png", "image/webp":"webp", "image/svg+xml":"svg" };
  const extension = extensions[file.type];
  if (!extension || file.size > 3_000_000) return null;
  const directory = path.join(process.cwd(), "public", "uploads", "teams");
  await mkdir(directory, { recursive: true });
  const filename = `${randomUUID()}.${extension}`;
  await writeFile(path.join(directory, filename), Buffer.from(await file.arrayBuffer()));
  return `/uploads/teams/${filename}`;
}

async function updateTeamName(formData: FormData) {
  "use server";
  await requireOrganizer();
  const tournamentId = String(formData.get("tournamentId") ?? "");
  const teamId = String(formData.get("teamId") ?? "");
  const name = String(formData.get("name") ?? "").trim();
  if (!tournamentId || !teamId || !name || name.length > 120) return;
  await pool.query(`UPDATE teams SET name=$1 WHERE id=$2 AND tournament_id=$3`, [name, teamId, tournamentId]);
  revalidatePath(`/admin/tournaments/${tournamentId}`);
  revalidatePath(`/admin/tournaments/${tournamentId}/teams/${teamId}`);
}

async function updateTeamLogo(formData: FormData) {
  "use server";
  await requireOrganizer();
  const tournamentId = String(formData.get("tournamentId") ?? "");
  const teamId = String(formData.get("teamId") ?? "");
  const file = formData.get("logo");
  const removeLogo = formData.get("removeLogo") === "true";
  if (!tournamentId || !teamId) return;
  if (removeLogo) {
    await pool.query(`UPDATE teams SET logo_url=NULL WHERE id=$1 AND tournament_id=$2`, [teamId, tournamentId]);
    revalidatePath(`/admin/tournaments/${tournamentId}/teams/${teamId}`);
    return;
  }
  const logoUrl = file instanceof File ? await saveLogo(file) : null;
  if (!logoUrl) return;
  await pool.query(`UPDATE teams SET logo_url=$1 WHERE id=$2 AND tournament_id=$3`, [logoUrl, teamId, tournamentId]);
  revalidatePath(`/admin/tournaments/${tournamentId}/teams/${teamId}`);
}

async function addPlayer(formData: FormData) {
  "use server";
  await requireOrganizer();
  await ensurePlayersTable();
  const tournamentId = String(formData.get("tournamentId") ?? "");
  const teamId = String(formData.get("teamId") ?? "");
  const name = String(formData.get("name") ?? "").trim();
  if (!name || name.length > 120) return;
  await pool.query(`INSERT INTO team_players (team_id, name) SELECT id, $1 FROM teams WHERE id=$2 AND tournament_id=$3`, [name, teamId, tournamentId]);
  revalidatePath(`/admin/tournaments/${tournamentId}/teams/${teamId}`);
}

async function updatePlayer(formData: FormData) {
  "use server";
  await requireOrganizer();
  await ensurePlayersTable();
  const tournamentId = String(formData.get("tournamentId") ?? "");
  const teamId = String(formData.get("teamId") ?? "");
  const playerId = String(formData.get("playerId") ?? "");
  const name = String(formData.get("name") ?? "").trim();
  if (!tournamentId || !teamId || !playerId || !name || name.length > 120) return;
  await pool.query(`UPDATE team_players p SET name=$1 FROM teams t WHERE p.id=$2 AND p.team_id=t.id AND t.id=$3 AND t.tournament_id=$4`, [name, playerId, teamId, tournamentId]);
  revalidatePath(`/admin/tournaments/${tournamentId}/teams/${teamId}`);
}

async function deleteTeam(formData: FormData) {
  "use server";
  await requireOrganizer();
  const tournamentId = String(formData.get("tournamentId") ?? "");
  const teamId = String(formData.get("teamId") ?? "");
  if (!tournamentId || !teamId) return;
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    await client.query(`DELETE FROM matches WHERE tournament_id=$1 AND (home_team_id=$2 OR away_team_id=$2)`, [tournamentId, teamId]);
    await client.query(`DELETE FROM teams WHERE id=$1 AND tournament_id=$2`, [teamId, tournamentId]);
    await client.query("COMMIT");
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
  redirect(`/admin/tournaments/${tournamentId}`);
}

export default async function EditTeamPage({ params }: { params: Promise<{ id: string; teamId: string }> }) {
  await requireOrganizer();
  await ensurePlayersTable();
  const { id, teamId } = await params;
  const [teamResult, playersResult, matchesResult] = await Promise.all([
    pool.query<TeamRow>(`SELECT te.id,te.name,te.logo_url,t.name tournament_name FROM teams te JOIN tournaments t ON t.id=te.tournament_id WHERE te.id=$1 AND te.tournament_id=$2`, [teamId,id]),
    pool.query<NamedRow>(`SELECT id,name FROM team_players WHERE team_id=$1 ORDER BY created_at`, [teamId]),
    pool.query<MatchRow>(`SELECT ht.name home_name,at.name away_name,m.home_score,m.away_score,m.status FROM matches m JOIN teams ht ON ht.id=m.home_team_id JOIN teams at ON at.id=m.away_team_id WHERE m.tournament_id=$1 AND (m.home_team_id=$2 OR m.away_team_id=$2) ORDER BY m.start_time`, [id,teamId]),
  ]);
  const team = teamResult.rows[0];
  if (!team) notFound();
  const previous = [...matchesResult.rows].reverse().find((match) => match.status === "finished");
  const next = matchesResult.rows.find((match) => match.status === "scheduled");

  return (
    <main className="org-main org-team-page">
      <header className="org-detail-menu">
        <Link className="org-menu-icon" href={`/admin/tournaments/${id}`} aria-label="Wróć"><Image src="/dks-cup/figma/org/back-detail.svg" alt="" width={48} height={48} priority /></Link>
        <h1>{team.name}</h1>
        <div className="org-detail-menu-actions"><Link className="org-menu-icon" href="/" aria-label="Strona główna"><Image src="/dks-cup/figma/org/home.svg" alt="" width={48} height={48} /></Link><UserAccount/></div>
      </header>

      <div className="org-team-form">
        <section className="org-team-match-card"><h2>{team.tournament_name}</h2><div><span>Następny mecz</span><strong>{next ? `${next.home_name} –:– ${next.away_name}` : "– : –"}</strong><hr/><button disabled>Kolejne mecze</button><span>Poprzedni mecz</span><strong>{previous ? `${previous.home_name} ${previous.home_score}:${previous.away_score} ${previous.away_name}` : "– : –"}</strong><hr/><button disabled>Rozegrane mecze</button></div></section>

        <section className="org-team-info-card"><h2>Nazwa</h2><TeamNameEditModal tournamentId={id} teamId={teamId} currentName={team.name} action={updateTeamName} /></section>
        <section className="org-team-info-card"><h2>Logo</h2><TeamLogoEditModal tournamentId={id} teamId={teamId} currentLogoUrl={team.logo_url ? `/dks-cup${team.logo_url}` : null} action={updateTeamLogo} /></section>

        <TeamPlayersCard tournamentId={id} teamId={teamId} players={playersResult.rows} addAction={addPlayer} updateAction={updatePlayer}/>

        <form action={deleteTeam}><input type="hidden" name="tournamentId" value={id}/><input type="hidden" name="teamId" value={teamId}/><button className="org-team-create" type="submit">Usuń drużynę <Image src="/dks-cup/figma/org/forward.svg" alt="" width={20} height={20}/></button></form>
      </div>
    </main>
  );
}
