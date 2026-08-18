"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

export function TeamNameEditModal({ tournamentId, teamId, currentName, action }: { tournamentId: string; teamId: string; currentName: string; action: (data: FormData) => Promise<void> }) {
  const [open, setOpen] = useState(false);
  useEffect(() => {
    if (!open) return;
    document.body.classList.add("modal-open");
    return () => document.body.classList.remove("modal-open");
  }, [open]);

  return (
    <>
      <button className="org-team-name-trigger" type="button" onClick={() => setOpen(true)}>
        <span>{currentName}</span><Image src="/dks-cup/figma/org/more.svg" alt="" width={28} height={8} />
      </button>
      {open && (
        <div className="team-modal-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setOpen(false); }}>
          <section className="team-modal team-name-modal" role="dialog" aria-modal="true" aria-labelledby="team-name-title">
            <header><h2 id="team-name-title">Nazwa drużyny</h2><button type="button" className="team-modal-close" aria-label="Zamknij" onClick={() => setOpen(false)} /></header>
            <form action={action}>
              <input type="hidden" name="tournamentId" value={tournamentId} />
              <input type="hidden" name="teamId" value={teamId} />
              <input name="name" type="text" required maxLength={120} defaultValue={currentName} autoFocus aria-label="Nazwa drużyny" />
              <button type="submit">Zmień</button>
            </form>
          </section>
        </div>
      )}
    </>
  );
}
