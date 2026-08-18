export type MatchStatus = "scheduled" | "live" | "finished" | "break";
export type Team = { id: string; name: string; logoUrl: string | null };
export type Match = { id: string; startTime: string; endTime: string | null; homeScore: number; awayScore: number; status: MatchStatus; homeTeam: Team; awayTeam: Team };
export type PitchSchedule = { id: string; name: string; matches: Match[]; current: Match | null; previous: Match | null; next: Match | null };
export type TournamentState = { id: string; name: string; pitches: PitchSchedule[] };
