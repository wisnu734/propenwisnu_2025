'use client';
import { useEffect, useState } from "react";
import { money } from "@/lib/utils";
import { useRouter } from "next/navigation";
import Link from "next/link";

type Prod = { id: number; name: string; price: number; unit: string };
type Item = { productId: number; name: string; price: number; qty: number };

export default function OrderPage() {
  const [prods, setProds] = useState<Prod[]>([]);
  const [items, setItems] = useState<Item[]>([]);
  
  const [formData, setFormData] = useState({
    name: "", phone: "", address: "", date: "", notes: ""
  });

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoadingUser, setIsLoadingUser] = useState(true);
  const router = useRouter();

  // 1. Load Produk & Data User
  useEffect(() => {
    // Ambil Produk
    fetch("/api/products")
      .then((r) => r.json())
      .then(setProds)
      .catch((err) => console.log("Gagal ambil produk:", err));

    // Ambil Profil User (DENGAN PENANGANAN ERROR)
    fetch("/api/auth/me")
      .then((r) => {
        if (!r.ok) throw new Error("Belum login"); // Jika 404 atau 401, anggap belum login
        return r.json();
      })
      .then((data) => {
        if (data.user) {
          setIsLoggedIn(true);
          setFormData((prev) => ({
            ...prev,
            name: data.user.fullName || "",
            phone: data.user.phone || "",
            address: data.user.address || "",
          }));
        }
      })
      .catch(() => {
        // JIKA ERROR (Belum login / API tidak ada), BIARKAN SAJA
        // Tetap set Loading jadi FALSE agar banner muncul
        setIsLoggedIn(false);
      })
      .finally(() => {
        // APAPUN YANG TERJADI, MATIKAN LOADING
        setIsLoadingUser(false);
      });
  }, []);
  
  // 2. Handle Input
  const handleInput = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // 3. Tambah Item
  const add = (p: Prod) => {
    setItems(currentItems => {
      const exists = currentItems.find(i => i.productId === p.id);
      if (exists) {
        return currentItems.map(i => i.productId === p.id ? { ...i, qty: i.qty + 1 } : i);
      }
      return [...currentItems, { productId: p.id, name: p.name, price: p.price, qty: 1 }];
    });
  };

  // 4. Ubah Qty
  const changeQty = (pid: number, val: string) => {
    const num = parseInt(val);
    if (isNaN(num) || num < 1) {
      if(val === "") return;
      setItems(s => s.filter(i => i.productId !== pid));
    } else {
      setItems(s => s.map(i => i.productId === pid ? { ...i, qty: num } : i));
    }
  };

  const blurQty = (pid: number, val: string) => {
      if(val === "" || val === "0") setItems(s => s.filter(i => i.productId !== pid));
  };

  const total = items.reduce((a, b) => a + b.qty * b.price, 0);

  // 5. Submit
  async function submit() {
    if (!formData.name.trim()) return alert("Nama pemesan wajib diisi");
    if (!formData.phone.trim()) return alert("Nomor HP/WA wajib diisi");
    if (!formData.address.trim()) return alert("Alamat pengiriman wajib diisi");
    if (!formData.date) return alert("Tanggal pengiriman wajib dipilih");
    if (items.length === 0) return alert("Keranjang belanja masih kosong");

    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          phone: formData.phone,
          address: formData.address,
          deliveryDate: formData.date,
          notes: formData.notes,
          items
        })
      });

      const j = await res.json();
      if (res.ok) {
        router.push(`/order/success?no=${j.orderNo}`);
      } else {
        alert("Gagal kirim pesanan: " + (j.error || "Error server"));
      }
    } catch (e) {
      alert("Gagal menghubungi server");
    }
  }

  // --- RETURN STATEMENT (Perhatikan tidak ada komentar aneh disini) ---
return (
  <div className="max-w-5xl mx-auto grid lg:grid-cols-3 gap-8">
    
    {/* BAGIAN KIRI */}
    <div className="lg:col-span-2 space-y-6">
      
      {/* 1. LOGIKA TAMPILAN DATA PENGIRIM (Member vs Guest) */}
      <div className="bg-gray-900 border border-white/10 p-6 rounded-2xl shadow-lg">
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
          📦 <span className="text-white/90">Data Pengiriman</span>
        </h2>

        {isLoadingUser ? (
          <p className="text-white/50 animate-pulse">Memuat data user...</p>
        ) : isLoggedIn ? (
          /* --- TAMPILAN KHUSUS MEMBER (SUDAH LOGIN) --- */
          <div className="bg-white/5 p-4 rounded-xl border border-blue-500/30">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-xs text-blue-400 font-bold mb-1 uppercase tracking-wider">
                  Dikirim sebagai Member
                </p>
                <div className="text-lg font-bold text-white">{formData.name}</div>
                <div className="text-white/70">{formData.phone}</div>
                <div className="text-white/60 text-sm mt-2 max-w-md">
                  {formData.address}
                </div>
              </div>
              <Link href="/user/dashboard" className="text-xs text-white/40 hover:text-white underline">
                Ubah Alamat
              </Link>
            </div>
          </div>
        ) : (
          /* --- TAMPILAN GUEST (BELUM LOGIN) --- */
          <div className="grid md:grid-cols-2 gap-4">
             {/* Form Input Manual (Copy paste dari file aslimu yang sebelumnya) */}
             <div className="space-y-1">
              <label className="text-xs text-white/50 ml-1">Nama Penerima</label>
              <input name="name" className="input" placeholder="Nama Lengkap" value={formData.name} onChange={handleInput} />
            </div>
            <div className="space-y-1">
              <label className="text-xs text-white/50 ml-1">WhatsApp / HP</label>
              <input name="phone" className="input" placeholder="08xxxxxxxx" value={formData.phone} onChange={handleInput} />
            </div>
            <div className="md:col-span-2 space-y-1">
              <label className="text-xs text-white/50 ml-1">Alamat Lengkap</label>
              <textarea name="address" rows={2} className="textarea resize-none" placeholder="Jalan, No Rumah..." value={formData.address} onChange={handleInput} />
            </div>
          </div>
        )}

        {/* --- FORM YANG MUNCUL UNTUK KEDUANYA (Tanggal & Catatan) --- */}
        <div className="mt-4 grid md:grid-cols-2 gap-4 border-t border-white/10 pt-4">
            <div className="space-y-1">
                <label className="text-xs text-yellow-500/80 font-bold ml-1">Tgl Pengiriman (Wajib)</label>
                <input type="date" name="date" className="input [color-scheme:dark]" min={new Date().toISOString().slice(0, 10)} value={formData.date} onChange={handleInput} />
            </div>
            <div className="space-y-1">
              <label className="text-xs text-white/50 ml-1">Catatan (Opsional)</label>
              <input name="notes" className="input" placeholder="Contoh: Warung Kuning" value={formData.notes} onChange={handleInput} />
            </div>
        </div>
      </div>

        {/* Menu */}
        <div className="bg-gray-900 border border-white/10 p-6 rounded-2xl shadow-lg">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">🍽️ <span className="text-white/90">Pilih Menu</span></h2>
          <div className="grid sm:grid-cols-2 gap-3">
            {prods.map(p => (
              <button key={p.id} onClick={() => add(p)} className="group relative flex flex-col items-start p-4 bg-white/5 hover:bg-white/10 border border-transparent hover:border-yellow-400/50 rounded-xl transition-all duration-200 text-left">
                <div className="font-bold text-lg text-gray-100">{p.name}</div>
                <div className="text-sm text-white/60 mb-3">{money(p.price)} <span className="text-xs">/ {p.unit}</span></div>
                <div className="mt-auto px-3 py-1 bg-yellow-500/20 text-yellow-400 text-xs font-bold rounded-full group-hover:bg-yellow-400 group-hover:text-black transition">+ Tambah</div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* BAGIAN KANAN */}
      <div className="lg:col-span-1">
        <div className="sticky top-24 bg-gray-900 border border-white/10 rounded-2xl p-6 shadow-xl">
          <h2 className="text-xl font-bold mb-4 border-b border-white/10 pb-4">Keranjang</h2>
          {items.length === 0 ? (
            <div className="text-center py-10 text-white/30 border-2 border-dashed border-white/5 rounded-xl"><div className="text-2xl mb-2">🛒</div>Belum ada item</div>
          ) : (
            <div className="space-y-4">
              <div className="space-y-3 max-h-[40vh] overflow-y-auto pr-1">
                {items.map(it => (
                  <div key={it.productId} className="flex items-center justify-between gap-2 bg-black/20 p-3 rounded-lg">
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-sm truncate">{it.name}</div>
                      <div className="text-xs text-white/50">{money(it.price)}</div>
                    </div>
                    <input type="number" min="0" className="w-14 bg-white/10 border border-white/10 rounded text-center text-sm py-1 focus:outline-none focus:bg-white/20" value={it.qty === 0 ? "" : it.qty} onChange={(e) => changeQty(it.productId, e.target.value)} onBlur={(e) => blurQty(it.productId, e.target.value)} />
                  </div>
                ))}
              </div>
              <div className="border-t border-white/10 pt-4 mt-2">
                <div className="flex justify-between items-center text-lg mb-4"><span className="text-white/60">Total Bayar</span><span className="font-bold text-yellow-400 text-xl">{money(total)}</span></div>
                <button onClick={submit} className="w-full bg-gradient-to-r from-yellow-500 to-orange-600 hover:from-yellow-400 hover:to-orange-500 text-black font-bold py-3 rounded-xl shadow-lg transform active:scale-95 transition-all">Kirim Pesanan 🚀</button>
                <p className="text-center text-[10px] text-white/30 mt-3">Pastikan data pengiriman sudah benar.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}