// lib/categories/fashion.ts

const fashion = {
  // ============================
  // 👕 Vêtements → Homme → Hauts
  // ============================
  tshirt: { category: "Hauts homme", parent: "Homme", root: "Vêtements" },
  t_shirt: { category: "Hauts homme", parent: "Homme", root: "Vêtements" },
  shirt: { category: "Hauts homme", parent: "Homme", root: "Vêtements" },
  chemise: { category: "Hauts homme", parent: "Homme", root: "Vêtements" },
  hemd: { category: "Hauts homme", parent: "Homme", root: "Vêtements" }, // DE

  // ============================
  // 👖 Vêtements → Homme → Bas
  // ============================
  pants: { category: "Bas homme", parent: "Homme", root: "Vêtements" },
  trousers: { category: "Bas homme", parent: "Homme", root: "Vêtements" },
  jeans: { category: "Bas homme", parent: "Homme", root: "Vêtements" },
  pantalon: { category: "Bas homme", parent: "Homme", root: "Vêtements" },
  hose: { category: "Bas homme", parent: "Homme", root: "Vêtements" }, // DE

  // ============================
  // 👗 Vêtements → Femme → Robes
  // ============================
  dress: { category: "Robes", parent: "Femme", root: "Vêtements" },
  dresses: { category: "Robes", parent: "Femme", root: "Vêtements" },
  robe: { category: "Robes", parent: "Femme", root: "Vêtements" },
  kleid: { category: "Robes", parent: "Femme", root: "Vêtements" }, // DE

  // ============================
  // 👚 Vêtements → Femme → Hauts
  // ============================
  blouse: { category: "Hauts femme", parent: "Femme", root: "Vêtements" },
  top: { category: "Hauts femme", parent: "Femme", root: "Vêtements" },
  haut: { category: "Hauts femme", parent: "Femme", root: "Vêtements" },
  bluse: { category: "Hauts femme", parent: "Femme", root: "Vêtements" }, // DE

  // ============================
  // 👖 Vêtements → Femme → Bas
  // ============================
  skirt: { category: "Bas femme", parent: "Femme", root: "Vêtements" },
  jupe: { category: "Bas femme", parent: "Femme", root: "Vêtements" },
  leggings: { category: "Bas femme", parent: "Femme", root: "Vêtements" },
  rock: { category: "Bas femme", parent: "Femme", root: "Vêtements" }, // DE

  // ============================
  // 🧒 Vêtements → Enfant → Hauts
  // ============================
  kidshirt: { category: "Hauts enfant", parent: "Enfant", root: "Vêtements" },
  enfant_haut: { category: "Hauts enfant", parent: "Enfant", root: "Vêtements" },
  kinderhemd: { category: "Hauts enfant", parent: "Enfant", root: "Vêtements" }, // DE

  // ============================
  // 🧒 Vêtements → Enfant → Bas
  // ============================
  kidpants: { category: "Bas enfant", parent: "Enfant", root: "Vêtements" },
  enfant_bas: { category: "Bas enfant", parent: "Enfant", root: "Vêtements" },
  kinderhose: { category: "Bas enfant", parent: "Enfant", root: "Vêtements" }, // DE

  // ============================
  // 👟 Chaussures → Homme
  // ============================
  sneakers: { category: "Chaussures homme", parent: "Chaussures", root: "Vêtements" },
  shoes: { category: "Chaussures homme", parent: "Chaussures", root: "Vêtements" },
  schuhe: { category: "Chaussures homme", parent: "Chaussures", root: "Vêtements" }, // DE
  baskets: { category: "Chaussures homme", parent: "Chaussures", root: "Vêtements" },

  // ============================
  // 👠 Chaussures → Femme
  // ============================
  heels: { category: "Chaussures femme", parent: "Chaussures", root: "Vêtements" },
  talons: { category: "Chaussures femme", parent: "Chaussures", root: "Vêtements" },
  pumps: { category: "Chaussures femme", parent: "Chaussures", root: "Vêtements" },
  damenschuhe: { category: "Chaussures femme", parent: "Chaussures", root: "Vêtements" }, // DE

  // ============================
  // 🧢 Accessoires → Casquettes
  // ============================
  cap: { category: "Casquettes", parent: "Accessoires", root: "Vêtements" },
  caps: { category: "Casquettes", parent: "Accessoires", root: "Vêtements" },
  casquette: { category: "Casquettes", parent: "Accessoires", root: "Vêtements" },
  mütze: { category: "Casquettes", parent: "Accessoires", root: "Vêtements" }, // DE

  // ============================
  // 👜 Accessoires → Sacs
  // ============================
  bag: { category: "Sacs", parent: "Accessoires", root: "Vêtements" },
  handbag: { category: "Sacs", parent: "Accessoires", root: "Vêtements" },
  sac: { category: "Sacs", parent: "Accessoires", root: "Vêtements" },
  tasche: { category: "Sacs", parent: "Accessoires", root: "Vêtements" }, // DE
};

export default fashion;
