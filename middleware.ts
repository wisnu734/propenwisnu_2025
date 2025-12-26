import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
export function middleware(req: NextRequest) {
  const url = req.nextUrl.clone();
  if (url.pathname.startsWith("/admin")) {
    if (url.pathname === "/admin/login") return NextResponse.next();
    const admin = req.cookies.get("admin")?.value;
    if (admin !== "1") { url.pathname = "/admin/login"; return NextResponse.redirect(url); }
  }
  return NextResponse.next();
}
export const config = { matcher: ["/admin/:path*"] };
