"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

type Player = { id: string; name: string };
type PlayerAction = (data: FormData) => Promise<void>;

export function TeamPlayersCard({ tournamentId, teamId, players, addAction, updateAction }: { tournamentId: string; teamId: string; players: Player[]; addAction: PlayerAction; updateAction: PlayerAction }) {
  const [mode, setMode] = useState<"add" | "edit" | null>(null);
  const [selected, setSelected] = useState<Player | null>(null);

  useEffect(() => {
    if (!mode) return;
    document.body.classList.add("modal-open");
    return () => document.body.classList.remove("modal-open");
  }, [mode]);

  function close() { setMode(null); setSelected(null); }
  function edit(player: Player) { setSelected(player); setMode("edit"); }

  return (
    <>
      <section className="org-team-players-card">
        <h2>Zawodnicy <button type="button" onClick={() => setMode("add")} aria-label="Dodaj zawodnika"><Image src="/dks-cup/figma/org/plus.svg" alt="" width={24} height={24}/></button></h2>
        <div className="org-player-list">
          {players.length ? players.map((player) => <div className="org-player-row" key={player.id}><span>{player.name}</span><button type="button" onClick={() => edit(player)} aria-label={`Edytuj ${player.name}`}><Image src="/dks-cup/figma/org/edit.svg" alt="" width={20} height={20}/></button></div>) : <p>Brak zawodników</p>}
        </div>
      </section>

      {mode && (
        <div className="team-modal-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) close(); }}>
          <section className="team-modal player-modal" role="dialog" aria-modal="true" aria-labelledby="player-modal-title">
            <header><h2 id="player-modal-title">{mode === "add" ? "Dodaj zawodnika" : "Nazwa zawodnika"}</h2><button type="button" className="team-modal-close" aria-label="Zamknij" onClick={close}/></header>
            <form action={mode === "add" ? addAction : updateAction}>
              <input type="hidden" name="tournamentId" value={tournamentId}/><input type="hidden" name="teamId" value={teamId}/>
              {selected && <input type="hidden" name="playerId" value={selected.id}/>}
              <input name="name" required maxLength={120} defaultValue={selected?.name ?? ""} autoFocus aria-label="Nazwa zawodnika"/>
              <button type="submit">{mode === "add" ? "Zatwierdź" : "Zmień"}</button>
            </form>
          </section>
        </div>
      )}
    </>
  );
}
