import { ActionButton } from "@/components/ActionButton";
import { LoginModalTrigger } from "@/components/LoginModal";
import { TournamentCard } from "@/components/TournamentCard";
import { TvRotation } from "@/components/TvRotation";
import { UserAccount } from "@/components/UserAccount";
import { auth } from "@/auth";
import { demoTournament } from "@/lib/demo-data";
import { getTournamentState } from "@/lib/db";

export const dynamic = "force-dynamic";
export default async function Home() {
  const session = await auth();
  let data = demoTournament; try { data = await getTournamentState(); } catch {}
  return <main className={`public-shell ${session?.user ? "public-shell--logged-in" : ""}`}>
    {session?.user && <div className="public-account"><UserAccount /></div>}
    <TournamentCard initial={data} />
    <TvRotation data={data} />
    <ActionButton href="/table">Tabela grupowa</ActionButton>
    <div className="public-primary-actions">
      <ActionButton href="/schedule" tone="burgundy">Harmonogram wydarzenia</ActionButton>
      {!session?.user && <LoginModalTrigger />}
    </div>
  </main>;
}
