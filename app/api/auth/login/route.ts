import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const { username, password } = await req.json();

    // --- OPSI 1: LOGIN PAKAI PASSWORD .ENV (SUPER ADMIN) ---
    // Ambil password dari .env (default "admin" kalau tidak ada)
    const envPassword = process.env.ADMIN_PASSWORD || "admin";
    
    // Jika password cocok dengan .env, langsung anggap SUKSES
    if (password === envPassword) {
      const response = NextResponse.json({ ok: true, user: { username: "Super Admin", role: "ADMIN" } });
      
      // Set Cookie Admin
      response.cookies.set("admin", "true", {
        httpOnly: true,
        path: "/",
        secure: false, // False di localhost
        sameSite: "lax",
        maxAge: 60 * 60 * 24, // 1 Hari
      });

      console.log("✅ Login Berhasil via .ENV");
      return response;
    }

    // --- OPSI 2: LOGIN PAKAI DATABASE (KODE LAMA KAMU) ---
    // Jika password .env salah, baru kita cari di database
    const user = await prisma.user.findUnique({
      where: { username: username }
    });

    // Cek User Database
    if (user && user.password === password) {
      // (Opsional: Cek apakah role-nya STAFF/ADMIN)
      // if (user.role !== "STAFF") return NextResponse.json({ error: "Akses ditolak" }, { status: 403 });

      const response = NextResponse.json({ ok: true, user });

      // Set Cookie Admin (Sama seperti di atas)
      response.cookies.set("admin", "true", {
        httpOnly: true,
        path: "/",
        secure: false,
        sameSite: "lax",
        maxAge: 60 * 60 * 24,
      });

      console.log("✅ Login Berhasil via Database:", user.username);
      return response;
    }

    // --- JIKA GAGAL KEDUANYA ---
    return NextResponse.json({ error: "Username atau Password salah" }, { status: 401 });

  } catch (error) {
    console.error("Login Error:", error);
    return NextResponse.json({ error: "Server Error" }, { status: 500 });
  }
}