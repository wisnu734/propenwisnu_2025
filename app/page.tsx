import Link from "next/link";
export default function Home(){
  return <div className="grid md:grid-cols-2 gap-6 items-center">
    <div className="space-y-4">
      <h1 className="text-4xl font-bold leading-tight">Mie Pangsit Make-to-Order</h1>
      <p className="text-white/70">Pelanggan pesan langsung, admin pantau pesanan dan bahan baku.</p>
      <div className="flex gap-3">
        <Link className="btn" href="/order">Pesan Sekarang</Link>
        <Link className="btn btn-ghost" href="/admin/login">Masuk Admin</Link>
      </div>
    </div>
    <div className="card p-6">UI simple • cepat • dark</div>
  </div>;
}
