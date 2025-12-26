'use client';
import { useState } from "react";
export default function Login(){
  const [pw,setPw]=useState("");
  async function submit(e:React.FormEvent){ e.preventDefault();
    const r=await fetch("/api/auth/login",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({password:pw})});
    if(r.ok) location.href="/admin"; else alert("Password salah");
  }
  return <div className="max-w-md mx-auto card p-6">
    <h1 className="text-2xl font-bold mb-4">Masuk Admin</h1>
    <form onSubmit={submit} className="space-y-3">
      <input type="password" className="input" placeholder="Password" value={pw} onChange={e=>setPw(e.target.value)}/>
      <button className="btn w-full">Masuk</button>
      <p className="text-xs text-white/60">Ubah di .env → ADMIN_PASSWORD</p>
    </form>
  </div>;
}
