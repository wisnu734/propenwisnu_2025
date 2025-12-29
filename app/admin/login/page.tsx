'use client';
import { useState } from "react";
// import Link dan useRouter tidak lagi wajib jika kita pakai window.location
// import Link from "next/link"; 
// import { useRouter } from "next/navigation"; 

export default function AdminLogin() {
  const [user, setUser] = useState("");
  const [pw, setPw] = useState("");
  const [loading, setLoading] = useState(false);
  // const router = useRouter(); // Hapus ini

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    
    try {
      const r = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: user, password: pw })
      });

      if (r.ok) {
        // SUKSES LOGIN
        // 1. Redirect Paksa ke /admin
        window.location.href = "/admin"; 
      } else {
        alert("Username atau Password salah");
        setLoading(false);
      }
    } catch (err) {
      alert("Error koneksi");
      setLoading(false);
    }
  }
  
  return (
    <div className="flex justify-center items-center min-h-[60vh]">
      <div className="w-full max-w-md bg-gray-900 border border-white/10 p-8 rounded-2xl shadow-2xl">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-red-400 mb-2">Portal Staff</h1>
          <p className="text-sm text-white/50">Masuk untuk mengelola pesanan & stok</p>
        </div>

        <form onSubmit={submit} className="space-y-4">
          <div>
            <label className="block text-xs text-white/60 mb-1 uppercase tracking-wider">Username</label>
            <input
              className="w-full bg-black/30 border border-white/10 rounded-lg px-4 py-3 focus:outline-none focus:border-red-500 transition text-white"
              placeholder="Username Admin"
              value={user}
              onChange={e => setUser(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-xs text-white/60 mb-1 uppercase tracking-wider">Password</label>
            <input
              type="password"
              className="w-full bg-black/30 border border-white/10 rounded-lg px-4 py-3 focus:outline-none focus:border-red-500 transition text-white"
              placeholder="••••••"
              value={pw}
              onChange={e => setPw(e.target.value)}
              required
            />
          </div>

          <button 
            disabled={loading}
            className="w-full bg-red-600 hover:bg-red-500 text-white font-bold py-3 rounded-lg transition disabled:opacity-50 mt-4"
          >
            {loading ? "Memproses..." : "Masuk Dashboard"}
          </button>
        </form>

        <div className="mt-6 text-center">
          <a href="/" className="text-sm text-white/40 hover:text-white transition">
            ← Kembali ke Beranda
          </a>
        </div>
      </div>
    </div>
  );
}