import { readAccountSession } from "@/infrastructure/http/account-session";
import { createSupabaseServerClient } from "@/infrastructure/supabase/server-client";

export type CurrentAccount = Readonly<{ kind: "account"; id: string }>;

/**
 * A signed session alone is insufficient: Supabase verifies token expiry/revocation
 * before an account can act as the ledger actor.
 */
export async function getCurrentAccount(
  cookieValue: string | undefined,
): Promise<CurrentAccount | undefined> {
  const session = readAccountSession(cookieValue);
  if (!session) return undefined;
  const { data, error } = await createSupabaseServerClient().auth.getUser(session.accessToken);
  if (error || !data.user?.email_confirmed_at) return undefined;
  return { kind: "account", id: data.user.id };
}
