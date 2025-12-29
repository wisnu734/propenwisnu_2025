import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { money } from "@/lib/utils";

// Paksa render ulang tiap dibuka biar datanya fresh
export const dynamic = 'force-dynamic';

export default async function MemberDashboard() {
  const cookieStore = cookies();
  const userIdCookie = cookieStore.get("userId");

  // Kalau tidak ada cookie, tendang ke login
  if (!userIdCookie) {
    return (
      <div className="text-center py-20">
        <h1 className="text-xl">Akses Ditolak</h1>
        <Link href="/login" className="text-blue-400">Silakan Login</Link>
      </div>
    );
  }

  const userId = parseInt(userIdCookie.value);

  // 1. Ambil Data User
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      // 2. Ambil History Pesanan via relasi Customer
      customers: {
        include: {
          orders: {
            include: { items: { include: { product: true } } },
            orderBy: { createdAt: 'desc' }
          }
        }
      }
    }
  });

  if (!user) return <div>User tidak ditemukan</div>;

  // Flatten orders (karena struktur: User -> Customer -> Order)
  const allOrders = user.customers.flatMap(c => c.orders);

  return (
    <div className="space-y-8">
      {/* Header Profil */}
      <div className="flex flex-col md:flex-row justify-between items-end border-b border-white/10 pb-6 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">Halo, {user.fullName} 👋</h1>
          <p className="text-white/50">Member sejak {new Date(user.createdAt).getFullYear()}</p>
        </div>
        <Link href="/order" className="btn bg-yellow-500 text-black font-bold hover:bg-yellow-400">
          Buat Pesanan Baru
        </Link>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        
        {/* KOLOM KIRI: DATA DIRI */}
        <div className="md:col-span-1 space-y-6">
          <div className="card p-6 h-fit">
            <h3 className="text-lg font-bold mb-4 border-b border-white/10 pb-2">Profil Saya</h3>
            
            <div className="space-y-4 text-sm">
              <div>
                <label className="block text-white/40 text-xs">Nama Lengkap</label>
                <div className="font-medium">{user.fullName}</div>
              </div>
              <div>
                <label className="block text-white/40 text-xs">Nomor HP/WA</label>
                <div className="font-medium">{user.phone}</div>
              </div>
              <div>
                <label className="block text-white/40 text-xs">Alamat Utama</label>
                <div className="font-medium text-white/80">{user.address}</div>
              </div>
              
              {/* Tombol Edit (Bisa dibuat form terpisah nanti) */}
              <button className="w-full py-2 mt-4 text-xs border border-white/20 rounded hover:bg-white/5 disabled:opacity-50" disabled>
                Edit Profil (Coming Soon)
              </button>
            </div>
          </div>
        </div>

        {/* KOLOM KANAN: RIWAYAT PESANAN */}
        <div className="md:col-span-2">
          <h3 className="text-xl font-bold mb-4">Riwayat Pesanan</h3>
          
          <div className="space-y-4">
            {allOrders.length === 0 ? (
              <div className="text-center py-10 card bg-white/5">Belum ada pesanan.</div>
            ) : (
              allOrders.map((order) => {
                const total = order.items.reduce((acc, item) => acc + (item.price * item.qty), 0);
                
                return (
                  <div key={order.id} className="card p-5 hover:border-white/30 transition">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <div className="font-mono text-yellow-500 text-sm">#{order.orderNo}</div>
                        <div className="text-xs text-white/50">
                          Order: {new Date(order.createdAt).toLocaleDateString("id-ID")} • 
                          Kirim: {new Date(order.delivery).toLocaleDateString("id-ID")}
                        </div>
                      </div>
                      <span className={`px-3 py-1 rounded text-xs font-bold border ${
                        order.status === 'NEW' ? 'border-blue-500 text-blue-400' :
                        order.status === 'COMPLETED' ? 'border-green-500 text-green-400' :
                        'border-white/20 text-white/50'
                      }`}>
                        {order.status}
                      </span>
                    </div>

                    {/* List Item Singkat */}
                    <ul className="text-sm text-white/80 space-y-1 bg-black/20 p-3 rounded mb-3">
                      {order.items.map(item => (
                        <li key={item.id} className="flex justify-between">
                          <span>{item.qty}x {item.product.name}</span>
                          <span className="text-white/40">{money(item.price * item.qty)}</span>
                        </li>
                      ))}
                    </ul>

                    <div className="flex justify-between items-center border-t border-white/10 pt-3">
                      <div className="text-xs text-white/50">Total Belanja</div>
                      <div className="text-lg font-bold text-white">{money(total)}</div>
                    </div>
                  </div>
                )
              })
            )}
          </div>
        </div>

      </div>
    </div>
  );
}