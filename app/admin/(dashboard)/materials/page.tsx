import { prisma } from "@/lib/prisma";

async function addMat(fd:FormData){ "use server";
  const name=String(fd.get("name")||"").trim(); const unit=String(fd.get("unit")||"").trim();
  if(!name||!unit) return; await prisma.material.create({ data:{ name, unit } });
}
async function addTx(fd:FormData){ "use server";
  const materialId=Number(fd.get("materialId")); const type=String(fd.get("type")); const qty=Number(fd.get("qty")); const note=String(fd.get("note")||"");
  if(!materialId||!qty||!type) return; await prisma.materialTransaction.create({ data:{ materialId, type, qty, note } });
}

export default async function Mats(){
  const mats = await prisma.material.findMany({ orderBy:{ name:"asc" } });
  return <div className="grid md:grid-cols-2 gap-6">
    <div className="card p-4">
      <h2 className="text-xl font-semibold mb-4">Tambah Material</h2>
      <form action={addMat} className="grid gap-3">
        <input className="input" name="name" placeholder="Tepung" />
        <input className="input" name="unit" placeholder="kg / L / pcs" />
        <button className="btn">Simpan</button>
      </form>
    </div>
    <div className="card p-4">
      <h2 className="text-xl font-semibold mb-4">Transaksi IN/OUT</h2>
      <form action={addTx} className="grid gap-3">
        <select className="select" name="materialId">{mats.map(m=><option key={m.id} value={m.id}>{m.name} ({m.unit})</option>)}</select>
        <div className="grid grid-cols-2 gap-3">
          <select className="select" name="type"><option value="IN">IN</option><option value="OUT">OUT</option></select>
          <input className="input" type="number" step="0.01" name="qty" placeholder="Qty" />
        </div>
        <input className="input" name="note" placeholder="Catatan (opsional)" />
        <button className="btn">Tambah</button>
      </form>
    </div>
  </div>;
}
