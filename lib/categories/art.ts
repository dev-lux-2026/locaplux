// lib/categories/art.ts

const art = {
  // ============================
  // 🎨 Art → Peinture → Acrylique
  // ============================
  acrylic: { category: "Peinture acrylique", parent: "Peinture", root: "Art & Création" },
  acrylic_paint: { category: "Peinture acrylique", parent: "Peinture", root: "Art & Création" },
  peinture_acrylique: { category: "Peinture acrylique", parent: "Peinture", root: "Art & Création" },
  acrylfarbe: { category: "Peinture acrylique", parent: "Peinture", root: "Art & Création" }, // DE

  // ============================
  // 🎨 Art → Peinture → Aquarelle
  // ============================
  watercolor: { category: "Aquarelle", parent: "Peinture", root: "Art & Création" },
  watercolors: { category: "Aquarelle", parent: "Peinture", root: "Art & Création" },
  aquarelle: { category: "Aquarelle", parent: "Peinture", root: "Art & Création" },
  wasserfarbe: { category: "Aquarelle", parent: "Peinture", root: "Art & Création" }, // DE

  // ============================
  // 🎨 Art → Dessin → Crayons
  // ============================
  drawing_pencil: { category: "Crayons de dessin", parent: "Dessin", root: "Art & Création" },
  sketch_pencil: { category: "Crayons de dessin", parent: "Dessin", root: "Art & Création" },
  crayon_dessin: { category: "Crayons de dessin", parent: "Dessin", root: "Art & Création" },
  zeichnungsstift: { category: "Crayons de dessin", parent: "Dessin", root: "Art & Création" }, // DE

  // ============================
  // 🎨 Art → Dessin → Feutres
  // ============================
  marker: { category: "Feutres", parent: "Dessin", root: "Art & Création" },
  markers: { category: "Feutres", parent: "Dessin", root: "Art & Création" },
  feutre: { category: "Feutres", parent: "Dessin", root: "Art & Création" },
  filzstift: { category: "Feutres", parent: "Dessin", root: "Art & Création" }, // DE

  // ============================
  // 🖌 Art → Matériel → Pinceaux
  // ============================
  brush: { category: "Pinceaux", parent: "Matériel", root: "Art & Création" },
  brushes: { category: "Pinceaux", parent: "Matériel", root: "Art & Création" },
  pinceau: { category: "Pinceaux", parent: "Matériel", root: "Art & Création" },
  pinsel: { category: "Pinceaux", parent: "Matériel", root: "Art & Création" }, // DE

  // ============================
  // 🖌 Art → Matériel → Toiles
  // ============================
  canvas: { category: "Toiles", parent: "Matériel", root: "Art & Création" },
  painting_canvas: { category: "Toiles", parent: "Matériel", root: "Art & Création" },
  toile: { category: "Toiles", parent: "Matériel", root: "Art & Création" },
  leinwand: { category: "Toiles", parent: "Matériel", root: "Art & Création" }, // DE

  // ============================
  // ✂️ Art → Loisirs créatifs → Couture
  // ============================
  sewing: { category: "Couture", parent: "Loisirs créatifs", root: "Art & Création" },
  sewing_kit: { category: "Couture", parent: "Loisirs créatifs", root: "Art & Création" },
  couture: { category: "Couture", parent: "Loisirs créatifs", root: "Art & Création" },
  nähen: { category: "Couture", parent: "Loisirs créatifs", root: "Art & Création" }, // DE

  // ============================
  // ✂️ Art → Loisirs créatifs → Perles
  // ============================
  beads: { category: "Perles", parent: "Loisirs créatifs", root: "Art & Création" },
  bead_set: { category: "Perles", parent: "Loisirs créatifs", root: "Art & Création" },
  perles: { category: "Perles", parent: "Loisirs créatifs", root: "Art & Création" },
  perlen: { category: "Perles", parent: "Loisirs créatifs", root: "Art & Création" }, // DE
};

export default art;
