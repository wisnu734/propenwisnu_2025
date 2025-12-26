import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { orderNo } from "@/lib/utils";

export async function POST(req:Request){
  try{
    const { name, phone, address, deliveryDate, notes, items } = await req.json();
    if(!name||!phone||!address||!deliveryDate||!Array.isArray(items)||items.length===0) return NextResponse.json({error:"Invalid"}, {status:400});
    const d = new Date(deliveryDate); const now=new Date(); const start=new Date(now.getFullYear(),now.getMonth(),now.getDate());
    if(!(d instanceof Date)||isNaN(d.getTime())||d<start) return NextResponse.json({error:"Tanggal kirim tidak valid"}, {status:400});
    const cust = await prisma.customer.create({ data:{ name, phone, address } });
    const no = orderNo();
    await prisma.order.create({ data:{
      orderNo:no, customerId:cust.id, delivery:d, notes: String(notes||""),
      items: { create: items.map((it:any)=> ({ productId: Number(it.productId), qty: Number(it.qty), price: Number(it.price) })) },
      events: { create: [{ status: "NEW", note: "" }] }
    }});
    return NextResponse.json({ ok:true, orderNo: no });
  }catch(e){ console.error(e); return NextResponse.json({error:"Server error"}, {status:500}); }
}
