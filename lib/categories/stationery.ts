// lib/categories/stationery.ts

const stationery = {
  // ============================
  // ✏️ Papeterie → Écriture → Stylos
  // ============================
  pen: { category: "Stylos", parent: "Écriture", root: "Papeterie" },
  pens: { category: "Stylos", parent: "Écriture", root: "Papeterie" },
  stylo: { category: "Stylos", parent: "Écriture", root: "Papeterie" },
  kugelschreiber: { category: "Stylos", parent: "Écriture", root: "Papeterie" }, // DE

  // ============================
  // ✏️ Papeterie → Écriture → Feutres / Marqueurs
  // ============================
  feutre: { category: "Feutres", parent: "Écriture", root: "Papeterie" },
  feutres: { category: "Feutres", parent: "Écriture", root: "Papeterie" },
  marqueur: { category: "Feutres", parent: "Écriture", root: "Papeterie" },
  marqueurs: { category: "Feutres", parent: "Écriture", root: "Papeterie" },
  marker: { category: "Feutres", parent: "Écriture", root: "Papeterie" },
  markers: { category: "Feutres", parent: "Écriture", root: "Papeterie" },
  "felt pen": { category: "Feutres", parent: "Écriture", root: "Papeterie" },
  "felt pens": { category: "Feutres", parent: "Écriture", root: "Papeterie" },
  highlighter: { category: "Feutres", parent: "Écriture", root: "Papeterie" },
  highlighters: { category: "Feutres", parent: "Écriture", root: "Papeterie" },
  surligneur: { category: "Feutres", parent: "Écriture", root: "Papeterie" },
  surligneurs: { category: "Feutres", parent: "Écriture", root: "Papeterie" },
  stabilo: { category: "Feutres", parent: "Écriture", root: "Papeterie" },
  "brush pen": { category: "Feutres", parent: "Écriture", root: "Papeterie" },
  "drawing pen": { category: "Feutres", parent: "Écriture", root: "Papeterie" },
  "writing tool": { category: "Feutres", parent: "Écriture", root: "Papeterie" },

  // ============================
  // ✏️ Papeterie → Écriture → Crayons
  // ============================
  pencil: { category: "Crayons", parent: "Écriture", root: "Papeterie" },
  pencils: { category: "Crayons", parent: "Écriture", root: "Papeterie" },
  crayon: { category: "Crayons", parent: "Écriture", root: "Papeterie" },
  bleistift: { category: "Crayons", parent: "Écriture", root: "Papeterie" }, // DE

  // ============================
  // 📒 Papeterie → Cahiers
  // ============================
  notebook: { category: "Cahiers", parent: "Fournitures", root: "Papeterie" },
  notepad: { category: "Cahiers", parent: "Fournitures", root: "Papeterie" },
  cahier: { category: "Cahiers", parent: "Fournitures", root: "Papeterie" },
  heft: { category: "Cahiers", parent: "Fournitures", root: "Papeterie" }, // DE

  // ============================
  // 📘 Papeterie → Classement → Dossiers
  // ============================
  folder: { category: "Dossiers", parent: "Classement", root: "Papeterie" },
  filefolder: { category: "Dossiers", parent: "Classement", root: "Papeterie" },
  dossier: { category: "Dossiers", parent: "Classement", root: "Papeterie" },
  ordner: { category: "Dossiers", parent: "Classement", root: "Papeterie" }, // DE

  // ============================
  // 📎 Papeterie → Classement → Agrafes
  // ============================
  stapler: { category: "Agrafes", parent: "Classement", root: "Papeterie" },
  agrafeuse: { category: "Agrafes", parent: "Classement", root: "Papeterie" },
  tacker: { category: "Agrafes", parent: "Classement", root: "Papeterie" }, // DE

  // ============================
  // 📏 Papeterie → Accessoires → Règles
  // ============================
  ruler: { category: "Règles", parent: "Accessoires", root: "Papeterie" },
  règle: { category: "Règles", parent: "Accessoires", root: "Papeterie" },
  lineal: { category: "Règles", parent: "Accessoires", root: "Papeterie" }, // DE

  // ============================
  // ✂️ Papeterie → Accessoires → Ciseaux
  // ============================
  scissors: { category: "Ciseaux", parent: "Accessoires", root: "Papeterie" },
  ciseaux: { category: "Ciseaux", parent: "Accessoires", root: "Papeterie" },
  schere: { category: "Ciseaux", parent: "Accessoires", root: "Papeterie" }, // DE
};

export default stationery;
