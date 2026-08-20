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
  home_name: string;
  away_name: string;
  home_score: number;
  away_score: number;
  start_time: Date;
  end_time: Date | null;
};

const clock = (date: Date | null) => date
  ? date.toLocaleTimeString("pl-PL", { hour: "2-digit", minute: "2-digit", timeZone: "Europe/Warsaw" })
  : "--:--";

export default async function TablePage() {
  const session = await auth();
  const result = await pool.query<MatchRow>(`
    SELECT m.id,g.id group_id,g.name group_name,ht.name home_name,at.name away_name,
      m.home_score,m.away_score,m.start_time,m.end_time
    FROM matches m
    JOIN tournaments t ON t.id=m.tournament_id
    JOIN groups g ON g.id=m.group_id
    JOIN teams ht ON ht.id=m.home_team_id
    JOIN teams at ON at.id=m.away_team_id
    WHERE t.slug=$1
    ORDER BY g.name,m.start_time,ht.name,at.name
  `, ["dks-cup-2026"]);
  const groups = Map.groupBy(result.rows, (match) => `${match.group_id}\u0000${match.group_name}`);

  return <main className="group-table-page">
    <header className="group-table-navigation">
      <Link href="/" aria-label="Wróć do turnieju"><Image src="/dks-cup/figma/org/back-detail.svg" alt="" width={48} height={48} priority/></Link>
      {session?.user ? <UserAccount/> : <span/>}
    </header>
    <section className="group-table-card">
      <h1>Tabela grupowa</h1>
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
