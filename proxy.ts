import { NextRequest, NextResponse } from "next/server";

const COOKIE = "atlas_alpha_access";
async function valid(value: string | undefined): Promise<boolean> {
  const secret = process.env.ATLAS_ALPHA_ACCESS_SECRET;
  if (!secret || !value) return false;
  const [expiryText, received, extra] = value.split("."); if (!expiryText || !received || extra || Number(expiryText) <= Date.now()) return false;
  const key = await crypto.subtle.importKey("raw", new TextEncoder().encode(secret), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  const signed = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(`alpha:${expiryText}`));
  const expected = btoa(String.fromCharCode(...new Uint8Array(signed))).replaceAll("+", "-").replaceAll("/", "_").replace(/=+$/, "");
  return expected === received;
}
export async function proxy(request: NextRequest) {
  if (process.env.ATLAS_ALPHA_MODE !== "true") return NextResponse.next();
  if (request.nextUrl.pathname.startsWith("/alpha-access") || request.nextUrl.pathname.startsWith("/api/alpha-access")) return NextResponse.next();
  if (!process.env.ATLAS_ALPHA_ACCESS_SECRET) return new NextResponse("Owner Alpha is not configured.", { status: 503 });
  if (await valid(request.cookies.get(COOKIE)?.value)) return NextResponse.next();
  return NextResponse.redirect(new URL("/alpha-access", request.url));
}
export const config = { matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"] };
