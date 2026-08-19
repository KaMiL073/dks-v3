"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

export function TeamDeleteModal({ tournamentId, teamId, teamName, action }: { tournamentId: string; teamId: string; teamName: string; action: (data: FormData) => Promise<void> }) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    document.body.classList.add("modal-open");
    return () => document.body.classList.remove("modal-open");
  }, [open]);

  return <>
    <button className="org-team-create" type="button" onClick={() => setOpen(true)}>
      Usuń drużynę
      <Image src="/dks-cup/figma/org/forward.svg" alt="" width={20} height={20}/>
    </button>
    {open && <div className="team-modal-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setOpen(false); }}>
      <section className="team-modal tournament-delete-modal" role="alertdialog" aria-modal="true" aria-labelledby="delete-team-title" aria-describedby="delete-team-description">
        <header>
          <h2 id="delete-team-title">Usuwanie drużyny</h2>
          <button className="team-modal-close" type="button" aria-label="Zamknij" onClick={() => setOpen(false)}/>
        </header>
        <p id="delete-team-description">Czy na pewno chcesz usunąć drużynę {teamName}? Tej operacji nie da się cofnąć. Usunięte dane będą utracone bezpowrotnie.</p>
        <form action={action}>
          <input type="hidden" name="tournamentId" value={tournamentId}/>
          <input type="hidden" name="teamId" value={teamId}/>
          <button className="tournament-delete-confirm" type="submit">Usuń</button>
          <button type="button" onClick={() => setOpen(false)}>Anuluj</button>
        </form>
      </section>
    </div>}
  </>;
}
