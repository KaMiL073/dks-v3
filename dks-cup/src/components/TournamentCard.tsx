"use client";
import { useEffect, useState } from "react";
import type { TournamentState } from "@/types/tournament";
import { ArrowIcon } from "./ArrowIcon";
import { CurrentMatch } from "./CurrentMatch";
import { MatchSummary } from "./MatchSummary";

export function TournamentCard({ initial }: { initial: TournamentState }) {
  const [data, setData] = useState(initial); const [active, setActive] = useState(0);
  useEffect(() => { const id = window.setInterval(async () => { const r = await fetch("/dks-cup/api/tournament", { cache: "no-store" }); if (r.ok) setData(await r.json()); }, 3000); return () => window.clearInterval(id); }, []);
  return <div className="tournament-card tournament-card--mobile">
    <h1>{data.name}</h1>
    {data.pitches.map((pitch, index) => <div className="pitch" key={pitch.id}>
      <button className="pitch-toggle" onClick={() => setActive(index)} aria-expanded={active === index}><span>{pitch.name}</span><ArrowIcon direction={active === index ? "up" : "down"} /></button>
      {active === index && <div className="pitch-content">
        <div className="other-matches"><button className="small-button">Kolejne mecze</button><MatchSummary label="Następny mecz" match={pitch.next} upcoming /></div>
        <CurrentMatch match={pitch.current} />
        <div className="other-matches"><MatchSummary label="Poprzedni mecz" match={pitch.previous} /><button className="small-button">Rozegrane mecze</button></div>
      </div>}
    </div>)}
  </div>;
}

export function TournamentTvCard({ initial }: { initial: TournamentState }) {
  const [data, setData] = useState(initial);
  useEffect(() => { const id = window.setInterval(async () => { const r = await fetch("/dks-cup/api/tournament", { cache: "no-store" }); if (r.ok) setData(await r.json()); }, 3000); return () => window.clearInterval(id); }, []);
  return <div className="tournament-card tournament-card--tv">
    <h1>{data.name}</h1>
    <div className="tv-pitches">
      {data.pitches.map((pitch) => <section className="tv-pitch" key={pitch.id}>
        <div className="other-matches tv-previous"><MatchSummary label="Poprzedni mecz" match={pitch.previous} /><button className="small-button">Rozegrane mecze</button></div>
        <CurrentMatch match={pitch.current} pitchName={pitch.name} />
        <div className="other-matches tv-next"><MatchSummary label="Następny mecz" match={pitch.next} upcoming /><button className="small-button">Kolejne mecze</button></div>
      </section>)}
    </div>
  </div>;
}
