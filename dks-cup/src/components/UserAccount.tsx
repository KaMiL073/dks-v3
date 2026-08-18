import { randomUUID } from "node:crypto";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { auth, signOut } from "@/auth";
import { pool } from "@/lib/db";
import { UserAccountModal } from "@/components/UserAccountModal";

async function updateAvatar(formData: FormData) {
  "use server";
  const session = await auth();
  if (!session?.user?.id) return;
  const file = formData.get("avatar");
  if (!(file instanceof File) || !file.size || file.size > 3_000_000) return;
  const extensions: Record<string,string> = { "image/jpeg":"jpg", "image/png":"png", "image/webp":"webp" };
  const extension = extensions[file.type];
  if (!extension) return;
  const directory = path.join(process.cwd(), "public", "uploads", "users");
  await mkdir(directory, { recursive: true });
  const filename = `${randomUUID()}.${extension}`;
  await writeFile(path.join(directory, filename), Buffer.from(await file.arrayBuffer()));
  await pool.query(`ALTER TABLE users ADD COLUMN IF NOT EXISTS avatar_url text`);
  await pool.query(`UPDATE users SET avatar_url=$1 WHERE id=$2`, [`/uploads/users/${filename}`, session.user.id]);
}

async function updateUsername(formData: FormData) {
  "use server";
  const session = await auth();
  if (!session?.user?.id) return;
  const username = String(formData.get("username") ?? "").trim();
  if (!username || username.length > 100) return;
  await pool.query(`UPDATE users SET username=$1 WHERE id=$2 AND NOT EXISTS (SELECT 1 FROM users WHERE username=$1 AND id<>$2)`, [username, session.user.id]);
}

async function updatePassword(formData: FormData) {
  "use server";
  const session = await auth();
  if (!session?.user?.id) return;
  const currentPassword = String(formData.get("currentPassword") ?? "");
  const newPassword = String(formData.get("newPassword") ?? "");
  const repeatPassword = String(formData.get("repeatPassword") ?? "");
  if (!currentPassword || newPassword.length < 4 || newPassword.length > 200 || newPassword !== repeatPassword) return;
  await pool.query(`UPDATE users SET password_hash=crypt($1,gen_salt('bf')) WHERE id=$2 AND password_hash=crypt($3,password_hash)`, [newPassword, session.user.id, currentPassword]);
}

export async function UserAccount({ icon }: { icon?: string }) {
  const session = await auth();
  if (!session?.user) return null;
  await pool.query(`ALTER TABLE users ADD COLUMN IF NOT EXISTS avatar_url text`);
  const result = await pool.query<{avatar_url:string|null;username:string}>(`SELECT avatar_url,username FROM users WHERE id=$1`, [session.user.id]);
  const avatarUrl = result.rows[0]?.avatar_url ? `/dks-cup${result.rows[0].avatar_url}` : null;
  return <UserAccountModal name={result.rows[0]?.username ?? session.user.name} role={session.user.role} icon={icon} avatarUrl={avatarUrl} avatarAction={updateAvatar} nameAction={updateUsername} passwordAction={updatePassword} logoutAction={async()=>{"use server";await signOut({redirectTo:"/dks-cup/"});}}/>;
}
