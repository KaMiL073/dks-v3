"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import { signIn } from "next-auth/react";
import { ArrowIcon } from "./ArrowIcon";

export function LoginModalTrigger() {
  const [open, setOpen] = useState(false);
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);
  const nameInput = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!open) return;
    nameInput.current?.focus();
    const closeOnEscape = (event: KeyboardEvent) => { if (event.key === "Escape") setOpen(false); };
    document.addEventListener("keydown", closeOnEscape);
    document.body.classList.add("modal-open");
    return () => { document.removeEventListener("keydown", closeOnEscape); document.body.classList.remove("modal-open"); };
  }, [open]);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(""); setPending(true);
    const form = new FormData(event.currentTarget);
    const result = await signIn("credentials", { username: form.get("name"), password: form.get("password"), redirect: false });
    setPending(false);
    if (result?.error) { setError("Nieprawidłowa nazwa lub hasło."); return; }
    const sessionResponse = await fetch("/dks-cup/api/auth/session", { cache: "no-store" });
    const session = await sessionResponse.json() as { user?: { role?: string } };
    if (session.user?.role === "ORGANIZER") window.location.assign("/dks-cup/admin");
    else if (session.user?.role === "REFEREE") window.location.assign("/dks-cup/referee");
    else window.location.assign("/dks-cup/");
  }

  return <>
    <button className="action-button action-button--burgundy" type="button" onClick={() => setOpen(true)}><span>Zaloguj się</span><ArrowIcon /></button>
    {open && <div className="login-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setOpen(false); }}>
      <section className="login-modal" role="dialog" aria-modal="true" aria-labelledby="login-title">
        <header><h2 id="login-title">Logowanie</h2><button className="login-close" type="button" onClick={() => setOpen(false)} aria-label="Zamknij okno logowania"><span /></button></header>
        <form onSubmit={submit}>
          <div className="login-fields">
            <label>Nazwa<input ref={nameInput} name="name" autoComplete="username" required /></label>
            <label>Hasło<input name="password" type="password" autoComplete="current-password" required /></label>
          </div>
          {error && <p className="login-error" role="alert">{error}</p>}
          <button className="login-submit" type="submit" disabled={pending}>{pending ? "Logowanie…" : "Zaloguj się"}</button>
        </form>
      </section>
    </div>}
  </>;
}
