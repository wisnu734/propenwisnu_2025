import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    // Ambil data lengkap dari form
    const { username, password, fullName, phone, address } = body;

    if (!username || !password || !fullName || !phone || !address) {
      return NextResponse.json({ error: "Semua data wajib diisi!" }, { status: 400 });
    }

    const existing = await prisma.user.findUnique({ where: { username: String(username) } });
    if (existing) {
      return NextResponse.json({ error: "Username sudah dipakai." }, { status: 400 });
    }

    // Simpan data lengkap ke database
    await prisma.user.create({
      data: {
        username,
        password,
        fullName, // Simpan Nama
        phone,    // Simpan HP
        address,  // Simpan Alamat
        role: "USER"
      }
    });

    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ error: "Gagal mendaftar." }, { status: 500 });
  }
}