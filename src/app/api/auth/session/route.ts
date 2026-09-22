import { NextResponse } from "next/server";

import {
  ACCOUNT_SESSION_COOKIE,
  accountSessionCookieOptions,
  createAccountSession,
} from "@/infrastructure/http/account-session";
import { createSupabaseServerClient } from "@/infrastructure/supabase/server-client";

export const runtime = "nodejs";

export async function POST(request: Request) {
  let accessToken: unknown;
  try {
    ({ accessToken } = (await request.json()) as { accessToken?: unknown });
  } catch {
    return NextResponse.json({ error: "invalid_request" }, { status: 400 });
  }
  if (typeof accessToken !== "string" || accessToken.length === 0 || accessToken.length > 8192) {
    return NextResponse.json({ error: "invalid_request" }, { status: 400 });
  }

  try {
    const client = createSupabaseServerClient();
    const { data, error } = await client.auth.getUser(accessToken);
    if (error || !data.user?.email_confirmed_at) {
      return NextResponse.json({ error: "verification_required" }, { status: 401 });
    }
    const { error: profileError } = await client.from("profiles").upsert(
      {
        user_id: data.user.id,
        locale: "vi",
        timezone: "Asia/Ho_Chi_Minh",
      },
      { onConflict: "user_id", ignoreDuplicates: true },
    );
    if (profileError) throw profileError;

    const response = NextResponse.json({ status: "signed_in" });
    response.cookies.set(
      ACCOUNT_SESSION_COOKIE,
      createAccountSession(accessToken),
      accountSessionCookieOptions,
    );
    return response;
  } catch {
    return NextResponse.json({ error: "sign_in_unavailable" }, { status: 503 });
  }
}

export async function DELETE() {
  const response = NextResponse.json({ status: "signed_out" });
  response.cookies.set(ACCOUNT_SESSION_COOKIE, "", { ...accountSessionCookieOptions, maxAge: 0 });
  return response;
}
