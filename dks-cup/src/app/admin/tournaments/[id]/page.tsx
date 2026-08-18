import Image from "next/image";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { pool } from "@/lib/db";
import { TeamAddModal } from "@/components/TeamAddModal";
import { RefereeAddModal } from "@/components/RefereeAddModal";
import { RefereeEditModal } from "@/components/RefereeEditModal";
import { RefereeDeleteModal } from "@/components/RefereeDeleteModal";
import { TournamentDeleteModal } from "@/components/TournamentDeleteModal";
import { UserAccount } from "@/components/UserAccount";

type NamedRow = { id: string; name: string; assignment?: string|null };

async function ensureRefereesTable() {
  await pool.query(`CREATE TABLE IF NOT EXISTS tournament_referees (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    tournament_id uuid NOT NULL REFERENCES tournaments ON DELETE CASCADE,
    name text NOT NULL,
    created_at timestamptz NOT NULL DEFAULT now()
  )`);
  await pool.query(`ALTER TABLE tournament_referees ADD COLUMN IF NOT EXISTS user_id uuid REFERENCES users(id) ON DELETE CASCADE`);
  await pool.query(`ALTER TABLE tournament_referees ADD COLUMN IF NOT EXISTS pitch_id uuid REFERENCES pitches(id) ON DELETE CASCADE`);
  await pool.query(`ALTER TABLE tournament_referees ADD COLUMN IF NOT EXISTS group_id uuid REFERENCES groups(id) ON DELETE CASCADE`);
}

async function requireOrganizer() {
  const session = await auth();
  if (!session?.user || session.user.role !== "ORGANIZER") redirect("/");
  return session;
}

async function addTeam(formData: FormData) {
  "use server";
  await requireOrganizer();
  const tournamentId = String(formData.get("tournamentId") ?? "");
  const name = String(formData.get("name") ?? "").trim();
  if (!tournamentId || !name || name.length > 120) return;
  await pool.query(
    `INSERT INTO teams (tournament_id, group_id, name)
     SELECT $1, id, $2 FROM groups WHERE tournament_id=$1 ORDER BY name LIMIT 1`,
    [tournamentId, name],
  );
  revalidatePath(`/admin/tournaments/${tournamentId}`);
}

async function addReferee(formData: FormData) {
  "use server";
  await requireOrganizer();
  await ensureRefereesTable();
  const tournamentId = String(formData.get("tournamentId") ?? "");
  const userId = String(formData.get("userId") ?? "");
  const assignmentType = String(formData.get("assignmentType") ?? "");
  const assignmentId = String(formData.get("assignmentId") ?? "");
  if (!tournamentId || !userId || !assignmentId || !["pitch","group"].includes(assignmentType)) return;
  const column=assignmentType==="pitch"?"pitch_id":"group_id"; const table=assignmentType==="pitch"?"pitches":"groups";
  await pool.query(`INSERT INTO tournament_referees(tournament_id,user_id,name,${column}) SELECT $1,u.id,u.username,a.id FROM users u JOIN ${table} a ON a.id=$3 AND a.tournament_id=$1 WHERE u.id=$2 AND u.role='REFEREE' AND NOT EXISTS(SELECT 1 FROM tournament_referees tr WHERE tr.tournament_id=$1 AND tr.user_id=$2)`,[tournamentId,userId,assignmentId]);
  await pool.query(`UPDATE users SET tournament_id=$1 WHERE id=$2 AND role='REFEREE'`,[tournamentId,userId]);
  revalidatePath(`/admin/tournaments/${tournamentId}`);
}

async function updateReferee(formData: FormData) {
  "use server";
  await requireOrganizer();
  await ensureRefereesTable();
  const tournamentId = String(formData.get("tournamentId") ?? "");
  const refereeId = String(formData.get("refereeId") ?? "");
  const name = String(formData.get("name") ?? "").trim();
  if (!tournamentId || !refereeId || !name || name.length > 120) return;
  await pool.query(`UPDATE tournament_referees SET name=$1 WHERE id=$2 AND tournament_id=$3`, [name, refereeId, tournamentId]);
  revalidatePath(`/admin/tournaments/${tournamentId}`);
}

async function deleteReferee(formData: FormData) {
  "use server";
  await requireOrganizer();
  const tournamentId=String(formData.get("tournamentId")??""); const refereeId=String(formData.get("refereeId")??"");
  if(!tournamentId||!refereeId)return;
  await pool.query(`DELETE FROM tournament_referees WHERE id=$1 AND tournament_id=$2`,[refereeId,tournamentId]);
  revalidatePath(`/admin/tournaments/${tournamentId}`);
}

async function deleteTournament(formData: FormData) {
  "use server";
  await requireOrganizer();
  const tournamentId = String(formData.get("tournamentId") ?? "");
  if (!tournamentId) return;
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    await client.query(`DELETE FROM tournaments WHERE id=$1`, [tournamentId]);
    await client.query("COMMIT");
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
  revalidatePath("/admin");
  redirect("/admin");
}

export default async function TournamentPage({ params }: { params: Promise<{ id: string }> }) {
  await requireOrganizer();
  await ensureRefereesTable();
  const { id } = await params;
  const [tournamentResult, teamsResult, refereesResult, refereeUsersResult, pitchesResult, groupsResult] = await Promise.all([
    pool.query<NamedRow>(`SELECT id, name FROM tournaments WHERE id=$1`, [id]),
    pool.query<NamedRow>(`SELECT id, name FROM teams WHERE tournament_id=$1 ORDER BY name`, [id]),
    pool.query<NamedRow>(`SELECT tr.id,COALESCE(u.username,tr.name) name,COALESCE('Boisko: '||p.name,'Grupa: '||g.name) assignment FROM tournament_referees tr LEFT JOIN users u ON u.id=tr.user_id LEFT JOIN pitches p ON p.id=tr.pitch_id LEFT JOIN groups g ON g.id=tr.group_id WHERE tr.tournament_id=$1 ORDER BY tr.created_at`, [id]),
    pool.query<NamedRow>(`SELECT id,username name FROM users WHERE role='REFEREE' ORDER BY username`),
    pool.query<NamedRow>(`SELECT id,name FROM pitches WHERE tournament_id=$1 ORDER BY position`,[id]),
    pool.query<NamedRow>(`SELECT id,name FROM groups WHERE tournament_id=$1 ORDER BY name`,[id]),
  ]);
  const tournament = tournamentResult.rows[0];
  if (!tournament) notFound();
  const teams = teamsResult.rows;

  return (
    <main className="org-main org-tournament-detail">
      <header className="org-detail-menu">
        <Link className="org-menu-icon" href="/admin" aria-label="Wróć">
          <Image src="/dks-cup/figma/org/back-detail.svg" alt="" width={48} height={48} priority />
        </Link>
        <h1>{tournament.name}</h1>
        <div className="org-detail-menu-actions">
          <Link className="org-menu-icon" href="/" aria-label="Strona główna">
            <Image src="/dks-cup/figma/org/home.svg" alt="" width={48} height={48} />
          </Link>
          <UserAccount/>
        </div>
      </header>

      <section className="org-detail-content">
        <ListCard title="Drużyny" items={teams} tournamentId={id} teamAction={addTeam} editBaseHref={`/admin/tournaments/${id}/teams`} />
        <ListCard title="Sędziowie" items={refereesResult.rows} refereeAction={addReferee} refereeEditAction={updateReferee} refereeDeleteAction={deleteReferee} refereeUsers={refereeUsersResult.rows} pitches={pitchesResult.rows} groups={groupsResult.rows} tournamentId={id} />

        <Link className="org-schedule-link" href={`/admin/tournaments/${id}/schedule`}><span>Harmonogram</span><Image src="/dks-cup/figma/org/forward.svg" alt="" width={20} height={20}/></Link>
        <TournamentDeleteModal tournamentId={id} tournamentName={tournament.name} action={deleteTournament}/>
      </section>
    </main>
  );
}

function ListCard({ title, items, tournamentId, teamAction, refereeAction, refereeEditAction, refereeDeleteAction, refereeUsers=[], pitches=[], groups=[], editBaseHref }: { title: string; items: NamedRow[]; tournamentId?: string; teamAction?: (data: FormData) => Promise<void>; refereeAction?: (data: FormData) => Promise<void>; refereeEditAction?: (data: FormData) => Promise<void>;refereeDeleteAction?:(data:FormData)=>Promise<void>; refereeUsers?:NamedRow[];pitches?:NamedRow[];groups?:NamedRow[];editBaseHref?: string }) {
  return (
    <section className="org-list-card">
      {teamAction && tournamentId ? (
        <TeamAddModal tournamentId={tournamentId} action={teamAction} />
      ) : refereeAction && tournamentId ? (
        <RefereeAddModal tournamentId={tournamentId} referees={refereeUsers} pitches={pitches} groups={groups} action={refereeAction}/>
      ) : (
        <div className="org-list-card-add"><h2>{title}</h2></div>
      )}
      <div className="org-list-items">
        {items.map((item) => <div key={item.id}><span>{item.name}{item.assignment&&<small className="referee-assignment">{item.assignment}</small>}</span><div className="referee-row-actions">{editBaseHref ? <Link href={`${editBaseHref}/${item.id}`} aria-label={`Edytuj ${item.name}`}><Image src="/dks-cup/figma/org/edit.svg" alt="" width={20} height={20} /></Link> : refereeEditAction && tournamentId ? <RefereeEditModal tournamentId={tournamentId} refereeId={item.id} currentName={item.name} action={refereeEditAction}/> : <Image src="/dks-cup/figma/org/edit.svg" alt="" width={20} height={20} />}{refereeDeleteAction&&tournamentId&&<RefereeDeleteModal tournamentId={tournamentId} refereeId={item.id} name={item.name} action={refereeDeleteAction}/>}</div></div>)}
        {!items.length && <p>Brak pozycji</p>}
      </div>
    </section>
  );
}
