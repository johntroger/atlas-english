import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import { ACCOUNT_SESSION_COOKIE } from "@/infrastructure/http/account-session";
import { getCurrentAccount } from "@/infrastructure/http/current-account";
import { createSupabaseServerClient } from "@/infrastructure/supabase/server-client";

export const runtime = "nodejs";

type HistoryRow = Readonly<{
  id: string;
  item_id: string;
  submitted_at: string;
  server_outcome: Readonly<{ isCorrect?: boolean; practiceOnly?: boolean }>;
  hint_count: number;
}>;

export async function GET() {
  const cookieStore = await cookies();
  const account = await getCurrentAccount(cookieStore.get(ACCOUNT_SESSION_COOKIE)?.value);
  if (!account) return NextResponse.json({ error: "authentication_required" }, { status: 401 });

  try {
    const { data, error } = await createSupabaseServerClient()
      .from("attempts")
      .select("id, item_id, submitted_at, server_outcome, hint_count")
      .eq("actor_user_id", account.id)
      .order("submitted_at", { ascending: false })
      .limit(50)
      .returns<HistoryRow[]>();
    if (error) throw error;
    return NextResponse.json({ attempts: data ?? [] });
  } catch {
    return NextResponse.json({ error: "history_unavailable" }, { status: 503 });
  }
}
