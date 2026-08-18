import type { Match } from "@/types/tournament";
import { TeamBadge } from "./TeamBadge";

function clock(start: string) { const mins = Math.max(0, Math.floor((Date.now() - new Date(start).getTime()) / 60000)); return `${String(mins).padStart(2, "0")}:00`; }
export function CurrentMatch({ match, pitchName }: { match: Match | null; pitchName?: string }) {
  if (!match) return <section className="current-match current-match--empty">{pitchName && <h2>{pitchName}</h2>}<strong>Przerwa</strong><span>Oczekiwanie na kolejny mecz</span></section>;
  return <section className="current-match">{pitchName && <h2>{pitchName}</h2>}<div className="match-time" suppressHydrationWarning>{clock(match.startTime)} - --:--</div><div className="match-points"><TeamBadge team={match.homeTeam} /><b>{match.homeScore}:{match.awayScore}</b><TeamBadge team={match.awayTeam} /></div></section>;
}
