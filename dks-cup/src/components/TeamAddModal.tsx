"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

export function TeamAddModal({ tournamentId, action }: { tournamentId: string; action: (data: FormData) => Promise<void> }) {
  const [open, setOpen] = useState(false);
  useEffect(() => {
    if (!open) return;
    document.body.classList.add("modal-open");
    return () => document.body.classList.remove("modal-open");
  }, [open]);

  return (
    <>
      <button className="org-list-card-add" type="button" onClick={() => setOpen(true)}>
        <h2>Drużyny</h2><Image src="/dks-cup/figma/org/plus.svg" alt="" width={24} height={24} />
      </button>
      {open && (
        <div className="team-modal-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setOpen(false); }}>
          <section className="team-modal" role="dialog" aria-modal="true" aria-labelledby="team-modal-title">
            <header><h2 id="team-modal-title">Dodaj drużynę</h2><button type="button" className="team-modal-close" aria-label="Zamknij" onClick={() => setOpen(false)} /></header>
            <form action={action}>
              <input type="hidden" name="tournamentId" value={tournamentId} />
              <input name="name" type="text" required maxLength={120} autoFocus aria-label="Nazwa drużyny" />
              <button type="submit">Zatwierdź</button>
            </form>
          </section>
        </div>
      )}
    </>
  );
}
