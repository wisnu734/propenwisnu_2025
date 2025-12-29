import Link from "next/link";

export const metadata = { title: "UMKM Mie Pangsit", description: "Pesan Mie Pangsit Lezat" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id">
      <body className="min-h-screen flex flex-col font-sans bg-gray-950 text-gray-100">
        
        {/* === NAVBAR / HEADER (MUNCUL DI SEMUA HALAMAN) === */}
        <header className="border-b border-white/10 bg-gray-900/50 backdrop-blur-md sticky top-0 z-50">
          <div className="container mx-auto px-4 py-3 flex items-center justify-between">
            {/* Logo Kiri */}
            <Link href="/" className="font-bold text-xl tracking-tight text-yellow-400 flex items-center gap-2">
              🍜 <span className="hidden sm:inline">Mie Pangsit</span>
            </Link>
            
            {/* Menu Kanan */}
            <nav className="flex gap-2 text-sm items-center">
              <Link className="px-4 py-2 rounded-full hover:bg-white/10 transition" href="/order">Menu & Pesan</Link>
              <Link className="px-4 py-2 rounded-full bg-blue-600 hover:bg-blue-500 transition font-medium shadow-lg shadow-blue-500/20" href="/login">Login Member</Link>
            </nav>
          </div>
        </header>

        {/* === KONTEN UTAMA (BERUBAH SESUAI HALAMAN) === */}
        <main className="container mx-auto px-4 py-8 flex-grow">
          {children}
        </main>

        {/* === FOOTER (MUNCUL DI SEMUA HALAMAN) === */}
        <footer className="border-t border-white/10 py-10 mt-8 text-center bg-gray-900/30">
          <p className="text-xs text-white/30 mb-4">&copy; 2025 UMKM Mie Pangsit. All rights reserved.</p>
          
          <div className="flex justify-center items-center gap-6 text-sm">
            <Link href="/" className="text-white/40 hover:text-white transition">Beranda</Link>
            <Link href="/order" className="text-white/40 hover:text-white transition">Menu</Link>
            
            {/* Tombol Staff / Admin */}
            <Link 
              href="/admin/login" 
              className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/5 hover:bg-red-900/20 hover:border-red-500/30 hover:text-red-300 text-white/30 text-xs transition-all duration-300 group"
            >
              <span className="group-hover:scale-110 transition-transform">🔒</span>
              <span>Portal Staff</span>
            </Link>
          </div>
        </footer>

      </body>
    </html>
  );
}