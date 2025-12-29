import { prisma } from "@/lib/prisma";
import { money } from "@/lib/utils";

// PENTING: Pakai ini biar data selalu update saat halaman dibuka
export const dynamic = 'force-dynamic';

export default async function AdminDashboard() {
  // 1. Ambil Data (Dengan Safety Check)
  let orders: any[] = [];
  let todaysOrders: any[] = [];
  let omzet = 0;

  try {
    // Ambil 5 pesanan terbaru
    orders = await prisma.order.findMany({
      include: { items: true },
      orderBy: { createdAt: "desc" },
      take: 5,
    });

    // Hitung tanggal hari ini
    const today = new Date();
    const start = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const end = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);

    // Ambil pesanan hari ini (pakai 'delivery')
    todaysOrders = await prisma.order.findMany({
      where: {
        delivery: { gte: start, lt: end }
      },
      include: { items: true },
    });

    // Hitung Omzet
    omzet = todaysOrders.reduce((total, order) => {
      const sub = order.items.reduce((s: number, i: any) => s + (i.price * i.qty), 0);
      return total + sub;
    }, 0);

  } catch (error) {
    console.error("Database Error (Abaikan jika baru init):", error);
  }

  return (
    <div className="p-8 space-y-8 bg-gray-950 min-h-screen text-gray-100">
      
      {/* HEADER DASHBOARD */}
      <div className="flex flex-col md:flex-row justify-between items-center border-b border-white/10 pb-6">
        <div>
          <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500">
            Dashboard Admin
          </h1>
          <p className="text-white/50 mt-1">Selamat datang kembali, Staff!</p>
        </div>
        <div className="px-4 py-2 bg-white/5 rounded-full text-xs font-mono text-white/50 border border-white/10">
          Status: Online 🟢
        </div>
      </div>

      {/* KARTU STATISTIK */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Card 1 */}
        <div className="p-6 rounded-2xl bg-gray-900 border border-white/10 shadow-xl hover:border-yellow-500/30 transition">
          <p className="text-sm text-white/60 mb-2">📦 Order Hari Ini</p>
          <p className="text-4xl font-bold text-white">{todaysOrders.length}</p>
        </div>
        
        {/* Card 2 */}
        <div className="p-6 rounded-2xl bg-gray-900 border border-white/10 shadow-xl hover:border-green-500/30 transition">
          <p className="text-sm text-white/60 mb-2">💰 Omzet Hari Ini</p>
          <p className="text-4xl font-bold text-green-400">{money(omzet)}</p>
        </div>

        {/* Card 3 */}
        <div className="p-6 rounded-2xl bg-gray-900 border border-white/10 shadow-xl hover:border-blue-500/30 transition">
          <p className="text-sm text-white/60 mb-2">📝 Total Data Masuk</p>
          <p className="text-4xl font-bold text-blue-400">{orders.length}</p>
        </div>
      </div>

      {/* TABEL DATA */}
      <div className="bg-gray-900 border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
        <div className="p-6 bg-white/5 border-b border-white/10">
          <h3 className="font-bold text-lg text-white">Pesanan Terbaru</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-black/20 text-white/50 uppercase text-xs">
              <tr>
                <th className="px-6 py-4">No. Order</th>
                <th className="px-6 py-4">Nama Pelanggan</th>
                <th className="px-6 py-4">Tanggal Kirim</th>
                <th className="px-6 py-4 text-right">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {orders.map((o: any) => {
                // Hitung total per baris
                const total = o.items ? o.items.reduce((acc: number, item: any) => acc + (item.price * item.qty), 0) : 0;
                
                // Format Tanggal Aman
                let tgl = "-";
                try { tgl = new Date(o.delivery).toLocaleDateString("id-ID"); } catch(e){}

                return (
                  <tr key={o.id} className="hover:bg-white/5 transition">
                    <td className="px-6 py-4 font-mono text-yellow-500">#{o.orderNo}</td>
                    <td className="px-6 py-4 font-medium text-white/90">{o.name}</td>
                    <td className="px-6 py-4 text-white/60">{tgl}</td>
                    <td className="px-6 py-4 text-right font-bold text-green-400">{money(total)}</td>
                  </tr>
                );
              })}
              {orders.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-6 py-10 text-center text-white/30 italic">
                    Belum ada pesanan masuk hari ini.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}