import "./globals.css";
import Link from "next/link";

export const metadata = { title: "UMKM Fix JS", description: "Order & Ledger" };

export default function Root({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id">
      <body>
        <header className="container py-4 flex items-center justify-between border-b border-white/10 mb-6">
          <Link href="/" className="font-bold text-xl tracking-tight">🍜 Mie Pangsit</Link>
          <nav className="flex gap-2 text-sm items-center">
            {/* Menu untuk Pembeli */}
            <Link className="btn btn-ghost" href="/order">Pesan</Link>
            <Link className="btn btn-ghost" href="/login">Login Member</Link>
            
            <span className="text-white/20">|</span>
            
            {/* Menu Khusus Admin (Bisa disembunyikan atau ditaruh di footer kalau mau rahasia) */}
            <Link className="text-white/50 hover:text-white text-xs" href="/admin/login">Admin</Link>
          </nav>
        </header>
        <main className="container pb-24">{children}</main>
      </body>
    </html>
  );
}