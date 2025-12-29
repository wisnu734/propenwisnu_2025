import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  // 1. Cek Cookie Login Admin
  // Kita cek apakah ada cookie bernama "admin"
  const isLoggedIn = request.cookies.has('admin');

  // 2. ATURAN PROTEKSI ADMIN
  // Jika mau masuk folder /admin...
  if (path.startsWith('/admin')) {
    
    // TAPI, kalau mau ke halaman login, biarkan lewat
    if (path === '/admin/login') {
      // Kalau ternyata sudah login, lempar langsung ke dashboard (biar gak login ulang)
      if (isLoggedIn) {
        return NextResponse.redirect(new URL('/admin', request.url));
      }
      return NextResponse.next(); // Lanjut ke form login
    }

    // Kalau mau ke Dashboard tapi BELUM login -> TENDANG KE LOGIN
    if (!isLoggedIn) {
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }
  }

  // Selain urusan admin, biarkan lewat (Order, Homepage, API aman)
  return NextResponse.next();
}

// Tentukan middleware ini aktif di mana saja
export const config = {
  matcher: ['/admin/:path*'], // Hanya memantau jalur admin
}