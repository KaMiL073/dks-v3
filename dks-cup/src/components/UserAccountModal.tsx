"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

export function UserAccountModal({ name, role, icon = "/dks-cup/figma/org/account-detail.svg", avatarUrl, avatarAction, nameAction, passwordAction, logoutAction }: { name?: string | null; role?: string; icon?: string; avatarUrl: string | null; avatarAction: (data:FormData)=>Promise<void>; nameAction:(data:FormData)=>Promise<void>; passwordAction:(data:FormData)=>Promise<void>; logoutAction: () => Promise<void> }) {
  const [open, setOpen] = useState(false);
  const [photoOpen, setPhotoOpen] = useState(false);
  const [nameOpen,setNameOpen]=useState(false);
  const [passwordOpen,setPasswordOpen]=useState(false);
  const [preview,setPreview]=useState(avatarUrl); const [filename,setFilename]=useState(avatarUrl?.split("/").at(-1)??"Nie wybrano pliku"); const fileRef=useRef<HTMLInputElement>(null);
  useEffect(() => { if (!open) return; document.body.classList.add("modal-open"); return () => document.body.classList.remove("modal-open"); }, [open]);
  const roleName = role === "ORGANIZER" ? "Organizator" : role === "REFEREE" ? "Sędzia" : role || "Użytkownik";
  return <>
    <button className="org-account-trigger" type="button" onClick={() => setOpen(true)} aria-label="Konto użytkownika"><Image src={icon} alt="" width={48} height={48}/></button>
    {open && <div className="team-modal-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setOpen(false); }}>
      <section className="team-modal user-account-modal" role="dialog" aria-modal="true" aria-labelledby="user-account-title">
        <header><h2 id="user-account-title">Użytkownik</h2><button className="team-modal-close" type="button" aria-label="Zamknij" onClick={() => setOpen(false)}/></header>
        <button className="user-account-photo" type="button" onClick={()=>setPhotoOpen(true)} aria-label="Zmień zdjęcie użytkownika">{avatarUrl&&<Image src={avatarUrl} alt="Zdjęcie profilowe" fill sizes="242px" unoptimized/>}</button>
        <div className="user-account-file"><span>{avatarUrl?.split("/").at(-1)??"Brak zdjęcia"}</span><button type="button" aria-label="Zmień zdjęcie" onClick={()=>setPhotoOpen(true)}><Image src="/dks-cup/figma/org/edit.svg" alt="" width={20} height={20}/></button></div>
        <div className="user-account-row"><div><strong>Nazwa</strong><span>{name || "Użytkownik"}</span></div><button type="button" aria-label="Zmień nazwę" onClick={()=>setNameOpen(true)}><Image src="/dks-cup/figma/org/edit.svg" alt="" width={20} height={20}/></button></div>
        <div className="user-account-row"><div><strong>Hasło</strong><span>**********</span></div><button type="button" aria-label="Zmień hasło" onClick={()=>setPasswordOpen(true)}><Image src="/dks-cup/figma/org/edit.svg" alt="" width={20} height={20}/></button></div>
        <div className="user-account-row"><div><strong>Rola</strong><span>{roleName}</span></div><button type="button" aria-label="Zmień rolę"><Image src="/dks-cup/figma/org/edit.svg" alt="" width={20} height={20}/></button></div>
        <form action={logoutAction}><button type="submit">Wyloguj się</button></form>
      </section>
      {photoOpen&&<div className="profile-photo-layer"><section className="team-modal profile-photo-modal" role="dialog" aria-modal="true" aria-labelledby="profile-photo-title"><header><h2 id="profile-photo-title">Zdjęcie profilowe</h2><button className="team-modal-close" type="button" aria-label="Zamknij" onClick={()=>setPhotoOpen(false)}/></header><form action={avatarAction}><div className="profile-photo-preview">{preview&&<Image src={preview} alt="Podgląd zdjęcia" fill sizes="242px" unoptimized/>}</div><div className="profile-photo-file"><span>{filename}</span><input ref={fileRef} name="avatar" type="file" accept="image/png,image/jpeg,image/webp" required onChange={event=>{const file=event.target.files?.[0];if(file){setFilename(file.name);setPreview(URL.createObjectURL(file));}}}/><button type="button" onClick={()=>fileRef.current?.click()} aria-label="Wybierz zdjęcie">⇧</button></div><button type="submit">Zmień</button></form></section></div>}
      {nameOpen&&<div className="profile-photo-layer"><section className="team-modal account-field-modal" role="dialog" aria-modal="true" aria-labelledby="account-name-title"><header><h2 id="account-name-title">Nazwa użytkownika</h2><button className="team-modal-close" type="button" aria-label="Zamknij" onClick={()=>setNameOpen(false)}/></header><form action={nameAction}><input name="username" required maxLength={100} defaultValue={name??""} autoFocus aria-label="Nazwa użytkownika"/><button type="submit">Zmień</button></form></section></div>}
      {passwordOpen&&<div className="profile-photo-layer"><section className="team-modal account-password-modal" role="dialog" aria-modal="true" aria-labelledby="account-password-title"><header><h2 id="account-password-title">Zmiana hasła</h2><button className="team-modal-close" type="button" aria-label="Zamknij" onClick={()=>setPasswordOpen(false)}/></header><form action={passwordAction}><label>Aktualne hasło<input name="currentPassword" type="password" required autoComplete="current-password" autoFocus/></label><label>Nowe hasło<input name="newPassword" type="password" required minLength={4} maxLength={200} autoComplete="new-password"/></label><label>Powtórz nowe hasło<input name="repeatPassword" type="password" required minLength={4} maxLength={200} autoComplete="new-password"/></label><button type="submit">Zmień</button></form></section></div>}
    </div>}
  </>;
}
