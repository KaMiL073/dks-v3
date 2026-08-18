"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

type Props = {
  tournamentId: string;
  teamId: string;
  currentLogoUrl: string | null;
  action: (data: FormData) => Promise<void>;
};

export function TeamLogoEditModal({ tournamentId, teamId, currentLogoUrl, action }: Props) {
  const [open, setOpen] = useState(false);
  const [preview, setPreview] = useState(currentLogoUrl);
  const [filename, setFilename] = useState(currentLogoUrl?.split("/").at(-1) ?? "Nie wybrano pliku");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!open) return;
    document.body.classList.add("modal-open");
    return () => document.body.classList.remove("modal-open");
  }, [open]);

  useEffect(() => () => {
    if (preview?.startsWith("blob:")) URL.revokeObjectURL(preview);
  }, [preview]);

  function selectFile(file?: File) {
    if (!file) return;
    setPreview((previous) => {
      if (previous?.startsWith("blob:")) URL.revokeObjectURL(previous);
      return URL.createObjectURL(file);
    });
    setFilename(file.name);
  }

  function close() {
    setOpen(false);
    setPreview(currentLogoUrl);
    setFilename(currentLogoUrl?.split("/").at(-1) ?? "Nie wybrano pliku");
  }

  return (
    <>
      <button className="org-team-logo-trigger" type="button" onClick={() => setOpen(true)}>
        {currentLogoUrl ? <Image src={currentLogoUrl} alt="Logo drużyny" width={64} height={64} unoptimized /> : <span>Brak logo</span>}
        <span>{currentLogoUrl ? "Zmień lub usuń logo" : "Dodaj logo"}</span>
        <Image src="/dks-cup/figma/org/more.svg" alt="" width={28} height={8} />
      </button>

      {open && (
        <div className="team-modal-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) close(); }}>
          <section className="team-modal team-logo-modal" role="dialog" aria-modal="true" aria-labelledby="team-logo-title">
            <header><h2 id="team-logo-title">Logo drużyny</h2><button type="button" className="team-modal-close" aria-label="Zamknij" onClick={close} /></header>
            <form action={action}>
              <input type="hidden" name="tournamentId" value={tournamentId} />
              <input type="hidden" name="teamId" value={teamId} />
              <div className="team-logo-preview">
                {preview ? <Image src={preview} alt="Podgląd logo drużyny" fill sizes="242px" unoptimized /> : <span>Brak logo</span>}
              </div>
              <div className="team-logo-file-row">
                <span title={filename}>{filename}</span>
                <input ref={inputRef} name="logo" type="file" accept="image/png,image/jpeg,image/webp,image/svg+xml" onChange={(event) => selectFile(event.target.files?.[0])} />
                <button className="team-logo-file-button" type="button" onClick={() => inputRef.current?.click()} aria-label="Wybierz plik logo">⇧</button>
              </div>
              <div className="team-logo-actions">
                {currentLogoUrl && <button className="team-logo-remove" type="submit" name="removeLogo" value="true">Usuń logo</button>}
                <button type="submit">Zmień</button>
              </div>
            </form>
          </section>
        </div>
      )}
    </>
  );
}
