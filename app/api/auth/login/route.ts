import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const { phone, password } = await req.json();

    // 1. Cari User
    const user = await prisma.user.findFirst({ // Atau prisma.customer (sesuaikan)
      where: { phone: phone }
    });

    // 2. Cek Password
    if (!user || user.password !== password) {
      return NextResponse.json({ error: "No HP atau Password salah" }, { status: 401 });
    }

    const response = NextResponse.json({ ok: true, user });

    // 3. SET COOKIE (INI YANG PENTING)
    // secure: false -> AGAR BISA DISIMPAN DI LOCALHOST
    response.cookies.set("userId", user.id.toString(), {
      httpOnly: true,
      path: "/",
      secure: false, // <--- WAJIB FALSE KALAU DI LOCALHOST
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 1 Minggu
    });

    console.log("✅ Login Berhasil, Cookie userId diset:", user.id);
    return response;

  } catch (error) {
    console.error("Login Error:", error);
    return NextResponse.json({ error: "Server Error" }, { status: 500 });
  }
}