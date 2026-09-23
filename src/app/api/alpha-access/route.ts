import { timingSafeEqual } from "node:crypto";
import { NextResponse } from "next/server";
import {
  ALPHA_COOKIE,
  alphaCookieOptions,
  createAlphaSession,
} from "@/infrastructure/http/alpha-access";

export const runtime = "nodejs";
const attempts = new Map<string, { count: number; resetAt: number }>();

export async function POST(request: Request) {
  const secret = process.env.ATLAS_ALPHA_ACCESS_SECRET;
  if (!secret) return NextResponse.json({ error: "unavailable" }, { status: 503 });
  const key = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  const entry = attempts.get(key);
  const now = Date.now();
  if (entry && entry.resetAt > now && entry.count >= 5)
    return NextResponse.json(
      { error: "retry_later" },
      { status: 429, headers: { "Retry-After": "600" } },
    );
  let candidate: unknown;
  try {
    ({ secret: candidate } = await request.json());
  } catch {
    return NextResponse.json({ error: "invalid" }, { status: 400 });
  }
  const actual = typeof candidate === "string" ? Buffer.from(candidate) : Buffer.alloc(0);
  const expected = Buffer.from(secret);
  if (actual.length !== expected.length || !timingSafeEqual(actual, expected)) {
    attempts.set(key, {
      count: entry && entry.resetAt > now ? entry.count + 1 : 1,
      resetAt: now + 600000,
    });
    return NextResponse.json({ error: "invalid" }, { status: 401 });
  }
  attempts.delete(key);
  const response = NextResponse.json({ status: "granted" });
  response.cookies.set(ALPHA_COOKIE, createAlphaSession(), alphaCookieOptions);
  return response;
}
