import { prisma } from "@/lib/prisma";

async function save(fd:FormData){ "use server";
  const id=Number(fd.get("id")); const name=String(fd.get("name")||""); const slug=String(fd.get("slug")||"");
  const unit=String(fd.get("unit")||""); const price=Number(fd.get("price")||0);
  const isActive=String(fd.get("isActive"))==="on";
  await prisma.product.update({ where:{id}, data:{ name, slug, unit, price, isActive } });
}
async function delProd(fd:FormData){ "use server";
  const id=Number(fd.get("id")); await prisma.recipe.deleteMany({ where:{ productId:id } });
  await prisma.orderItem.deleteMany({ where:{ productId:id } }); await prisma.product.delete({ where:{ id } });
}
async function addRec(fd:FormData){ "use server";
  const productId=Number(fd.get("productId")); const materialId=Number(fd.get("materialId"));
  const qtyPerUnit=Number(fd.get("qtyPerUnit")); if(!productId||!materialId||!qtyPerUnit) return;
  await prisma.recipe.create({ data:{ productId, materialId, qtyPerUnit } });
}
async function delRec(fd:FormData){ "use server";
  const id=Number(fd.get("id")); await prisma.recipe.delete({ where:{ id } });
}

export default async function Edit({ params }:{ params:{ id:string } }){
  const id=Number(params.id);
  const p = await prisma.product.findUnique({ where:{ id } });
  const mats = await prisma.material.findMany({ orderBy:{ name:"asc" } });
  const recs = await prisma.recipe.findMany({ where:{ productId:id }, include:{ material:true } });
  if(!p) return <div className="card p-4">Produk tidak ditemukan.</div>;
  return <div className="space-y-6">
    <div className="card p-4">
      <h2 className="text-xl font-semibold mb-3">Edit Produk</h2>
      <form action={save} className="grid sm:grid-cols-2 gap-3">
        <input type="hidden" name="id" value={p.id} />
        <input className="input" name="name" defaultValue={p.name} />
        <input className="input" name="slug" defaultValue={p.slug} />
        <input className="input" name="unit" defaultValue={p.unit} />
        <input className="input" type="number" name="price" defaultValue={p.price} />
        <label className="flex items-center gap-2"><input type="checkbox" name="isActive" defaultChecked={p.isActive} /> Aktif</label>
        <div className="sm:col-span-2 flex gap-2">
          <button className="btn">Simpan</button>
          <form action={delProd}><input type="hidden" name="id" value={p.id} /><button className="btn btn-ghost" onClick={(e)=>{ if(!confirm('Hapus?')) e.preventDefault(); }}>Hapus</button></form>
        </div>
      </form>
    </div>
    <div className="card p-4">
      <h3 className="font-semibold mb-3">Resep / BOM</h3>
      <table className="table"><thead><tr><th>Material</th><th>Qty/unit</th><th>Aksi</th></tr></thead>
      <tbody>{recs.map(r=>(<tr key={r.id} className="border-top border-white/5"><td>{r.material.name}</td><td>{r.qtyPerUnit} {r.material.unit}</td><td><form action={delRec}><input type="hidden" name="id" value={r.id}/><button className="btn btn-ghost">Hapus</button></form></td></tr>))}</tbody></table>
      <form action={addRec} className="grid sm:grid-cols-3 gap-3 mt-4">
        <input type="hidden" name="productId" value={p.id} />
        <select className="select" name="materialId">{mats.map(m=><option key={m.id} value={m.id}>{m.name} ({m.unit})</option>)}</select>
        <input className="input" type="number" step="0.01" name="qtyPerUnit" placeholder="Qty/unit" />
        <button className="btn">Tambah</button>
      </form>
    </div>
  </div>;
}
