import { NextResponse } from "next/server";
import { pool } from "@/lib/db";
export const dynamic="force-dynamic";
export async function GET(){try{const result=await pool.query<{version:string}>(`SELECT COALESCE(MAX(updated_at)::text,'0') version FROM matches`);return NextResponse.json({version:result.rows[0]?.version??"0"},{headers:{"Cache-Control":"no-store"}});}catch{return NextResponse.json({version:"0"},{headers:{"Cache-Control":"no-store"}});}}
