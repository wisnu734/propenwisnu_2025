import { prisma } from "@/lib/prisma";
import { money, STAT } from "@/lib/utils";

async function setStatus(id:number, status:string){
  "use server";
  await prisma.order.update({ where:{id}, data:{ status } });
  await prisma.orderEvent.create({ data:{ orderId:id, status, note:"" } });

  if(status==="IN_PRODUCTION"){
    const full = await prisma.order.findUnique({ where:{id}, include:{ items:{ include:{ product:true } } } });
    if(full){
      for(const it of full.items){
        const rec = await prisma.recipe.findMany({ where:{ productId: it.productId } });
        for(const r of rec){
          await prisma.materialTransaction.create({ data:{
            materialId: r.materialId, type:"OUT", qty: r.qtyPerUnit * it.qty, note: `WO ${full.orderNo} - ${it.product.name} x ${it.qty}`
          }});
        }
      }
    }
  }
}

export default async function Orders(){
  const rows = await prisma.order.findMany({ include:{ customer:true, items:{ include:{ product:true } } }, orderBy:{ createdAt:"desc" } });
  return <div className="card p-4">
    <h2 className="text-xl font-semibold mb-4">Semua Pesanan</h2>
    <table className="table"><thead><tr><th>No</th><th>Pelanggan</th><th>Tgl Kirim</th><th>Item</th><th>Total</th><th>Status</th><th>Aksi</th></tr></thead>
    <tbody>{rows.map(o=>{
      const total=o.items.reduce((s,i)=>s+i.qty*i.price,0);
      return <tr key={o.id} className="border-t border-white/5 align-top">
        <td className="font-mono">{o.orderNo}</td>
        <td>{o.customer.name}</td>
        <td>{new Date(o.delivery).toLocaleDateString("id-ID")}</td>
        <td className="text-sm"><ul className="ml-4 list-disc">{o.items.map(it=><li key={it.id}>{it.product.name} x {it.qty} ({money(it.price)})</li>)}</ul></td>
        <td>{money(total)}</td>
        <td>{o.status}</td>
        <td>
          <form action={async (fd)=>{ "use server"; await setStatus(o.id, String(fd.get("status"))); }}>
            <select name="status" defaultValue={o.status} className="select mb-2">{STAT.map(s=><option key={s} value={s}>{s}</option>)}</select>
            <button className="btn w-full">Update</button>
          </form>
        </td>
      </tr>
    })}</tbody></table>
  </div>;
}
