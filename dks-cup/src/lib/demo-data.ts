import type { TournamentState } from "@/types/tournament";

const team = (id: string, name: string) => ({ id, name, logoUrl: null });
const now = Date.now();

export const demoTournament: TournamentState = {
  id: "00000000-0000-0000-0000-000000000001",
  name: "DKS CUP 2026",
  pitches: [
    {
      id: "pitch-1", name: "BOISKO 1", matches: [],
      previous: { id: "m1", startTime: new Date(now - 30 * 60000).toISOString(), endTime: new Date(now - 10 * 60000).toISOString(), homeScore: 2, awayScore: 1, status: "finished", homeTeam: team("orly", "Orły"), awayTeam: team("lwy", "Lwy") },
      current: { id: "m2", startTime: new Date(now - 5 * 60000).toISOString(), endTime: null, homeScore: 0, awayScore: 0, status: "live", homeTeam: team("sokoly", "Sokoły"), awayTeam: team("wilki", "Wilki") },
      next: { id: "m3", startTime: new Date(now + 20 * 60000).toISOString(), endTime: null, homeScore: 0, awayScore: 0, status: "scheduled", homeTeam: team("orly", "Orły"), awayTeam: team("sokoly", "Sokoły") },
    },
    { id: "pitch-2", name: "BOISKO 2", matches: [], previous: null, current: null, next: null },
  ],
};
