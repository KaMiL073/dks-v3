import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { pool } from "@/lib/db";

type UserRow = { id: string; username: string; email: string; role: "PUBLIC" | "ORGANIZER" | "REFEREE"; tournament_id: string | null };

export const { handlers, auth, signOut } = NextAuth({
  basePath: "/api/auth",
  trustHost: true,
  session: { strategy: "jwt", maxAge: 8 * 60 * 60 },
  pages: { signIn: "/" },
  providers: [Credentials({
    name: "Nazwa i hasło",
    credentials: { username: { label: "Nazwa", type: "text" }, password: { label: "Hasło", type: "password" } },
    async authorize(credentials) {
      const username = typeof credentials?.username === "string" ? credentials.username.trim() : "";
      const password = typeof credentials?.password === "string" ? credentials.password : "";
      if (!username || !password || username.length > 100 || password.length > 200) return null;
      const { rows } = await pool.query<UserRow>(`SELECT id, username, email, role, tournament_id FROM users WHERE username = $1 AND password_hash = crypt($2, password_hash) LIMIT 1`, [username, password]);
      const user = rows[0];
      if (!user) return null;
      return { id: user.id, name: user.username, email: user.email, role: user.role, tournamentId: user.tournament_id };
    },
  })],
  callbacks: {
    jwt({ token, user }) { if (user) { token.role = user.role; token.tournamentId = user.tournamentId; } return token; },
    session({ session, token }) { if (session.user) { session.user.id = token.sub ?? ""; session.user.role = token.role; session.user.tournamentId = token.tournamentId; } return session; },
  },
});
