"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import type { Match, TournamentState } from "@/types/tournament";
import { TournamentTvCard } from "./TournamentCard";

function formatTime(value: string) {
  return new Intl.DateTimeFormat("pl-PL", { hour: "2-digit", minute: "2-digit", timeZone: "Europe/Warsaw" }).format(new Date(value));
}

function TableRow({ match }: { match: Match }) {
  return <div className="tv-table-row">
    <strong>{match.homeTeam.name} <span>×</span> {match.awayTeam.name}</strong>
    <b>{match.status === "scheduled" ? "-:-" : `${match.homeScore}:${match.awayScore}`}</b>
    <time>{formatTime(match.startTime)}–{match.endTime ? formatTime(match.endTime) : "--:--"}</time>
  </div>;
}

function TvTable({ data }: { data: TournamentState }) {
  const columns = data.pitches.map((pitch) => pitch.matches);
  return <div className="tv-table-layout">
    <section className="tv-table-card">
      <h1>Tabela grupowa</h1>
      <div className="tv-table-columns">
        {columns.map((column, index) => <div className="tv-table-column" key={index}>
          <h2>Grupa {index === 0 ? "A" : "B"}</h2>
          {column.map((match) => <TableRow match={match} key={match.id} />)}
        </div>)}
      </div>
    </section>
    <aside className="tv-qr">
      <h2>Otwórz aplikację na telefonie</h2>
      <a className="tv-qr-code" href="https://dks.pl/dks-cup" aria-label="Otwórz https://dks.pl/dks-cup">
        <Image src="/dks-cup/figma/dks-cup-qr.svg" alt="Kod QR prowadzący do https://dks.pl/dks-cup" width={304} height={304} priority />
      </a>
      <p>https://dks.pl/dks-cup</p>
    </aside>
  </div>;
}

/* Trzeci slajd z pełną drabinką turniejową — pozostawiony do ponownego włączenia.
function BracketMatch({ match, fallback }: { match?: Match; fallback: string }) {
  return <div className="tv-bracket-match">
    <div><span>{match?.homeTeam.name ?? fallback}</span><b>{match && match.status !== "scheduled" ? match.homeScore : "–"}</b></div>
    <div><span>{match?.awayTeam.name ?? "Do ustalenia"}</span><b>{match && match.status !== "scheduled" ? match.awayScore : "–"}</b></div>
    {match && <time>{formatTime(match.startTime)}</time>}
  </div>;
}

function BracketGroupRow({ match }: { match: Match }) {
  return <div className="tv-bracket-group-row">
    <strong>{match.homeTeam.name} <span>×</span> {match.awayTeam.name}</strong>
    <b>{match.status === "scheduled" ? "-:-" : `${match.homeScore}:${match.awayScore}`}</b>
    <time>{formatTime(match.startTime)}</time>
  </div>;
}

function TvBracket({ data }: { data: TournamentState }) {
  const groupA = [...(data.pitches[0]?.matches ?? [])].sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime());
  const groupB = [...(data.pitches[1]?.matches ?? [])].sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime());
  const knockout = [...groupA, ...groupB].sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime()).slice(-15);
  return <section className="tv-bracket-card">
    <header><h1>Drabinka meczów</h1><p>{data.name}</p></header>
    <div className="tv-bracket-flow">
      <div className="tv-bracket-group tv-bracket-group--a">
        <h2>Grupa A</h2>
        <div className="tv-bracket-group-list">{groupA.map((match) => <BracketGroupRow key={match.id} match={match} />)}</div>
      </div>
      <div className="tv-bracket-stage tv-bracket-round-of-16 tv-bracket-round-of-16--a">
        <h2>1/8 finału</h2>
        <div>{[0,1,2,3].map((index) => <BracketMatch key={index} match={knockout[index]} fallback={`1/8 finału ${index + 1}`} />)}</div>
      </div>
      <div className="tv-bracket-stage tv-bracket-stage--quarter-a">
        <h2>Ćwierćfinały</h2>
        <div>{[8,9].map((index) => <BracketMatch key={index} match={knockout[index]} fallback={`Ćwierćfinał ${index - 7}`} />)}</div>
      </div>
      <div className="tv-bracket-stage tv-bracket-stage--semi-a">
        <h2>Półfinał</h2>
        <div><BracketMatch match={knockout[12]} fallback="Zwycięzca ćwierćfinału 1" /></div>
      </div>
      <div className="tv-bracket-stage tv-bracket-final">
        <h2>Finał</h2>
        <div><BracketMatch match={knockout[14]} fallback="Zwycięzca półfinału A" /></div>
      </div>
      <div className="tv-bracket-stage tv-bracket-stage--semi-b">
        <h2>Półfinał</h2>
        <div><BracketMatch match={knockout[13]} fallback="Zwycięzca ćwierćfinału 3" /></div>
      </div>
      <div className="tv-bracket-stage tv-bracket-stage--quarter-b">
        <h2>Ćwierćfinały</h2>
        <div>{[10,11].map((index) => <BracketMatch key={index} match={knockout[index]} fallback={`Ćwierćfinał ${index - 7}`} />)}</div>
      </div>
      <div className="tv-bracket-stage tv-bracket-round-of-16 tv-bracket-round-of-16--b">
        <h2>1/8 finału</h2>
        <div>{[4,5,6,7].map((index) => <BracketMatch key={index} match={knockout[index]} fallback={`1/8 finału ${index + 1}`} />)}</div>
      </div>
      <div className="tv-bracket-group tv-bracket-group--b">
        <h2>Grupa B</h2>
        <div className="tv-bracket-group-list">{groupB.map((match) => <BracketGroupRow key={match.id} match={match} />)}</div>
      </div>
    </div>
  </section>;
}
*/

export function TvRotation({ data, interval = 12000 }: { data: TournamentState; interval?: number }) {
  const [slide, setSlide] = useState(0);
  const [paused, setPaused] = useState(false);
  useEffect(() => {
    if (paused) return;
    const timer = window.setTimeout(() => setSlide((current) => (current + 1) % 2), interval);
    return () => window.clearTimeout(timer);
  }, [interval, paused, slide]);
  return <div className="tv-rotation" aria-live="polite">
    <div className={`tv-slide ${slide === 0 ? "tv-slide--active" : ""}`} aria-hidden={slide !== 0}><TournamentTvCard initial={data} /></div>
    <div className={`tv-slide ${slide === 1 ? "tv-slide--active" : ""}`} aria-hidden={slide !== 1}><TvTable data={data} /></div>
    {/* Trzeci slajd jest tymczasowo wyłączony. */}
    {/* <div className={`tv-slide ${slide === 2 ? "tv-slide--active" : ""}`} aria-hidden={slide !== 2}><TvBracket data={data} /></div> */}
    <div className="tv-slide-controls">
      <div className="tv-slide-dots" aria-label={`Ekran ${slide + 1} z 2`}>
        {[0,1].map((index) => <button key={index} type="button" className={slide === index ? "active" : ""} aria-label={`Pokaż slajd ${index + 1}`} aria-current={slide === index ? "true" : undefined} onClick={() => setSlide(index)} />)}
      </div>
      <button className="tv-slide-play" type="button" aria-label={paused ? "Włącz automatyczne slajdy" : "Wstrzymaj automatyczne slajdy"} onClick={() => setPaused((current) => !current)}>
        {paused
          ? <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5v14l11-7z" /></svg>
          : <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 5h4v14H7zm6 0h4v14h-4z" /></svg>}
      </button>
    </div>
  </div>;
}
