import "next-auth";
import "next-auth/jwt";

type Role = "PUBLIC" | "ORGANIZER" | "REFEREE";

declare module "next-auth" {
  interface User { role: Role; tournamentId: string | null }
  interface Session { user: { id: string; role: Role; tournamentId: string | null; name?: string | null; email?: string | null; image?: string | null } }
}
declare module "next-auth/jwt" { interface JWT { role: Role; tournamentId: string | null } }
