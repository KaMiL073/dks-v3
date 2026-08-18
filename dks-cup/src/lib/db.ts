import { Pool } from "pg";
import type { Match, PitchSchedule, TournamentState } from "@/types/tournament";

const globalPool = globalThis as unknown as { dksCupPool?: Pool };
export const pool = globalPool.dksCupPool ?? new Pool({ connectionString: process.env.DATABASE_URL });
if (process.env.NODE_ENV !== "production") globalPool.dksCupPool = pool;

type Row = { tournament_id: string; tournament_name: string; pitch_id: string; pitch_name: string; match_id: string | null; start_time: Date | null; end_time: Date | null; home_score: number | null; away_score: number | null; status: Match["status"] | null; home_id: string | null; home_name: string | null; home_logo: string | null; away_id: string | null; away_name: string | null; away_logo: string | null };

export async function getTournamentState(slug = "dks-cup-2026"): Promise<TournamentState> {
  const { rows } = await pool.query<Row>(`SELECT t.id tournament_id,t.name tournament_name,p.id pitch_id,p.name pitch_name,m.id match_id,m.start_time,m.end_time,m.home_score,m.away_score,m.status,ht.id home_id,ht.name home_name,ht.logo_url home_logo,at.id away_id,at.name away_name,at.logo_url away_logo FROM tournaments t JOIN pitches p ON p.tournament_id=t.id LEFT JOIN matches m ON m.pitch_id=p.id LEFT JOIN teams ht ON ht.id=m.home_team_id LEFT JOIN teams at ON at.id=m.away_team_id WHERE t.slug=$1 ORDER BY p.position,m.start_time`, [slug]);
  if (!rows.length) throw new Error("Tournament not found");
  const pitches = new Map<string, PitchSchedule>();
  for (const row of rows) {
    const pitch = pitches.get(row.pitch_id) ?? { id: row.pitch_id, name: row.pitch_name, matches: [], current: null, previous: null, next: null };
    if (row.match_id && row.start_time && row.home_id && row.home_name && row.away_id && row.away_name && row.status) {
      const match: Match = { id: row.match_id, startTime: row.start_time.toISOString(), endTime: row.end_time?.toISOString() ?? null, homeScore: row.home_score ?? 0, awayScore: row.away_score ?? 0, status: row.status, homeTeam: { id: row.home_id, name: row.home_name, logoUrl: row.home_logo }, awayTeam: { id: row.away_id, name: row.away_name, logoUrl: row.away_logo } };
      pitch.matches.push(match);
      if (match.status === "live" || match.status === "break") pitch.current = match;
      else if (match.status === "finished") pitch.previous = match;
      else if (!pitch.next) pitch.next = match;
    }
    pitches.set(row.pitch_id, pitch);
  }
  return { id: rows[0].tournament_id, name: rows[0].tournament_name, pitches: [...pitches.values()] };
}
