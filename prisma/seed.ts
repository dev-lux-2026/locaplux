import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  // --- 1) Catégories ---
  const cat1 = await prisma.category.create({
    data: { 
      id: crypto.randomUUID(),
      name: "Électronique",
      root: "Électronique",
      parent: "Électronique",
      name_fr: "Électronique",
      name_en: "Electronics",
      name_lu: "Elektronik"
    },
  });

  const cat2 = await prisma.category.create({
    data: { 
      id: crypto.randomUUID(),
      name: "Maison",
      root: "Maison",
      parent: "Maison",
      name_fr: "Maison",
      name_en: "Home",
      name_lu: "Doheem"
    },
  });

  const cat3 = await prisma.category.create({
    data: { 
      id: crypto.randomUUID(),
      name: "Sport",
      root: "Sport",
      parent: "Sport",
      name_fr: "Sport",
      name_en: "Sport",
      name_lu: "Sport"
    },
  });

  // --- 2) Partenaire ---
  const partner = await prisma.user.create({
    data: {
      id: crypto.randomUUID(),
      name: "Locaplux Démo Partner",
      email: "partner@test.com",
      role: "partner",
      status: "approved"
    },
  });

  // --- 3) Produits ---
  await prisma.product.create({
    data: {
      id: crypto.randomUUID(),
      name: "iPhone 14",
      price: 999,
      stock: 10,
      images: [
        "https://picsum.photos/seed/iphone/600/600"
      ],
      status: "approved",
      categoryId: cat1.id,
      partnerId: partner.id,
    },
  });

  await prisma.product.create({
    data: {
      id: crypto.randomUUID(),
      name: "Aspirateur Dyson V10",
      price: 499,
      stock: 5,
      images: [
        "https://picsum.photos/seed/dyson/600/600"
      ],
      status: "approved",
      categoryId: cat2.id,
      partnerId: partner.id,
    },
  });

  await prisma.product.create({
    data: {
      id: crypto.randomUUID(),
      name: "Vélo de route carbone",
      price: 1299,
      stock: 3,
      images: [
        "https://picsum.photos/seed/velo/600/600"
      ],
      status: "approved",
      categoryId: cat3.id,
      partnerId: partner.id,
    },
  });

  console.log("🌱 Seed terminé !");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
