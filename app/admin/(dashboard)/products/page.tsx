import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { money } from "@/lib/utils";

async function add(fd:FormData){ "use server";
  const name=String(fd.get("name")||"").trim(); const unit=String(fd.get("unit")||"").trim();
  const price=Number(fd.get("price")||0); let slug=String(fd.get("slug")||"").trim().toLowerCase().replace(/\s+/g,"-");
  if(!slug) slug=name.toLowerCase().replace(/\s+/g,"-");
  if(!name||!unit||!price||!slug) return;
  await prisma.product.create({ data:{ name, slug, unit, price, isActive:true } });
}
export default async function Prods(){
  const rows = await prisma.product.findMany({ orderBy:{ id:"asc" } });
  return <div className="space-y-6">
    <div className="card p-4">
      <h2 className="text-xl font-semibold mb-3">Tambah Produk</h2>
      <form action={add} className="grid sm:grid-cols-4 gap-3">
        <input className="input" name="name" placeholder="Nama" />
        <input className="input" name="slug" placeholder="slug (opsional)" />
        <input className="input" name="unit" placeholder="pak / kg / pcs" />
        <input className="input" type="number" name="price" placeholder="Harga" />
        <div className="sm:col-span-4"><button className="btn">Simpan</button></div>
      </form>
    </div>
    <div className="card p-4">
      <h2 className="text-xl font-semibold mb-3">Produk</h2>
      <table className="table"><thead><tr><th>ID</th><th>Nama</th><th>Slug</th><th>Satuan</th><th>Harga</th><th>Status</th><th>Aksi</th></tr></thead>
      <tbody>{rows.map(p=>(<tr key={p.id} className="border-t border-white/5"><td>{p.id}</td><td>{p.name}</td><td className="text-xs">{p.slug}</td><td>{p.unit}</td><td>{money(p.price)}</td><td>{p.isActive?"Aktif":"Nonaktif"}</td><td><Link className="btn btn-ghost" href={`/admin/products/${p.id}`}>Edit</Link></td></tr>))}</tbody></table>
    </div>
  </div>;
}
