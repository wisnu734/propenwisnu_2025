import { NextResponse } from "next/server";
export async function GET(){
  const res = NextResponse.redirect(new URL("/admin/login", process.env.NEXT_PUBLIC_BASE || "http://localhost:3000"));
  res.cookies.set("admin","",{ httpOnly:true, maxAge:0, path:"/" });
  return res;
}
