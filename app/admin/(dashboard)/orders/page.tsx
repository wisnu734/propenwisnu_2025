import { prisma } from "@/lib/prisma";
import { money, STAT } from "@/lib/utils";

// Server Action untuk update status (masih diperlukan admin)
async function setStatus(id: number, status: string) {
  "use server";
  await prisma.order.update({ where: { id }, data: { status } });
  await prisma.orderEvent.create({ data: { orderId: id, status, note: "Updated by Admin" } });
  
  // Logic potong stok otomatis jika status IN_PRODUCTION
  if (status === "IN_PRODUCTION") {
    const full = await prisma.order.findUnique({
      where: { id },
      include: { items: { include: { product: true } } }
    });
    if (full) {
      for (const it of full.items) {
        const rec = await prisma.recipe.findMany({ where: { productId: it.productId } });
        for (const r of rec) {
          await prisma.materialTransaction.create({
            data: {
              materialId: r.materialId,
              type: "OUT",
              qty: r.qtyPerUnit * it.qty,
              note: `WO ${full.orderNo}`
            }
          });
        }
      }
    }
  }
}

// Halaman ADMIN (Hanya Tabel View)
export default async function AdminOrdersPage({ searchParams }: { searchParams: any }) {
  const query = searchParams?.q || "";
  const statusFilter = searchParams?.status || "";
  
  const rows = await prisma.order.findMany({
    where: {
      AND: [
        statusFilter ? { status: statusFilter } : {},
        { OR: [{ orderNo: { contains: query } }, { customer: { name: { contains: query } } }] }
      ]
    },
    include: { customer: true, items: { include: { product: true } } },
    orderBy: { createdAt: "desc" }
  });

  return (
    <div className="space-y-4">
      {/* 1. Header & Filter */}
      <div className="card p-4 flex flex-col md:flex-row gap-4 justify-between items-center">
        <h1 className="text-2xl font-bold">Daftar Pesanan Masuk</h1>
        
        {/* Form Filter Sederhana */}
        <form className="flex gap-2">
          <input name="q" className="input py-1 px-3 text-sm w-40" placeholder="Cari..." defaultValue={query} />
          <select name="status" className="select py-1 px-3 text-sm" defaultValue={statusFilter}>
            <option value="">Semua Status</option>
            {STAT.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
          <button className="btn py-1 px-4 text-sm">Filter</button>
        </form>
      </div>

      {/* 2. Tabel Data (View Only) */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="table w-full text-left">
            <thead className="bg-white/5 text-white/70 uppercase text-xs">
              <tr>
                <th className="p-4">Order No</th>
                <th className="p-4">Pelanggan</th>
                <th className="p-4">Tanggal Kirim</th>
                <th className="p-4">Item</th>
                <th className="p-4">Total</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-sm">
              {rows.map(o => (
                <tr key={o.id} className="hover:bg-white/5 transition">
                  <td className="p-4 font-mono">{o.orderNo}</td>
                  <td className="p-4">
                    <div className="font-bold">{o.customer.name}</div>
                    <div className="text-xs text-white/50">{o.customer.phone}</div>
                    <div className="text-xs text-white/40 mt-1 truncate max-w-[150px]">{o.customer.address}</div>
                  </td>
                  <td className="p-4">{new Date(o.delivery).toLocaleDateString("id-ID")}</td>
                  <td className="p-4">
                    <ul className="list-disc pl-4 text-xs text-white/80">
                      {o.items.map(i => (
                        <li key={i.id}>{i.product.name} x{i.qty}</li>
                      ))}
                    </ul>
                  </td>
                  <td className="p-4 font-bold text-blue-300">
                    {money(o.items.reduce((a,b)=>a+b.qty*b.price,0))}
                  </td>
                  <td className="p-4">
                    <span className="px-2 py-1 rounded bg-white/10 text-xs border border-white/10">
                      {o.status}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <form action={async (fd) => { "use server"; await setStatus(o.id, String(fd.get("s"))); }} className="inline-flex gap-2">
                       <select name="s" defaultValue={o.status} className="select py-1 px-2 text-xs w-24">
                          {STAT.map(s => <option key={s} value={s}>{s}</option>)}
                       </select>
                       <button className="btn py-1 px-3 text-xs bg-white/10 hover:bg-white/20">OK</button>
                    </form>
                  </td>
                </tr>
              ))}
              {rows.length === 0 && (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-white/30 italic">Belum ada pesanan.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}