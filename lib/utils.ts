export const STAT = ["NEW","CONFIRMED","IN_PRODUCTION","READY","COMPLETED","CANCELLED"] as const;
export type Status = typeof STAT[number];
export const money = (x:number)=> new Intl.NumberFormat("id-ID",{style:"currency",currency:"IDR",maximumFractionDigits:0}).format(x);
export const orderNo = ()=>{
  const d=new Date(); const y=String(d.getFullYear()).slice(-2); const m=String(d.getMonth()+1).padStart(2,"0"); const day=String(d.getDate()).padStart(2,"0");
  const r=Math.random().toString(36).slice(2,6).toUpperCase(); return `MP${y}${m}${day}-${r}`;
};
