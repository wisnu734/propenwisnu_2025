const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
async function main() {
  const prods = [
    { name:"Mie Pangsit 500g", slug:"mie-500", unit:"pak", price:18000 },
    { name:"Mie Pangsit 1kg", slug:"mie-1kg", unit:"kg", price:32000 },
    { name:"Kerupuk 250g", slug:"krupuk-250", unit:"pak", price:12000 },
    { name:"Kerupuk 500g", slug:"krupuk-500", unit:"pak", price:20000 }
  ];
  for (const p of prods) await prisma.product.upsert({ where:{slug:p.slug}, update:p, create:p });

  const mats = [
    { name:"Tepung", unit:"kg" }, { name:"Telur", unit:"butir" },
    { name:"Garam", unit:"kg" }, { name:"Air", unit:"L" }
  ];
  for (const m of mats) await prisma.material.upsert({ where:{name:m.name}, update:m, create:m });

  const f = async (name)=> prisma.material.findFirst({ where:{ name } });
  const tepung = await f("Tepung"); const telur = await f("Telur");
  const garam = await f("Garam"); const air = await f("Air");
  const g = async (slug)=> prisma.product.findFirst({ where:{ slug } });
  const mie500 = await g("mie-500"); const mie1kg = await g("mie-1kg");
  const krp250 = await g("krupuk-250"); const krp500 = await g("krupuk-500");
  const recs = [
    { productId: mie500.id, materialId: tepung.id, qtyPerUnit: 0.5 },
    { productId: mie500.id, materialId: telur.id,  qtyPerUnit: 1 },
    { productId: mie500.id, materialId: garam.id,  qtyPerUnit: 0.01 },
    { productId: mie500.id, materialId: air.id,    qtyPerUnit: 0.2 },
    { productId: mie1kg.id, materialId: tepung.id, qtyPerUnit: 1 },
    { productId: mie1kg.id, materialId: telur.id,  qtyPerUnit: 2 },
    { productId: mie1kg.id, materialId: garam.id,  qtyPerUnit: 0.02 },
    { productId: mie1kg.id, materialId: air.id,    qtyPerUnit: 0.4 },
    { productId: krp250.id, materialId: tepung.id, qtyPerUnit: 0.25 },
    { productId: krp250.id, materialId: garam.id,  qtyPerUnit: 0.01 },
    { productId: krp250.id, materialId: air.id,    qtyPerUnit: 0.1 },
    { productId: krp500.id, materialId: tepung.id, qtyPerUnit: 0.5 },
    { productId: krp500.id, materialId: garam.id,  qtyPerUnit: 0.015 },
    { productId: krp500.id, materialId: air.id,    qtyPerUnit: 0.18 }
  ];
  for (const r of recs) await prisma.recipe.create({ data:r });
  console.log("Seed done.");
}
main().finally(()=>prisma.$disconnect());
