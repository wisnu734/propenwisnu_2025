import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { username, password } = await req.json();
  const user = await prisma.user.findUnique({ where: { username } });

  if (!user || user.password !== password) {
    return NextResponse.json({ error: "Invalid" }, { status: 401 });
  }

  const res = NextResponse.json({ ok: true, role: user.role });
  
  res.cookies.set("userId", user.id.toString(), { 
    httpOnly: true, 
    maxAge: 86400 * 7, 
    path: "/" 
  });
  // ------------------------
  
  return res;
}