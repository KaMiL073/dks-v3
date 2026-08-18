import { NextResponse } from "next/server";
import { getTournamentState } from "@/lib/db";
import { demoTournament } from "@/lib/demo-data";

export const dynamic = "force-dynamic";
export async function GET() {
  try { return NextResponse.json(await getTournamentState(), { headers: { "Cache-Control": "no-store" } }); }
  catch { return NextResponse.json(demoTournament, { headers: { "Cache-Control": "no-store" } }); }
}
