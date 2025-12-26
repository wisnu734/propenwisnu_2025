import { prisma } from "@/lib/prisma";
export async function GET(){
  const tx = await prisma.materialTransaction.findMany({ include:{ material:true }, orderBy:{ createdAt:"desc" } });
  const rows:string[]=[]; rows.push(["createdAt","material","type","qty","unit","note"].join(","));
  for(const t of tx){
    rows.push([ t.createdAt.toISOString(), esc(t.material.name), t.type, String(t.qty), t.material.unit, esc(t.note) ].join(","));
  }
  return new Response(rows.join("\n"),{ headers:{ "Content-Type":"text/csv; charset=utf-8", "Content-Disposition": "attachment; filename=materials.csv" } });
}
function esc(s:string){ if(!s) return ""; const n=/[",\n]/.test(s); return n?`"${s.replaceAll('"','""')}"`:s; }
