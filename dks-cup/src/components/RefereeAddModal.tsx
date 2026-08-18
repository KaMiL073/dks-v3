"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

type Option={id:string;name:string};
export function RefereeAddModal({ tournamentId, referees, pitches, groups, action }: { tournamentId: string; referees:Option[]; pitches:Option[]; groups:Option[]; action: (data: FormData) => Promise<void> }) {
  const [open, setOpen] = useState(false);
  const [assignment,setAssignment]=useState<"pitch"|"group">("pitch");

  useEffect(() => {
    if (!open) return;
    document.body.classList.add("modal-open");
    return () => document.body.classList.remove("modal-open");
  }, [open]);

  return (
    <>
      <button className="org-list-card-add" type="button" onClick={() => setOpen(true)}>
        <h2>Sędziowie</h2><Image src="/dks-cup/figma/org/plus.svg" alt="" width={24} height={24}/>
      </button>
      {open && (
        <div className="team-modal-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setOpen(false); }}>
          <section className="team-modal referee-modal" role="dialog" aria-modal="true" aria-labelledby="referee-modal-title">
            <header><h2 id="referee-modal-title">Dodaj sędziego</h2><button type="button" className="team-modal-close" aria-label="Zamknij" onClick={() => setOpen(false)}/></header>
            <form action={action}>
              <input type="hidden" name="tournamentId" value={tournamentId}/>
              <label>Sędzia<select name="userId" required defaultValue="" autoFocus><option value="" disabled>Wybierz sędziego</option>{referees.map(item=><option value={item.id} key={item.id}>{item.name}</option>)}</select></label>
              <label>Przydziel do<select name="assignmentType" value={assignment} onChange={event=>setAssignment(event.target.value as "pitch"|"group")}><option value="pitch">Boiska</option><option value="group">Grupy</option></select></label>
              {assignment==="pitch"?<label>Boisko<select name="assignmentId" required defaultValue=""><option value="" disabled>Wybierz boisko</option>{pitches.map(item=><option value={item.id} key={item.id}>{item.name}</option>)}</select></label>:<label>Grupa<select name="assignmentId" required defaultValue=""><option value="" disabled>Wybierz grupę</option>{groups.map(item=><option value={item.id} key={item.id}>{item.name}</option>)}</select></label>}
              <button type="submit">Zatwierdź</button>
            </form>
          </section>
        </div>
      )}
    </>
  );
}
