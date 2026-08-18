import type { Match } from "@/types/tournament";

export function MatchSummary({ label, match, upcoming = false }: { label: string; match: Match | null; upcoming?: boolean }) {
  return <section className="match-summary">
    <span>{label}</span>
    {match ? <div className="summary-score"><strong>{match.homeTeam.name}</strong><b>{upcoming ? "-:-" : `${match.homeScore}:${match.awayScore}`}</b><strong>{match.awayTeam.name}</strong></div> : <p className="empty-match">Brak zaplanowanego meczu</p>}
  </section>;
}
