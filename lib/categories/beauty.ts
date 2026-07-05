// lib/categories/beauty.ts

const beauty = {
  // ============================
  // 💄 Beauté → Maquillage → Lèvres
  // ============================
  lipstick: { category: "Maquillage lèvres", parent: "Maquillage", root: "Beauté" },
  lipgloss: { category: "Maquillage lèvres", parent: "Maquillage", root: "Beauté" },
  rouge_levres: { category: "Maquillage lèvres", parent: "Maquillage", root: "Beauté" },
  lippenstift: { category: "Maquillage lèvres", parent: "Maquillage", root: "Beauté" }, // DE

  // ============================
  // 💄 Beauté → Maquillage → Yeux
  // ============================
  mascara: { category: "Maquillage yeux", parent: "Maquillage", root: "Beauté" },
  eyeliner: { category: "Maquillage yeux", parent: "Maquillage", root: "Beauté" },
  eyeshadow: { category: "Maquillage yeux", parent: "Maquillage", root: "Beauté" },
  lidschatten: { category: "Maquillage yeux", parent: "Maquillage", root: "Beauté" }, // DE

  // ============================
  // 💄 Beauté → Maquillage → Teint
  // ============================
  foundation: { category: "Maquillage teint", parent: "Maquillage", root: "Beauté" },
  concealer: { category: "Maquillage teint", parent: "Maquillage", root: "Beauté" },
  poudre: { category: "Maquillage teint", parent: "Maquillage", root: "Beauté" },
  puder: { category: "Maquillage teint", parent: "Maquillage", root: "Beauté" }, // DE

  // ============================
  // 🧴 Beauté → Soins → Cheveux
  // ============================
  shampoo: { category: "Soins cheveux", parent: "Soins", root: "Beauté" },
  conditioner: { category: "Soins cheveux", parent: "Soins", root: "Beauté" },
  shampooing: { category: "Soins cheveux", parent: "Soins", root: "Beauté" },
  haarshampoo: { category: "Soins cheveux", parent: "Soins", root: "Beauté" }, // DE

  // ============================
  // 🧴 Beauté → Soins → Visage
  // ============================
  cream: { category: "Soins visage", parent: "Soins", root: "Beauté" },
  facecream: { category: "Soins visage", parent: "Soins", root: "Beauté" },
  crème_visage: { category: "Soins visage", parent: "Soins", root: "Beauté" },
  gesichtscreme: { category: "Soins visage", parent: "Soins", root: "Beauté" }, // DE

  // ============================
  // 🧴 Beauté → Soins → Corps
  // ============================
  bodylotion: { category: "Soins corps", parent: "Soins", root: "Beauté" },
  lotion: { category: "Soins corps", parent: "Soins", root: "Beauté" },
  crème_corps: { category: "Soins corps", parent: "Soins", root: "Beauté" },
  körperlotion: { category: "Soins corps", parent: "Soins", root: "Beauté" }, // DE

  // ============================
  // 🧼 Beauté → Hygiène → Parfums
  // ============================
  perfume: { category: "Parfums", parent: "Hygiène", root: "Beauté" },
  parfum: { category: "Parfums", parent: "Hygiène", root: "Beauté" },
  eau_de_toilette: { category: "Parfums", parent: "Hygiène", root: "Beauté" },
  parfüm: { category: "Parfums", parent: "Hygiène", root: "Beauté" }, // DE

  // ============================
  // 🧼 Beauté → Hygiène → Savons
  // ============================
  soap: { category: "Savons", parent: "Hygiène", root: "Beauté" },
  savon: { category: "Savons", parent: "Hygiène", root: "Beauté" },
  seife: { category: "Savons", parent: "Hygiène", root: "Beauté" }, // DE

  // ============================
  // 🪒 Beauté → Hygiène → Rasage
  // ============================
  razor: { category: "Rasage", parent: "Hygiène", root: "Beauté" },
  rasoir: { category: "Rasage", parent: "Hygiène", root: "Beauté" },
  rasiere: { category: "Rasage", parent: "Hygiène", root: "Beauté" }, // DE
  rasierschaum: { category: "Rasage", parent: "Hygiène", root: "Beauté" }, // DE mousse
};

export default beauty;
