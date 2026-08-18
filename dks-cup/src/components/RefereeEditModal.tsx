"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

export function RefereeEditModal({ tournamentId, refereeId, currentName, action }: { tournamentId: string; refereeId: string; currentName: string; action: (data: FormData) => Promise<void> }) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    document.body.classList.add("modal-open");
    return () => document.body.classList.remove("modal-open");
  }, [open]);

  return (
    <>
      <button className="org-list-edit-button" type="button" onClick={() => setOpen(true)} aria-label={`Edytuj ${currentName}`}><Image src="/dks-cup/figma/org/edit.svg" alt="" width={20} height={20}/></button>
      {open && (
        <div className="team-modal-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setOpen(false); }}>
          <section className="team-modal referee-modal" role="dialog" aria-modal="true" aria-labelledby="referee-edit-title">
            <header><h2 id="referee-edit-title">Zmień sędziego</h2><button type="button" className="team-modal-close" aria-label="Zamknij" onClick={() => setOpen(false)}/></header>
            <form action={action}>
              <input type="hidden" name="tournamentId" value={tournamentId}/><input type="hidden" name="refereeId" value={refereeId}/>
              <input name="name" type="text" required maxLength={120} defaultValue={currentName} autoFocus aria-label="Imię i nazwisko sędziego"/>
              <button type="submit">Zatwierdź</button>
            </form>
          </section>
        </div>
      )}
    </>
  );
}
