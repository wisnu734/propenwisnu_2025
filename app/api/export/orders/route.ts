import { prisma } from "@/lib/prisma";
export async function GET(){
  const orders = await prisma.order.findMany({ include:{ customer:true, items:{ include:{ product:true } } }, orderBy:{ createdAt:"desc" } });
  const rows:string[]=[]; rows.push(["orderNo","createdAt","delivery","status","customer","phone","address","item","qty","price","totalLine"].join(","));
  for(const o of orders){
    for(const it of o.items){
      rows.push([
        o.orderNo, o.createdAt.toISOString(), o.delivery.toISOString(), o.status,
        esc(o.customer.name), esc(o.customer.phone), esc(o.customer.address),
        esc(it.product.name), String(it.qty), String(it.price), String(it.qty*it.price)
      ].join(","));
    }
  }
  return new Response(rows.join("\n"),{ headers:{ "Content-Type":"text/csv; charset=utf-8", "Content-Disposition": "attachment; filename=orders.csv" } });
}
function esc(s:string){ if(!s) return ""; const n=/[",\n]/.test(s); return n?`"${s.replaceAll('"','""')}"`:s; }
