"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

type Option = { id: string; name: string };
type MatchInfo = { id: string; homeTeamId: string; awayTeamId: string; homeName: string; awayName: string; pitchId: string; groupId: string; startTime: string; endTime: string };
type View = "main" | "teams" | "time" | "pitch" | "group";

export function MatchEditModal({ tournamentId, match, teams, pitches, groups, action }: { tournamentId: string; match: MatchInfo; teams: Option[]; pitches: Option[]; groups: Option[]; action: (data: FormData) => Promise<void> }) {
  const [open, setOpen] = useState(false);
  const [view, setView] = useState<View>("main");
  useEffect(() => { if (!open) return; document.body.classList.add("modal-open"); return () => document.body.classList.remove("modal-open"); }, [open]);
  const close = () => { setOpen(false); setView("main"); };
  const time = (iso: string) => new Date(iso).toLocaleTimeString("pl-PL", { hour: "2-digit", minute: "2-digit", timeZone: "Europe/Warsaw" });
  const titles: Record<View,string> = { main: `${match.homeName} × ${match.awayName}`, teams: "Drużyny", time: "Czas", pitch: "Boisko", group: "Grupa" };

  return <>
    <button type="button" aria-label={`Edytuj mecz ${match.homeName} – ${match.awayName}`} onClick={() => setOpen(true)}><Image src="/dks-cup/figma/org/edit.svg" alt="" width={20} height={20}/></button>
    {open && <div className="team-modal-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) close(); }}>
      <section className="team-modal match-edit-modal" role="dialog" aria-modal="true" aria-labelledby="match-edit-title">
        <header><h2 id="match-edit-title">{titles[view]}</h2><button className="team-modal-close" type="button" aria-label="Zamknij" onClick={view === "main" ? close : () => setView("main")}/></header>
        {view === "main" ? <div className="match-edit-menu">
          {([['teams','Drużyny'],['time','Czas'],['pitch','Boisko'],['group','Grupa']] as const).map(([key,label]) => <button type="button" key={key} onClick={() => setView(key)}><span>{label}</span><Image src="/dks-cup/figma/org/edit.svg" alt="" width={20} height={20}/></button>)}
        </div> : <form action={action} className={`match-edit-form match-edit-${view}`}>
          <input type="hidden" name="tournamentId" value={tournamentId}/><input type="hidden" name="matchId" value={match.id}/><input type="hidden" name="field" value={view}/>
          {view === "teams" && <><label>Wybierz drużynę 1<select name="homeTeamId" defaultValue={match.homeTeamId} required>{teams.map(item=><option key={item.id} value={item.id}>{item.name}</option>)}</select></label><label>Wybierz drużynę 2<select name="awayTeamId" defaultValue={match.awayTeamId} required>{teams.map(item=><option key={item.id} value={item.id}>{item.name}</option>)}</select></label></>}
          {view === "time" && <div className="match-time-pair"><input name="startClock" type="time" defaultValue={time(match.startTime)} required/><b>:</b><input name="endClock" type="time" defaultValue={time(match.endTime)} required/></div>}
          {view === "pitch" && <label>Wybierz boisko<select name="pitchId" defaultValue={match.pitchId} required>{pitches.map(item=><option key={item.id} value={item.id}>{item.name}</option>)}</select></label>}
          {view === "group" && <label>Wybierz grupę<select name="groupId" defaultValue={match.groupId} required>{groups.map(item=><option key={item.id} value={item.id}>{item.name}</option>)}</select></label>}
          <button type="submit">Zatwierdź</button>
        </form>}
      </section>
    </div>}
  </>;
}
