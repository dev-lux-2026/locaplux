// lib/categories/food.ts

const food = {
  // ============================
  // 🥐 Alimentation → Petit-déjeuner → Céréales
  // ============================
  cereal: { category: "Céréales", parent: "Petit-déjeuner", root: "Alimentation" },
  cereals: { category: "Céréales", parent: "Petit-déjeuner", root: "Alimentation" },
  céréales: { category: "Céréales", parent: "Petit-déjeuner", root: "Alimentation" },
  müsli: { category: "Céréales", parent: "Petit-déjeuner", root: "Alimentation" }, // DE

  // ============================
  // 🥐 Alimentation → Petit-déjeuner → Confitures
  // ============================
  jam: { category: "Confitures", parent: "Petit-déjeuner", root: "Alimentation" },
  confiture: { category: "Confitures", parent: "Petit-déjeuner", root: "Alimentation" },
  marmelade: { category: "Confitures", parent: "Petit-déjeuner", root: "Alimentation" }, // DE

  // ============================
  // 🍝 Alimentation → Épicerie → Pâtes
  // ============================
  pasta: { category: "Pâtes", parent: "Épicerie", root: "Alimentation" },
  spaghetti: { category: "Pâtes", parent: "Épicerie", root: "Alimentation" },
  pâtes: { category: "Pâtes", parent: "Épicerie", root: "Alimentation" },
  nudeln: { category: "Pâtes", parent: "Épicerie", root: "Alimentation" }, // DE

  // ============================
  // 🍚 Alimentation → Épicerie → Riz
  // ============================
  rice: { category: "Riz", parent: "Épicerie", root: "Alimentation" },
  riz: { category: "Riz", parent: "Épicerie", root: "Alimentation" },
  reis: { category: "Riz", parent: "Épicerie", root: "Alimentation" }, // DE

  // ============================
  // 🍫 Alimentation → Snacks → Chocolat
  // ============================
  chocolate: { category: "Chocolat", parent: "Snacks", root: "Alimentation" },
  chocolat: { category: "Chocolat", parent: "Snacks", root: "Alimentation" },
  schokolade: { category: "Chocolat", parent: "Snacks", root: "Alimentation" }, // DE

  // ============================
  // 🍪 Alimentation → Snacks → Biscuits
  // ============================
  biscuits: { category: "Biscuits", parent: "Snacks", root: "Alimentation" },
  cookie: { category: "Biscuits", parent: "Snacks", root: "Alimentation" },
  cookies: { category: "Biscuits", parent: "Snacks", root: "Alimentation" },
  kekse: { category: "Biscuits", parent: "Snacks", root: "Alimentation" }, // DE

  // ============================
  // 🍎 Alimentation → Frais → Fruits
  // ============================
  fruit: { category: "Fruits", parent: "Produits frais", root: "Alimentation" },
  fruits: { category: "Fruits", parent: "Produits frais", root: "Alimentation" },
  obst: { category: "Fruits", parent: "Produits frais", root: "Alimentation" }, // DE

  // ============================
  // 🥦 Alimentation → Frais → Légumes
  // ============================
  vegetable: { category: "Légumes", parent: "Produits frais", root: "Alimentation" },
  vegetables: { category: "Légumes", parent: "Produits frais", root: "Alimentation" },
  légume: { category: "Légumes", parent: "Produits frais", root: "Alimentation" },
  gemüse: { category: "Légumes", parent: "Produits frais", root: "Alimentation" }, // DE

  // ============================
  // 🥩 Alimentation → Frais → Viandes
  // ============================
  meat: { category: "Viandes", parent: "Produits frais", root: "Alimentation" },
  viande: { category: "Viandes", parent: "Produits frais", root: "Alimentation" },
  fleisch: { category: "Viandes", parent: "Produits frais", root: "Alimentation" }, // DE

  // ============================
  // 🧀 Alimentation → Frais → Fromages
  // ============================
  cheese: { category: "Fromages", parent: "Produits frais", root: "Alimentation" },
  fromage: { category: "Fromages", parent: "Produits frais", root: "Alimentation" },
  käse: { category: "Fromages", parent: "Produits frais", root: "Alimentation" }, // DE

  // ============================
  // 🥤 Alimentation → Boissons → Sodas
  // ============================
  soda: { category: "Sodas", parent: "Boissons", root: "Alimentation" },
  sodas: { category: "Sodas", parent: "Boissons", root: "Alimentation" },
  limonade: { category: "Sodas", parent: "Boissons", root: "Alimentation" },
  limonade_de: { category: "Sodas", parent: "Boissons", root: "Alimentation" }, // DE variation

  // ============================
  // 🍷 Alimentation → Boissons → Vins
  // ============================
  wine: { category: "Vins", parent: "Boissons", root: "Alimentation" },
  vin: { category: "Vins", parent: "Boissons", root: "Alimentation" },
  wein: { category: "Vins", parent: "Boissons", root: "Alimentation" }, // DE
};

export default food;
