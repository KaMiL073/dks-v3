import Image from "next/image";
import type { Team } from "@/types/tournament";

export function TeamBadge({ team }: { team: Team }) {
  return <div className="team-badge"><div className="team-logo">{team.logoUrl ? <Image src={team.logoUrl} alt="" width={64} height={64} unoptimized /> : <span>{team.name.slice(0, 1)}</span>}</div><strong>{team.name}</strong></div>;
}
