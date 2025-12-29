import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";

export const dynamic = 'force-dynamic';

export async function GET() {
  const cookieStore = cookies();
  const userIdCookie = cookieStore.get("userId");

  if (!userIdCookie) {
    return NextResponse.json({ user: null });
  }

  const userId = parseInt(userIdCookie.value);

  const user = await prisma.user.findUnique({
    where: { id: userId }
  });

  if (!user) {
    return NextResponse.json({ user: null });
  }

  return NextResponse.json({
    user: {
      fullName: user.fullName,
      phone: user.phone,
      address: user.address,
    }
  });
}