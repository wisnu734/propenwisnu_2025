# UMKM-FIX-JS-JS (Next.js + Prisma + Tailwind)
- Admin login (cookie) — password: `.env` → `ADMIN_PASSWORD` (default: `admin`)
- CRUD Produk + Resep/BOM
- Ledger bahan (IN/OUT), rekap stok
- Pesan pelanggan `/order` (MTO), validasi tanggal kirim
- Auto-OUT bahan saat status `IN_PRODUCTION`
- Export CSV: `/api/export/orders`, `/api/export/materials`

## Quickstart (Windows)
```cmd
cd C:\path\to\umkm-fix
copy .env.example .env
npm i
npx prisma generate
npx prisma migrate dev --name init
npx prisma db seed
npm run dev
```
