import Image from "next/image";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { pool } from "@/lib/db";
import { MatchEditModal } from "@/components/MatchEditModal";

type NamedRow = { id: string; name: string };
type MatchRow = { id: string; home_team_id: string; away_team_id: string; home_name: string; away_name: string; start_time: Date; end_time: Date; pitch_id: string; pitch_name: string; group_id: string; group_name: string };

async function requireOrganizer() {
  const session = await auth();
  if (!session?.user || session.user.role !== "ORGANIZER") redirect("/");
}

async function addMatch(formData: FormData) {
  "use server";
  await requireOrganizer();
  const tournamentId = String(formData.get("tournamentId") ?? "");
  const groupId = String(formData.get("groupId") ?? "");
  const pitchId = String(formData.get("pitchId") ?? "");
  const homeTeamId = String(formData.get("homeTeamId") ?? "");
  const awayTeamId = String(formData.get("awayTeamId") ?? "");
  const matchDate = String(formData.get("matchDate") ?? "");
  const startClock = String(formData.get("startClock") ?? "");
  const endClock = String(formData.get("endClock") ?? "");
  const startTime = new Date(`${matchDate}T${startClock}:00`);
  const endTime = new Date(`${matchDate}T${endClock}:00`);
  if (!tournamentId || !groupId || !pitchId || !homeTeamId || !awayTeamId || homeTeamId === awayTeamId || Number.isNaN(startTime.getTime()) || Number.isNaN(endTime.getTime()) || endTime <= startTime) return;
  await pool.query(`INSERT INTO matches (tournament_id,group_id,pitch_id,home_team_id,away_team_id,start_time,end_time) SELECT $1,g.id,p.id,ht.id,at.id,$6,$7 FROM groups g,pitches p,teams ht,teams at WHERE g.id=$2 AND p.id=$3 AND ht.id=$4 AND at.id=$5 AND g.tournament_id=$1 AND p.tournament_id=$1 AND ht.tournament_id=$1 AND at.tournament_id=$1`, [tournamentId,groupId,pitchId,homeTeamId,awayTeamId,startTime,endTime]);
  revalidatePath(`/admin/tournaments/${tournamentId}/schedule`);
}

async function updateMatch(formData: FormData) {
  "use server";
  await requireOrganizer();
  const tournamentId=String(formData.get("tournamentId")??""); const matchId=String(formData.get("matchId")??""); const field=String(formData.get("field")??"");
  if (!tournamentId || !matchId) return;
  if (field === "teams") {
    const home=String(formData.get("homeTeamId")??""); const away=String(formData.get("awayTeamId")??""); if (!home || !away || home===away) return;
    await pool.query(`UPDATE matches m SET home_team_id=ht.id,away_team_id=at.id,updated_at=now() FROM teams ht,teams at WHERE m.id=$1 AND m.tournament_id=$2 AND ht.id=$3 AND at.id=$4 AND ht.tournament_id=$2 AND at.tournament_id=$2`,[matchId,tournamentId,home,away]);
  } else if (field === "pitch" || field === "group") {
    const value=String(formData.get(field === "pitch" ? "pitchId" : "groupId")??""); const table=field === "pitch" ? "pitches" : "groups"; const column=field === "pitch" ? "pitch_id" : "group_id";
    await pool.query(`UPDATE matches SET ${column}=$1,updated_at=now() WHERE id=$2 AND tournament_id=$3 AND EXISTS (SELECT 1 FROM ${table} WHERE id=$1 AND tournament_id=$3)`,[value,matchId,tournamentId]);
  } else if (field === "time") {
    const current=await pool.query<{start_time:Date}>(`SELECT start_time FROM matches WHERE id=$1 AND tournament_id=$2`,[matchId,tournamentId]); if (!current.rows[0]) return;
    const date=current.rows[0].start_time.toLocaleDateString("sv-SE",{timeZone:"Europe/Warsaw"}); const start=new Date(`${date}T${String(formData.get("startClock")??"")}:00`); const end=new Date(`${date}T${String(formData.get("endClock")??"")}:00`); if (Number.isNaN(start.getTime())||Number.isNaN(end.getTime())||end<=start) return;
    await pool.query(`UPDATE matches SET start_time=$1,end_time=$2,updated_at=now() WHERE id=$3 AND tournament_id=$4`,[start,end,matchId,tournamentId]);
  }
  revalidatePath(`/admin/tournaments/${tournamentId}/schedule`);
}

export default async function SchedulePage({ params }: { params: Promise<{ id: string }> }) {
  await requireOrganizer();
  const { id } = await params;
  const [tournamentResult, teamsResult, groupsResult, pitchesResult, matchesResult] = await Promise.all([
    pool.query<NamedRow>(`SELECT id,name FROM tournaments WHERE id=$1`, [id]),
    pool.query<NamedRow>(`SELECT id,name FROM teams WHERE tournament_id=$1 ORDER BY name`, [id]),
    pool.query<NamedRow>(`SELECT id,name FROM groups WHERE tournament_id=$1 ORDER BY name`, [id]),
    pool.query<NamedRow>(`SELECT id,name FROM pitches WHERE tournament_id=$1 ORDER BY position`, [id]),
    pool.query<MatchRow>(`SELECT m.id,m.home_team_id,m.away_team_id,ht.name home_name,at.name away_name,m.start_time,m.end_time,m.pitch_id,p.name pitch_name,m.group_id,g.name group_name FROM matches m JOIN teams ht ON ht.id=m.home_team_id JOIN teams at ON at.id=m.away_team_id JOIN pitches p ON p.id=m.pitch_id JOIN groups g ON g.id=m.group_id WHERE m.tournament_id=$1 ORDER BY p.position,g.name,m.start_time`, [id]),
  ]);
  const tournament = tournamentResult.rows[0];
  if (!tournament) notFound();
  const scheduleGroups = Map.groupBy(matchesResult.rows, (match) => `${match.pitch_name}\u0000${match.group_name}`);

  return <main className="org-main org-schedule-page">
    <header className="org-detail-menu"><Link className="org-menu-icon" href={`/admin/tournaments/${id}`} aria-label="Wróć"><Image src="/dks-cup/figma/org/back-detail.svg" alt="" width={48} height={48} priority/></Link><h1>{tournament.name}</h1><Link className="org-menu-icon" href="/" aria-label="Strona główna"><Image src="/dks-cup/figma/org/home.svg" alt="" width={48} height={48}/></Link></header>
    <div className="org-schedule-cards org-schedule-page-cards">
      {[...scheduleGroups.entries()].map(([key,matches]) => { const [pitchName,groupName]=key.split("\u0000"); return <section className="org-schedule-card" key={key}><h3>{pitchName} – {groupName}</h3><div className="org-schedule-match-list">{matches.map(match=><div className="org-schedule-match" key={match.id}><strong>{match.home_name} <b>×</b> {match.away_name}</strong><time>{match.start_time.toLocaleTimeString("pl-PL",{hour:"2-digit",minute:"2-digit",timeZone:"Europe/Warsaw"})}</time><MatchEditModal tournamentId={id} match={{id:match.id,homeTeamId:match.home_team_id,awayTeamId:match.away_team_id,homeName:match.home_name,awayName:match.away_name,pitchId:match.pitch_id,groupId:match.group_id,startTime:match.start_time.toISOString(),endTime:match.end_time.toISOString()}} teams={teamsResult.rows} pitches={pitchesResult.rows} groups={groupsResult.rows} action={updateMatch}/></div>)}</div></section>; })}
      {!matchesResult.rows.length && <span>Brak zaplanowanych meczów</span>}
    </div>
    <form action={addMatch} className="org-inline-form org-match-form org-schedule-add-form"><input type="hidden" name="tournamentId" value={id}/><select name="groupId" required defaultValue=""><option value="" disabled>Grupa</option>{groupsResult.rows.map(row=><option value={row.id} key={row.id}>{row.name}</option>)}</select><select name="pitchId" required defaultValue=""><option value="" disabled>Boisko</option>{pitchesResult.rows.map(row=><option value={row.id} key={row.id}>{row.name}</option>)}</select><select name="homeTeamId" required defaultValue=""><option value="" disabled>Drużyna 1</option>{teamsResult.rows.map(row=><option value={row.id} key={row.id}>{row.name}</option>)}</select><select name="awayTeamId" required defaultValue=""><option value="" disabled>Drużyna 2</option>{teamsResult.rows.map(row=><option value={row.id} key={row.id}>{row.name}</option>)}</select><label className="org-match-time-field"><span>Data meczu</span><input name="matchDate" type="date" required/></label><label className="org-match-time-field"><span>Godzina rozpoczęcia meczu</span><input name="startClock" type="time" required/></label><label className="org-match-time-field"><span>Godzina zakończenia meczu</span><input name="endClock" type="time" required/></label><button type="submit" disabled={teamsResult.rows.length<2}>Dodaj mecz</button></form>
  </main>;
}
