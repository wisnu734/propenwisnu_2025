'use client';
import { useEffect, useState } from "react";
import { money } from "@/lib/utils";
import { useRouter } from "next/navigation";

type Prod = { id:number; name:string; price:number; unit:string };
type Item = { productId:number; name:string; price:number; qty:number };

export default function OrderPage(){
  const [prods,setProds]=useState<Prod[]>([]);
  const [name,setName]=useState(""); const [phone,setPhone]=useState(""); const [addr,setAddr]=useState("");
  const [date,setDate]=useState(""); const [notes,setNotes]=useState(""); const [items,setItems]=useState<Item[]>([]);
  const r=useRouter();
  useEffect(()=>{ fetch("/api/products").then(r=>r.json()).then(setProds); },[]);
  const add=(p:Prod)=> setItems(s=>{
    const e=s.find(i=>i.productId===p.id); if(e) return s.map(i=>i.productId===p.id?{...i,qty:i.qty+1}:i);
    return [...s,{productId:p.id,name:p.name,price:p.price,qty:1}];
  });
  const setQty=(pid:number,q:number)=> setItems(s=> q<1 ? s.filter(i=>i.productId!==pid) : s.map(i=>i.productId===pid?{...i,qty:q}:i));
  const total = items.reduce((a,b)=>a+b.qty*b.price,0);
  async function submit(){
    if(!name||!phone||!addr||!date||items.length===0){ alert("Lengkapi data & item."); return; }
    const res=await fetch("/api/orders",{method:"POST",headers:{"Content-Type":"application/json"},
      body:JSON.stringify({name,phone,address:addr,deliveryDate:date,notes,items})});
    const j=await res.json();
    if(res.ok) r.push(`/order/success?no=${j.orderNo}`); else alert(j.error||"Gagal.");
  }
  return <div className="grid lg:grid-cols-3 gap-6">
    <div className="lg:col-span-2 space-y-4">
      <div className="card p-5">
        <h2 className="text-xl font-semibold mb-4">Data Pelanggan</h2>
        <div className="grid md:grid-cols-2 gap-3">
          <input className="input" placeholder="Nama" value={name} onChange={e=>setName(e.target.value)} />
          <input className="input" placeholder="HP/WA" value={phone} onChange={e=>setPhone(e.target.value)} />
          <textarea className="textarea md:col-span-2" rows={3} placeholder="Alamat" value={addr} onChange={e=>setAddr(e.target.value)} />
          <input type="date" className="input" min={new Date().toISOString().slice(0,10)} value={date} onChange={e=>setDate(e.target.value)} />
          <input className="input" placeholder="Catatan (opsional)" value={notes} onChange={e=>setNotes(e.target.value)} />
        </div>
      </div>
      <div className="card p-5">
        <h2 className="text-xl font-semibold mb-4">Produk</h2>
        <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-3">
          {prods.map(p=>(
            <button key={p.id} className="card p-4 text-left hover:bg-white/10" onClick={()=>add(p)}>
              <div className="font-semibold">{p.name}</div>
              <div className="text-sm text-white/70">{money(p.price)} / {p.unit}</div>
              <div className="text-xs text-white/60 mt-1">Klik untuk tambah</div>
            </button>
          ))}
        </div>
      </div>
    </div>
    <div className="space-y-4">
      <div className="card p-5">
        <h2 className="text-xl font-semibold mb-4">Ringkasan</h2>
        {items.length===0? <p className="text-sm text-white/60">Belum ada item</p> :
          <div className="space-y-2">
            {items.map(it=>(
              <div key={it.productId} className="flex items-center justify-between gap-2">
                <div><div className="font-medium">{it.name}</div><div className="text-xs text-white/60">{money(it.price)}</div></div>
                <div className="flex items-center gap-2">
                  <input type="number" min={1} className="input w-20 text-right" value={it.qty} onChange={e=>setQty(it.productId,parseInt(e.target.value||"1"))} />
                  <div className="w-24 text-right">{money(it.qty*it.price)}</div>
                </div>
              </div>
            ))}
            <div className="border-t border-white/10 pt-2 flex items-center justify-between"><b>Total</b><b>{money(total)}</b></div>
            <button className="btn w-full" onClick={submit}>Kirim Pesanan</button>
          </div>
        }
      </div>
      <div className="text-xs text-white/60">* Make-to-order: produksi harian sesuai pesanan.</div>
    </div>
  </div>;
}
