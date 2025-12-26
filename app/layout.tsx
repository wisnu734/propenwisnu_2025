import "./globals.css";
import Link from "next/link";

export const metadata = { title: "UMKM Fix JS", description: "Order & Ledger" };

export default function Root({ children }:{children:React.ReactNode}){
  return <html lang="id"><body>
    <header className="container py-4 flex items-center justify-between">
      <Link href="/" className="font-bold text-lg">🍜 UMKM</Link>
      <nav className="flex gap-2 text-sm">
        <Link className="btn btn-ghost" href="/order">Pesan</Link>
        <Link className="btn btn-ghost" href="/admin/login">Admin</Link>
      </nav>
    </header>
    <main className="container pb-24">{children}</main>
  </body></html>;
}
