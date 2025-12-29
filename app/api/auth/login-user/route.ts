import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST(req: Request) {
  const { username, password } = await req.json();
  const user = await prisma.user.findUnique({ where: { username } });

  if (!user || user.password !== password) {
    return NextResponse.json({ error: "Invalid" }, { status: 401 });
  }

  // Set cookie
  const res = NextResponse.json({ ok: true, role: user.role });
  res.cookies.set("user_session", user.username, { httpOnly: true, maxAge: 86400 * 7, path: "/" });
  
  return res;
}