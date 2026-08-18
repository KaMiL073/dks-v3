"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

type User = { id:string; username:string; email:string; role:"PUBLIC"|"ORGANIZER"|"REFEREE"; tournament_name:string|null };
type Action = (data:FormData)=>Promise<void>;

export function UsersManager({ users, currentUserId, createAction, updateAction, deleteAction }: { users:User[]; currentUserId:string; createAction:Action; updateAction:Action; deleteAction:Action }) {
  const [mode,setMode]=useState<"add"|"edit"|"delete"|null>(null); const [selected,setSelected]=useState<User|null>(null);
  const [query,setQuery]=useState("");
  useEffect(()=>{if(!mode)return;document.body.classList.add("modal-open");return()=>document.body.classList.remove("modal-open");},[mode]);
  const close=()=>{setMode(null);setSelected(null);};
  const normalizedQuery=query.trim().toLocaleLowerCase("pl");
  const visibleUsers=normalizedQuery ? users.filter(user=>[user.username,user.email,user.role,user.tournament_name??""].some(value=>value.toLocaleLowerCase("pl").includes(normalizedQuery))) : users;
  return <>
    <section className="users-card"><header><h2>Użytkownicy</h2><button type="button" onClick={()=>setMode("add")} aria-label="Dodaj użytkownika"><Image src="/dks-cup/figma/org/plus.svg" alt="" width={24} height={24}/></button></header>
      <div className="users-search"><span aria-hidden="true">⌕</span><input type="search" value={query} onChange={event=>setQuery(event.target.value)} placeholder="Szukaj użytkownika" aria-label="Szukaj użytkownika"/></div>
      <div className="users-list">{visibleUsers.map(user=><div className="users-row" key={user.id}><div><strong>{user.username}</strong><span>{user.email}</span><small>{user.role === "ORGANIZER" ? "Organizator" : user.role === "REFEREE" ? "Sędzia" : "Użytkownik"}{user.tournament_name ? ` · ${user.tournament_name}`:""}</small></div><div className="users-row-actions"><button type="button" onClick={()=>{setSelected(user);setMode("edit");}} aria-label={`Edytuj ${user.username}`}><Image src="/dks-cup/figma/org/edit.svg" alt="" width={20} height={20}/></button>{user.id!==currentUserId&&<button type="button" className="users-delete-icon" onClick={()=>{setSelected(user);setMode("delete");}} aria-label={`Usuń ${user.username}`}>×</button>}</div></div>)}{!visibleUsers.length&&<p className="users-empty">Nie znaleziono użytkowników</p>}</div>
    </section>
    {mode&&<div className="team-modal-backdrop" role="presentation" onMouseDown={event=>{if(event.target===event.currentTarget)close();}}><section className="team-modal users-modal" role="dialog" aria-modal="true"><header><h2>{mode==="add"?"Dodaj użytkownika":mode==="edit"?"Edytuj użytkownika":"Usuń użytkownika"}</h2><button className="team-modal-close" type="button" aria-label="Zamknij" onClick={close}/></header>
      {mode==="delete"&&selected?<><p>Czy na pewno chcesz usunąć użytkownika {selected.username}?</p><form action={deleteAction} className="users-delete-form"><input type="hidden" name="userId" value={selected.id}/><button className="users-confirm-delete" type="submit">Usuń</button><button type="button" onClick={close}>Anuluj</button></form></>:
      <form action={mode==="add"?createAction:updateAction}>{selected&&<input type="hidden" name="userId" value={selected.id}/>}<label>Nazwa<input name="username" required maxLength={100} defaultValue={selected?.username??""}/></label><label>E-mail<input name="email" type="email" required maxLength={200} defaultValue={selected?.email??""}/></label><label>Rola<select name="role" required defaultValue={selected?.role??"PUBLIC"}><option value="PUBLIC">Użytkownik</option><option value="REFEREE">Sędzia</option><option value="ORGANIZER">Organizator</option></select></label><label>{mode==="add"?"Hasło":"Nowe hasło (opcjonalnie)"}<input name="password" type="password" required={mode==="add"} minLength={4} maxLength={200}/></label><button type="submit">{mode==="add"?"Dodaj":"Zapisz"}</button></form>}
    </section></div>}
  </>;
}
