import Link from "next/link";

export default function SuccessPage({ searchParams }: { searchParams: { no: string } }) {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center space-y-6 px-4">
      <div className="h-20 w-20 bg-green-500 rounded-full flex items-center justify-center text-4xl shadow-lg shadow-green-500/30">
        ✅
      </div>
      
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Pesanan Diterima!</h1>
        <p className="text-white/60">Terima kasih sudah memesan.</p>
        {searchParams.no && (
          <div className="mt-4 p-3 bg-white/5 rounded-lg border border-white/10 inline-block">
            <span className="text-xs text-white/40 block">Nomor Pesanan:</span>
            <span className="text-xl font-mono text-yellow-400 tracking-wider">{searchParams.no}</span>
          </div>
        )}
      </div>

      <div className="flex gap-4 mt-8">
        <Link href="/" className="px-6 py-2 rounded-full border border-white/20 hover:bg-white/10 transition">
          Kembali ke Beranda
        </Link>
        <Link href="/order" className="px-6 py-2 rounded-full bg-yellow-500 text-black font-bold hover:bg-yellow-400 transition shadow-lg shadow-yellow-500/20">
          Pesan Lagi
        </Link>
      </div>
    </div>
  );
}