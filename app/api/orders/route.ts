import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers"; // Tambahkan ini untuk cek login

export async function POST(req: Request) {
  try {
    const body = await req.json();
    console.log("📦 Data Order Masuk:", body);

    const { name, phone, address, deliveryDate, items, notes } = body;

    // 1. VALIDASI DATA
    if (!name || !phone || !address || !deliveryDate || !items || items.length === 0) {
      return NextResponse.json({ error: "Data pesanan tidak lengkap" }, { status: 400 });
    }

    // 2. CEK APAKAH USER LOGIN (Ambil dari Cookie yang sudah kita perbaiki tadi)
    const cookieStore = cookies();
    const userIdCookie = cookieStore.get("userId");
    const userId = userIdCookie ? parseInt(userIdCookie.value) : null;

    // 3. BUAT NOMOR ORDER UNIK
    const orderNo = `ORD-${Date.now().toString().slice(-6)}`;

    // 4. SIMPAN KE DATABASE (Perhatikan perubahannya!)
    const newOrder = await prisma.order.create({
      data: {
        orderNo: orderNo,
        delivery: new Date(deliveryDate),
        notes: notes || "",
        status: "PENDING",

        // --- PERBAIKAN DISINI ---
        // Jangan taruh name/phone/address langsung di Order.
        // Tapi masukkan ke dalam relasi 'customer'.
        customer: {
          create: {
            name: name,
            phone: phone,
            address: address,
            // Jika user login, sambungkan Customer ini ke User ID-nya
            // Supaya nanti muncul di History Pesanan
            userId: userId 
          }
        },

        // Simpan Item Belanja
        items: {
          create: items.map((item: any) => ({
            productId: Number(item.productId),
            qty: Number(item.qty),
            price: Number(item.price) // Ambil harga saat transaksi terjadi
          }))
        }
      }
    });

    console.log("✅ Order Berhasil Disimpan:", newOrder.orderNo);
    return NextResponse.json({ ok: true, orderNo: newOrder.orderNo });

  } catch (error: any) {
    console.error("🔥 ERROR PRISMA:", error);
    return NextResponse.json(
      { error: "Gagal: " + error.message }, 
      { status: 500 }
    );
  }
}