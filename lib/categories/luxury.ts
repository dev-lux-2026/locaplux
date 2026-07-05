// lib/categories/luxury.ts

const luxury = {
  // ============================
  // 💎 Luxe → Montres → Haute horlogerie
  // ============================
  luxury_watch: { category: "Haute horlogerie", parent: "Montres", root: "Luxe" },
  high_end_watch: { category: "Haute horlogerie", parent: "Montres", root: "Luxe" },
  montre_luxe: { category: "Haute horlogerie", parent: "Montres", root: "Luxe" },
  luxusuhr: { category: "Haute horlogerie", parent: "Montres", root: "Luxe" }, // DE

  // ============================
  // 💎 Luxe → Bijoux → Or
  // ============================
  gold_jewelry: { category: "Bijoux en or", parent: "Bijoux", root: "Luxe" },
  gold_ring: { category: "Bijoux en or", parent: "Bijoux", root: "Luxe" },
  bijou_or: { category: "Bijoux en or", parent: "Bijoux", root: "Luxe" },
  goldschmuck: { category: "Bijoux en or", parent: "Bijoux", root: "Luxe" }, // DE

  // ============================
  // 💎 Luxe → Bijoux → Diamants
  // ============================
  diamond_jewelry: { category: "Bijoux en diamant", parent: "Bijoux", root: "Luxe" },
  diamond_ring: { category: "Bijoux en diamant", parent: "Bijoux", root: "Luxe" },
  bijou_diamant: { category: "Bijoux en diamant", parent: "Bijoux", root: "Luxe" },
  diamant_schmuck: { category: "Bijoux en diamant", parent: "Bijoux", root: "Luxe" }, // DE

  // ============================
  // 👜 Luxe → Maroquinerie → Sacs de créateurs
  // ============================
  designer_bag: { category: "Sacs de créateurs", parent: "Maroquinerie", root: "Luxe" },
  luxury_bag: { category: "Sacs de créateurs", parent: "Maroquinerie", root: "Luxe" },
  sac_createur: { category: "Sacs de créateurs", parent: "Maroquinerie", root: "Luxe" },
  designertasche: { category: "Sacs de créateurs", parent: "Maroquinerie", root: "Luxe" }, // DE

  // ============================
  // 👜 Luxe → Maroquinerie → Portefeuilles
  // ============================
  designer_wallet: { category: "Portefeuilles de luxe", parent: "Maroquinerie", root: "Luxe" },
  luxury_wallet: { category: "Portefeuilles de luxe", parent: "Maroquinerie", root: "Luxe" },
  portefeuille_luxe: { category: "Portefeuilles de luxe", parent: "Maroquinerie", root: "Luxe" },
  luxus_portemonnaie: { category: "Portefeuilles de luxe", parent: "Maroquinerie", root: "Luxe" }, // DE

  // ============================
  // 👗 Luxe → Mode → Haute couture
  // ============================
  haute_couture: { category: "Haute couture", parent: "Mode", root: "Luxe" },
  couture_dress: { category: "Haute couture", parent: "Mode", root: "Luxe" },
  robe_couture: { category: "Haute couture", parent: "Mode", root: "Luxe" },
  haute_couture_de: { category: "Haute couture", parent: "Mode", root: "Luxe" }, // DE variation

  // ============================
  // 👞 Luxe → Mode → Chaussures de créateurs
  // ============================
  designer_shoes: { category: "Chaussures de créateurs", parent: "Mode", root: "Luxe" },
  luxury_shoes: { category: "Chaussures de créateurs", parent: "Mode", root: "Luxe" },
  chaussures_createur: { category: "Chaussures de créateurs", parent: "Mode", root: "Luxe" },
  designerschuhe: { category: "Chaussures de créateurs", parent: "Mode", root: "Luxe" }, // DE
};

export default luxury;
