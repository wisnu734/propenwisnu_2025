import { prisma } from "@/lib/prisma";
export default async function Inv(){
  const mats = await prisma.material.findMany({ include:{ txs:true }, orderBy:{ name:"asc" } });
  const rows = mats.map(m=>({ ...m, stock: m.txs.reduce((s,t)=> s + (t.type==="IN"?t.qty:-t.qty), 0)}));
  const last = await prisma.materialTransaction.findMany({ include:{ material:true }, orderBy:{ createdAt:"desc" }, take:20 });
  return <div className="space-y-6">
    <div className="card p-4">
      <h2 className="text-xl font-semibold mb-3">Rekap Stok</h2>
      <table className="table"><thead><tr><th>Material</th><th>Stok</th><th>Sat</th></tr></thead>
      <tbody>{rows.map(r=><tr key={r.id} className="border-t border-white/5"><td>{r.name}</td><td>{r.stock.toLocaleString("id-ID")}</td><td>{r.unit}</td></tr>)}</tbody></table>
    </div>
    <div className="card p-4">
      <h3 className="font-semibold mb-2">Transaksi Terakhir</h3>
      <table className="table"><thead><tr><th>Waktu</th><th>Material</th><th>Jenis</th><th>Qty</th><th>Catatan</th></tr></thead>
      <tbody>{last.map(x=><tr key={x.id} className="border-t border-white/5"><td>{new Date(x.createdAt).toLocaleString("id-ID")}</td><td>{x.material.name}</td><td>{x.type}</td><td>{x.qty} {x.material.unit}</td><td>{x.note}</td></tr>)}</tbody></table>
    </div>
  </div>;
}
