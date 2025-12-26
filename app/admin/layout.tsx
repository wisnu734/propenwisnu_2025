import Link from "next/link";
export default function Lay({children}:{children:React.ReactNode}){
  return <div className="grid md:grid-cols-5 gap-6">
    <aside className="md:col-span-1 card p-4 h-fit sticky top-6">
      <h3 className="font-semibold mb-2">Admin</h3>
      <nav className="space-y-1 text-sm">
        <Link className="block px-3 py-2 rounded hover:bg-white/5" href="/admin">Dashboard</Link>
        <Link className="block px-3 py-2 rounded hover:bg-white/5" href="/admin/orders">Pesanan</Link>
        <Link className="block px-3 py-2 rounded hover:bg-white/5" href="/admin/materials">Material</Link>
        <Link className="block px-3 py-2 rounded hover:bg-white/5" href="/admin/inventory">Stok</Link>
        <Link className="block px-3 py-2 rounded hover:bg-white/5" href="/admin/products">Produk</Link>
        <a className="block px-3 py-2 rounded hover:bg-white/5" href="/api/export/orders">Export Orders CSV</a>
        <a className="block px-3 py-2 rounded hover:bg-white/5" href="/api/export/materials">Export Materials CSV</a>
        <a className="block px-3 py-2 rounded hover:bg-white/5" href="/api/auth/logout">Logout</a>
      </nav>
    </aside>
    <section className="md:col-span-4">{children}</section>
  </div>;
}
