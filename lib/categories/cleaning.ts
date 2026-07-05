// lib/categories/cleaning.ts

const cleaning = {
  // ============================
  // 🧽 Nettoyage → Sols → Balais
  // ============================
  broom: { category: "Balais", parent: "Sols", root: "Nettoyage" },
  floor_broom: { category: "Balais", parent: "Sols", root: "Nettoyage" },
  balai: { category: "Balais", parent: "Sols", root: "Nettoyage" },
  besen: { category: "Balais", parent: "Sols", root: "Nettoyage" }, // DE

  // ============================
  // 🧽 Nettoyage → Sols → Serpillières
  // ============================
  mop: { category: "Serpillières", parent: "Sols", root: "Nettoyage" },
  floor_mop: { category: "Serpillières", parent: "Sols", root: "Nettoyage" },
  serpillière: { category: "Serpillières", parent: "Sols", root: "Nettoyage" },
  wischmopp: { category: "Serpillières", parent: "Sols", root: "Nettoyage" }, // DE

  // ============================
  // 🧴 Nettoyage → Produits → Multi‑surfaces
  // ============================
  multisurface_cleaner: { category: "Nettoyants multi‑surfaces", parent: "Produits", root: "Nettoyage" },
  all_purpose_cleaner: { category: "Nettoyants multi‑surfaces", parent: "Produits", root: "Nettoyage" },
  nettoyant_multisurface: { category: "Nettoyants multi‑surfaces", parent: "Produits", root: "Nettoyage" },
  allzweckreiniger: { category: "Nettoyants multi‑surfaces", parent: "Produits", root: "Nettoyage" }, // DE

  // ============================
  // 🧴 Nettoyage → Produits → Vitres
  // ============================
  glass_cleaner: { category: "Nettoyants vitres", parent: "Produits", root: "Nettoyage" },
  window_cleaner: { category: "Nettoyants vitres", parent: "Produits", root: "Nettoyage" },
  nettoyant_vitre: { category: "Nettoyants vitres", parent: "Produits", root: "Nettoyage" },
  glasreiniger: { category: "Nettoyants vitres", parent: "Produits", root: "Nettoyage" }, // DE

  // ============================
  // 🧼 Nettoyage → Lessive → Détergents
  // ============================
  laundry_detergent: { category: "Détergents", parent: "Lessive", root: "Nettoyage" },
  detergent: { category: "Détergents", parent: "Lessive", root: "Nettoyage" },
  lessive: { category: "Détergents", parent: "Lessive", root: "Nettoyage" },
  waschmittel: { category: "Détergents", parent: "Lessive", root: "Nettoyage" }, // DE

  // ============================
  // 🧼 Nettoyage → Lessive → Assouplissants
  // ============================
  fabric_softener: { category: "Assouplissants", parent: "Lessive", root: "Nettoyage" },
  softener: { category: "Assouplissants", parent: "Lessive", root: "Nettoyage" },
  assouplissant: { category: "Assouplissants", parent: "Lessive", root: "Nettoyage" },
  weichspüler: { category: "Assouplissants", parent: "Lessive", root: "Nettoyage" }, // DE

  // ============================
  // 🧹 Nettoyage → Accessoires → Éponges
  // ============================
  sponge: { category: "Éponges", parent: "Accessoires", root: "Nettoyage" },
  cleaning_sponge: { category: "Éponges", parent: "Accessoires", root: "Nettoyage" },
  éponge: { category: "Éponges", parent: "Accessoires", root: "Nettoyage" },
  schwamm: { category: "Éponges", parent: "Accessoires", root: "Nettoyage" }, // DE

  // ============================
  // 🧹 Nettoyage → Accessoires → Gants
  // ============================
  cleaning_gloves: { category: "Gants de nettoyage", parent: "Accessoires", root: "Nettoyage" },
  gloves_cleaning: { category: "Gants de nettoyage", parent: "Accessoires", root: "Nettoyage" },
  gants_nettoyage: { category: "Gants de nettoyage", parent: "Accessoires", root: "Nettoyage" },
  reinigungshandschuhe: { category: "Gants de nettoyage", parent: "Accessoires", root: "Nettoyage" }, // DE
};

export default cleaning;
