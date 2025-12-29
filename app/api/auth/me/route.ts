import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";

// Paksa agar tidak di-cache (Selalu cek real-time)
export const dynamic = 'force-dynamic';

export async function GET() {
  const cookieStore = cookies();
  const userIdCookie = cookieStore.get("userId");

  console.log("🔍 API ME: Menerima Cookie:", userIdCookie?.value);

  if (!userIdCookie) {
    console.log("❌ API ME: Cookie userId tidak ditemukan di browser");
    return NextResponse.json({ user: null });
  }

  const userId = parseInt(userIdCookie.value);

  const user = await prisma.user.findUnique({ // Sesuaikan model: user/customer
    where: { id: userId }
  });

  if (!user) {
    console.log("❌ API ME: User ID ada di cookie, tapi tidak ada di DB");
    return NextResponse.json({ user: null });
  }

  console.log("✅ API ME: User Ditemukan:", user.name);

  return NextResponse.json({
    user: {
      name: user.name,
      phone: user.phone,
      address: user.address,
    }
  });
}