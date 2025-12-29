'use client';
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    // Kita gunakan API login yang sama, tapi logic cookie nanti dibedakan di API
    // Untuk simplifikasi, kita anggap API login sekarang mengembalikan role
    const res = await fetch("/api/auth/login-user", { // Perhatikan endpoint baru di bawah
      method: "POST",
      body: JSON.stringify({ username, password })
    });
    
    if (res.ok) {
      router.push("/order"); // Redirect ke order setelah login
      router.refresh();
    } else {
      alert("Username atau password salah");
      setLoading(false);
    }
  }

  return (
    <div className="max-w-md mx-auto mt-10 card p-6">
      <h1 className="text-2xl font-bold mb-6 text-center">Masuk Akun</h1>
      <form onSubmit={handleLogin} className="space-y-4">
        <div>
          <label className="block text-sm mb-1 text-white/70">Username</label>
          <input className="input" value={username} onChange={e => setUsername(e.target.value)} required />
        </div>
        <div>
          <label className="block text-sm mb-1 text-white/70">Password</label>
          <input type="password" className="input" value={password} onChange={e => setPassword(e.target.value)} required />
        </div>
        <button disabled={loading} className="btn w-full">
          {loading ? "Memproses..." : "Masuk"}
        </button>
      </form>
      <div className="mt-4 text-center text-sm">
        Belum punya akun? <Link href="/register" className="text-blue-400 hover:underline">Daftar disini</Link>
      </div>
    </div>
  );
}