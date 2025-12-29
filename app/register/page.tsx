'use client';
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  // State untuk semua data
  const [form, setForm] = useState({
    username: "", password: "", fullName: "", phone: "", address: ""
  });
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form) // Kirim semua data form
    });

    const json = await res.json();
    if (res.ok) {
      alert("✅ Akun berhasil dibuat! Silakan Login.");
      router.push("/login");
    } else {
      alert("❌ " + json.error);
    }
    setLoading(false);
  }

  // Helper untuk update state
  const handleChange = (e: any) => setForm({ ...form, [e.target.name]: e.target.value });

  return (
    <div className="max-w-lg mx-auto mt-10 card p-6">
      <h1 className="text-2xl font-bold mb-6 text-center">Daftar Member Baru</h1>
      <form onSubmit={handleRegister} className="space-y-3">
        {/* Akun */}
        <div className="grid grid-cols-2 gap-3">
          <input name="username" className="input" placeholder="Username" onChange={handleChange} required />
          <input name="password" type="password" className="input" placeholder="Password" onChange={handleChange} required />
        </div>
        
        <hr className="border-white/10 my-2"/>
        
        {/* Data Diri Lengkap */}
        <input name="fullName" className="input" placeholder="Nama Lengkap" onChange={handleChange} required />
        <input name="phone" className="input" placeholder="No WhatsApp / HP" onChange={handleChange} required />
        <textarea name="address" className="textarea" rows={3} placeholder="Alamat Lengkap Pengiriman" onChange={handleChange} required />
        
        <button disabled={loading} className="btn w-full font-bold mt-4">
          {loading ? "Mendaftarkan..." : "Daftar Sekarang"}
        </button>
      </form>
      <div className="mt-4 text-center text-sm">
        Sudah punya akun? <Link href="/login" className="text-blue-400 hover:underline">Masuk disini</Link>
      </div>
    </div>
  );
}