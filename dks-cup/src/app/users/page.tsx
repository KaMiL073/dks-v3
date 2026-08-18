import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { pool } from "@/lib/db";
import { UserAccount } from "@/components/UserAccount";
import { UsersManager } from "@/components/UsersManager";

type UserRow={id:string;username:string;email:string;role:"PUBLIC"|"ORGANIZER"|"REFEREE";tournament_name:string|null};
async function organizer(){const session=await auth();if(!session?.user||session.user.role!=="ORGANIZER")redirect("/");return session;}
async function createUser(data:FormData){"use server";await organizer();const username=String(data.get("username")??"").trim();const email=String(data.get("email")??"").trim().toLowerCase();const role=String(data.get("role")??"");const password=String(data.get("password")??"");if(!username||!email||password.length<4||!['PUBLIC','REFEREE','ORGANIZER'].includes(role))return;await pool.query(`INSERT INTO users(username,email,password_hash,role) SELECT $1,$2,crypt($3,gen_salt('bf')),$4::user_role WHERE NOT EXISTS(SELECT 1 FROM users WHERE username=$1 OR email=$2)`,[username,email,password,role]);revalidatePath("/users");}
async function updateUser(data:FormData){"use server";await organizer();const id=String(data.get("userId")??"");const username=String(data.get("username")??"").trim();const email=String(data.get("email")??"").trim().toLowerCase();const role=String(data.get("role")??"");const password=String(data.get("password")??"");if(!id||!username||!email||!['PUBLIC','REFEREE','ORGANIZER'].includes(role))return;await pool.query(`UPDATE users SET username=$1,email=$2,role=$3::user_role,password_hash=CASE WHEN $4='' THEN password_hash ELSE crypt($4,gen_salt('bf')) END WHERE id=$5 AND NOT EXISTS(SELECT 1 FROM users u WHERE (u.username=$1 OR u.email=$2) AND u.id<>$5)`,[username,email,role,password,id]);revalidatePath("/users");}
async function deleteUser(data:FormData){"use server";const session=await organizer();const id=String(data.get("userId")??"");if(!id||id===session.user.id)return;await pool.query(`DELETE FROM users WHERE id=$1`,[id]);revalidatePath("/users");}

export default async function UsersPage(){const session=await organizer();const result=await pool.query<UserRow>(`SELECT u.id,u.username,u.email,u.role,t.name tournament_name FROM users u LEFT JOIN tournaments t ON t.id=u.tournament_id ORDER BY u.username`);return <main className="org-main users-page"><header className="org-detail-menu"><Link className="org-menu-icon" href="/admin" aria-label="Wróć"><Image src="/dks-cup/figma/org/back-detail.svg" alt="" width={48} height={48}/></Link><h1>Użytkownicy</h1><UserAccount/></header><UsersManager users={result.rows} currentUserId={session.user.id} createAction={createUser} updateAction={updateUser} deleteAction={deleteUser}/></main>}
