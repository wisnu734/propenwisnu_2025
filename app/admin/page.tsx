import { prisma } from "@/lib/prisma";
import { money } from "@/lib/utils";
export default async function Dash(){
  const orders = await prisma.order.findMany({ include:{items:true}, orderBy:{createdAt:"desc"}, take:5 });
  const today = new Date(); const start = new Date(today.getFullYear(),today.getMonth(),today.getDate());
  const end = new Date(today.getFullYear(),today.getMonth(),today.getDate()+1);
  const todays = await prisma.order.findMany({ where:{ delivery:{ gte:start, lt:end } }, include:{items:true} });
  const omzet = todays.reduce((s,o)=> s + o.items.reduce((z,i)=> z+i.price*i.qty,0), 0);
  return <div className="space-y-6">
    <div className="grid sm:grid-cols-3 gap-3">
      <div className="card p-4"><div className="text-sm text-white/70">Order Hari Ini</div><div className="text-2xl font-bold">{todays.length}</div></div>
      <div className="card p-4"><div className="text-sm text-white/70">Estimasi Omzet</div><div className="text-2xl font-bold">{money(omzet)}</div></div>
      <div className="card p-4"><div className="text-sm text-white/70">Terbaru</div><div className="text-2xl font-bold">{orders.length}</div></div>
    </div>
    <div className="card p-4">
      <h3 className="font-semibold mb-2">Pesanan Terbaru</h3>
      <table className="table"><thead><tr><th>No</th><th>Tgl Kirim</th><th>Total</th></tr></thead>
      <tbody>{orders.map(o=>{
        const total = o.items.reduce((s,i)=>s+i.price*i.qty,0);
        return <tr key={o.id} className="border-t border-white/5"><td className="font-mono">{o.orderNo}</td><td>{new Date(o.delivery).toLocaleDateString("id-ID")}</td><td>{money(total)}</td></tr>
      })}</tbody></table>
    </div>
  </div>;
}
