import { NextResponse } from "next/server";
export async function POST(req:Request){
  const { password } = await req.json();
  const expect = process.env.ADMIN_PASSWORD || "admin";
  if(!password || password !== expect) return NextResponse.json({error:"unauthorized"}, {status:401});
  const res = NextResponse.json({ ok:true });
  res.cookies.set("admin","1",{ httpOnly:true, maxAge:60*60*24*7, path:"/" });
  return res;
}
