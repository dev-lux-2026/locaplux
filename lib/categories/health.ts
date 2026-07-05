// lib/categories/health.ts

const health = {
  // ============================
  // 🩺 Santé → Premiers secours → Pansements
  // ============================
  bandage: { category: "Pansements", parent: "Premiers secours", root: "Santé" },
  bandages: { category: "Pansements", parent: "Premiers secours", root: "Santé" },
  pansement: { category: "Pansements", parent: "Premiers secours", root: "Santé" },
  verband: { category: "Pansements", parent: "Premiers secours", root: "Santé" }, // DE

  // ============================
  // 🩺 Santé → Premiers secours → Désinfectants
  // ============================
  disinfectant: { category: "Désinfectants", parent: "Premiers secours", root: "Santé" },
  antiseptic: { category: "Désinfectants", parent: "Premiers secours", root: "Santé" },
  désinfectant: { category: "Désinfectants", parent: "Premiers secours", root: "Santé" },
  desinfektion: { category: "Désinfectants", parent: "Premiers secours", root: "Santé" }, // DE

  // ============================
  // 💊 Santé → Médicaments → Douleurs
  // ============================
  painkiller: { category: "Antidouleurs", parent: "Médicaments", root: "Santé" },
  ibuprofen: { category: "Antidouleurs", parent: "Médicaments", root: "Santé" },
  paracetamol: { category: "Antidouleurs", parent: "Médicaments", root: "Santé" },
  schmerzmittel: { category: "Antidouleurs", parent: "Médicaments", root: "Santé" }, // DE

  // ============================
  // 💊 Santé → Médicaments → Allergies
  // ============================
  antihistamine: { category: "Allergies", parent: "Médicaments", root: "Santé" },
  allergy_med: { category: "Allergies", parent: "Médicaments", root: "Santé" },
  antiallergique: { category: "Allergies", parent: "Médicaments", root: "Santé" },
  antiallergikum: { category: "Allergies", parent: "Médicaments", root: "Santé" }, // DE

  // ============================
  // 🧘 Santé → Bien‑être → Compléments
  // ============================
  supplement: { category: "Compléments alimentaires", parent: "Bien‑être", root: "Santé" },
  supplements: { category: "Compléments alimentaires", parent: "Bien‑être", root: "Santé" },
  complément: { category: "Compléments alimentaires", parent: "Bien‑être", root: "Santé" },
  nahrungsergänzung: { category: "Compléments alimentaires", parent: "Bien‑être", root: "Santé" }, // DE

  // ============================
  // 🧘 Santé → Bien‑être → Huiles essentielles
  // ============================
  essential_oil: { category: "Huiles essentielles", parent: "Bien‑être", root: "Santé" },
  essential_oils: { category: "Huiles essentielles", parent: "Bien‑être", root: "Santé" },
  huile_essentielle: { category: "Huiles essentielles", parent: "Bien‑être", root: "Santé" },
  ätherisches_öl: { category: "Huiles essentielles", parent: "Bien‑être", root: "Santé" }, // DE

  // ============================
  // 🧘 Santé → Bien‑être → Massages
  // ============================
  massager: { category: "Appareils de massage", parent: "Bien‑être", root: "Santé" },
  massage_device: { category: "Appareils de massage", parent: "Bien‑être", root: "Santé" },
  appareil_massage: { category: "Appareils de massage", parent: "Bien‑être", root: "Santé" },
  massagegerät: { category: "Appareils de massage", parent: "Bien‑être", root: "Santé" }, // DE
};

export default health;
