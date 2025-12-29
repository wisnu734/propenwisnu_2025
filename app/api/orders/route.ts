import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    
    // 1. CEK DATA YANG MASUK (Lihat di Terminal VS Code)
    console.log("📦 Data Order Masuk:", body);

    const { name, phone, address, deliveryDate, items, notes } = body;

    // 2. VALIDASI DASAR
    if (!name || !phone || !address || !deliveryDate || !items || items.length === 0) {
      console.log("❌ Data tidak lengkap");
      return NextResponse.json({ error: "Data pesanan tidak lengkap" }, { status: 400 });
    }

    // 3. BUAT NOMOR ORDER
    const orderNo = `ORD-${Date.now().toString().slice(-6)}`;

    // 4. SIMPAN KE DATABASE
    // Kita gunakan Number() dan new Date() untuk memastikan tipe datanya benar
    const newOrder = await prisma.order.create({
      data: {
        orderNo: orderNo,
        name: name,
        phone: phone,
        address: address,
        notes: notes || "",
        status: "PENDING",
        
        // KONVERSI TANGGAL (PENTING!)
        delivery: new Date(deliveryDate), 

        // SIMPAN ITEM BELANJA
        items: {
          create: items.map((item: any) => ({
            // KONVERSI ANGKA (PENTING! Biar gak error String vs Int)
            productId: Number(item.productId), 
            name: item.name,
            price: Number(item.price),
            qty: Number(item.qty)
          }))
        }
      }
    });

    console.log("✅ Order Berhasil Disimpan:", newOrder.orderNo);
    return NextResponse.json({ ok: true, orderNo: newOrder.orderNo });

  } catch (error: any) {
    // 5. TANGKAP ERROR ASLINYA
    console.error("🔥 ERROR PRISMA:", error); // <-- Cek Terminal untuk lihat error ini!
    
    // Kirim pesan error asli ke frontend biar ketahuan salahnya apa
    return NextResponse.json(
      { error: "Gagal: " + error.message }, 
      { status: 500 }
    );
  }
}