'use client';
import { useSearchParams } from "next/navigation";
import Link from "next/link";
export default function Ok(){
  const sp=useSearchParams(); const no=sp.get("no");
  return <div className="card p-6 max-w-xl mx-auto text-center">
    <div className="text-6xl">✅</div>
    <h2 className="text-2xl font-bold mt-2">Pesanan diterima</h2>
    <p className="text-white/70 mt-2">Nomor: <span className="font-mono bg-black/30 px-2 py-1 rounded">{no}</span></p>
    <Link className="btn btn-ghost mt-6" href="/">Kembali</Link>
  </div>;
}
