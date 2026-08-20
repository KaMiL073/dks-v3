import Image from "next/image";
import Link from "next/link";
import { auth } from "@/auth";
import { UserAccount } from "@/components/UserAccount";
import { pool } from "@/lib/db";

export const dynamic = "force-dynamic";

type MatchRow = {
  id: string;
  group_id: string;
  group_name: string;
  home_team_id: string;
  away_team_id: string;
  home_name: string;
  away_name: string;
  home_score: number;
  away_score: number;
  start_time: Date;
  end_time: Date | null;
  status: "scheduled" | "live" | "finished" | "break";
};
type TeamRow = { id: string; name: string; group_id: string; group_name: string };
type RulesRow = { win_points: number; draw_points: number; loss_points: number };
type Standing = { id: string; name: string; matches: number; wins: number; draws: number; losses: number; goalsFor: number; goalsAgainst: number; goalDifference: number; points: number };

const clock = (date: Date | null) => date
  ? date.toLocaleTimeString("pl-PL", { hour: "2-digit", minute: "2-digit", timeZone: "Europe/Warsaw" })
  : "--:--";

export default async function TablePage() {
  const session = await auth();
  const [result, teamsResult, rulesResult] = await Promise.all([pool.query<MatchRow>(`
    SELECT m.id,g.id group_id,g.name group_name,m.home_team_id,m.away_team_id,ht.name home_name,at.name away_name,
      m.home_score,m.away_score,m.start_time,m.end_time,m.status
    FROM matches m
    JOIN tournaments t ON t.id=m.tournament_id
    JOIN groups g ON g.id=m.group_id
    JOIN teams ht ON ht.id=m.home_team_id
    JOIN teams at ON at.id=m.away_team_id
    WHERE t.slug=$1
    ORDER BY g.name,m.start_time,ht.name,at.name
  `, ["dks-cup-2026"]), pool.query<TeamRow>(`
    SELECT tm.id,tm.name,g.id group_id,g.name group_name
    FROM teams tm
    JOIN groups g ON g.id=tm.group_id
    JOIN tournaments t ON t.id=tm.tournament_id
    WHERE t.slug=$1
    ORDER BY g.name,tm.name
  `, ["dks-cup-2026"]), pool.query<RulesRow>(`
    SELECT win_points,draw_points,loss_points FROM tournaments WHERE slug=$1
  `, ["dks-cup-2026"])]);
  const groups = Map.groupBy(result.rows, (match) => `${match.group_id}\u0000${match.group_name}`);
  const rules = rulesResult.rows[0] ?? { win_points: 3, draw_points: 1, loss_points: 0 };
  const standings = calculateStandings(teamsResult.rows, result.rows, rules);

  return <main className="group-table-page">
    <header className="group-table-navigation">
      <Link href="/" aria-label="Wróć do turnieju"><Image src="/dks-cup/figma/org/back-detail.svg" alt="" width={48} height={48} priority/></Link>
      {session?.user ? <UserAccount/> : <span/>}
    </header>
    <section className="standings-card">
      <header><h1>Tabele grupowe</h1><p>Tabela liczy punkty automatycznie po wpisaniu wyników w trybie organizatora. Kolejność: punkty, bilans bramek, bramki zdobyte.</p></header>
      <div className="standings-content">
        {[...standings.entries()].map(([groupName, rows]) => <section key={groupName}>
          <h2>{groupName}</h2>
          <div className="standings-scroll"><table><thead><tr><th>MSC</th><th>Drużyna</th><th>M</th><th>W</th><th>R</th><th>P</th><th>Bramki</th><th>Bilans</th><th>PKT</th></tr></thead><tbody>
            {rows.map((team, index) => <tr key={team.id}><td>{index + 1}</td><td>{team.name}</td><td>{team.matches}</td><td>{team.wins}</td><td>{team.draws}</td><td>{team.losses}</td><td>{team.goalsFor}:{team.goalsAgainst}</td><td>{team.goalDifference > 0 ? `+${team.goalDifference}` : team.goalDifference}</td><td><strong>{team.points}</strong></td></tr>)}
          </tbody></table></div>
        </section>)}
      </div>
    </section>
    <section className="group-table-card">
      <h1>Mecze grupowe</h1>
      <div className="group-table-content">
        {[...groups.entries()].map(([key, matches]) => {
          const groupName = key.split("\u0000")[1];
          return <section key={key}>
            <h2>{groupName}</h2>
            {matches.map((match) => <div className="group-table-row" key={match.id}>
              <strong>{match.home_name} <b>×</b> {match.away_name}</strong>
              <b className="group-table-score">{match.home_score}:{match.away_score}</b>
              <time>{clock(match.start_time)}-{clock(match.end_time)}</time>
            </div>)}
          </section>;
        })}
        {!result.rows.length && <p>Brak meczów grupowych</p>}
      </div>
    </section>
  </main>;
}

function calculateStandings(teams: TeamRow[], matches: MatchRow[], rules: RulesRow) {
  const groupedTeams = Map.groupBy(teams, (team) => team.group_name);
  const result = new Map<string, Standing[]>();
  for (const [groupName, groupTeams] of groupedTeams) {
    const rows = new Map(groupTeams.map((team) => [team.id, { id: team.id, name: team.name, matches: 0, wins: 0, draws: 0, losses: 0, goalsFor: 0, goalsAgainst: 0, goalDifference: 0, points: 0 }]));
    for (const match of matches) {
      if (match.group_name !== groupName || match.status !== "finished") continue;
      const home = rows.get(match.home_team_id); const away = rows.get(match.away_team_id);
      if (!home || !away) continue;
      home.matches++; away.matches++;
      home.goalsFor += match.home_score; home.goalsAgainst += match.away_score;
      away.goalsFor += match.away_score; away.goalsAgainst += match.home_score;
      if (match.home_score > match.away_score) { home.wins++; away.losses++; home.points += rules.win_points; away.points += rules.loss_points; }
      else if (match.home_score < match.away_score) { away.wins++; home.losses++; away.points += rules.win_points; home.points += rules.loss_points; }
      else { home.draws++; away.draws++; home.points += rules.draw_points; away.points += rules.draw_points; }
    }
    const sorted = [...rows.values()].map((team) => ({ ...team, goalDifference: team.goalsFor - team.goalsAgainst })).sort((a, b) => b.points - a.points || b.goalDifference - a.goalDifference || b.goalsFor - a.goalsFor || a.name.localeCompare(b.name, "pl"));
    result.set(groupName, sorted);
  }
  return result;
}
