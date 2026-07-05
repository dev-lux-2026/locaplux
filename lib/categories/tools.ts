// lib/categories/tools.ts

const tools = {
  // ============================
  // 🔧 Outils → Main → Marteaux
  // ============================
  hammer: { category: "Marteaux", parent: "Outils à main", root: "Outils & Bricolage" },
  marteau: { category: "Marteaux", parent: "Outils à main", root: "Outils & Bricolage" },
  hammer_de: { category: "Marteaux", parent: "Outils à main", root: "Outils & Bricolage" }, // DE variation
  hammer_lu: { category: "Marteaux", parent: "Outils à main", root: "Outils & Bricolage" }, // LU variation

  // ============================
  // 🔧 Outils → Main → Tournevis
  // ============================
  screwdriver: { category: "Tournevis", parent: "Outils à main", root: "Outils & Bricolage" },
  tournevis: { category: "Tournevis", parent: "Outils à main", root: "Outils & Bricolage" },
  schraubenzieher: { category: "Tournevis", parent: "Outils à main", root: "Outils & Bricolage" }, // DE

  // ============================
  // 🔧 Outils → Main → Clés
  // ============================
  wrench: { category: "Clés", parent: "Outils à main", root: "Outils & Bricolage" },
  keytool: { category: "Clés", parent: "Outils à main", root: "Outils & Bricolage" },
  clé: { category: "Clés", parent: "Outils à main", root: "Outils & Bricolage" },
  schlüssel: { category: "Clés", parent: "Outils à main", root: "Outils & Bricolage" }, // DE

  // ============================
  // 🔧 Outils → Main → Pinces
  // ============================
  pliers: { category: "Pinces", parent: "Outils à main", root: "Outils & Bricolage" },
  pince: { category: "Pinces", parent: "Outils à main", root: "Outils & Bricolage" },
  zange: { category: "Pinces", parent: "Outils à main", root: "Outils & Bricolage" }, // DE

  // ============================
  // 🔌 Outils → Électroportatif → Perceuses
  // ============================
  drill: { category: "Perceuses", parent: "Électroportatif", root: "Outils & Bricolage" },
  perceuse: { category: "Perceuses", parent: "Électroportatif", root: "Outils & Bricolage" },
  bohrmaschine: { category: "Perceuses", parent: "Électroportatif", root: "Outils & Bricolage" }, // DE

  // ============================
  // 🔌 Outils → Électroportatif → Visseuses
  // ============================
  screwdriver_electric: { category: "Visseuses", parent: "Électroportatif", root: "Outils & Bricolage" },
  visseuse: { category: "Visseuses", parent: "Électroportatif", root: "Outils & Bricolage" },
  akkuschrauber: { category: "Visseuses", parent: "Électroportatif", root: "Outils & Bricolage" }, // DE

  // ============================
  // 🔌 Outils → Électroportatif → Scies
  // ============================
  saw: { category: "Scies", parent: "Électroportatif", root: "Outils & Bricolage" },
  electric_saw: { category: "Scies", parent: "Électroportatif", root: "Outils & Bricolage" },
  säge: { category: "Scies", parent: "Électroportatif", root: "Outils & Bricolage" }, // DE

  // ============================
  // 📏 Outils → Mesure → Mètres
  // ============================
  measuring_tape: { category: "Mètres", parent: "Mesure", root: "Outils & Bricolage" },
  tape_measure: { category: "Mètres", parent: "Mesure", root: "Outils & Bricolage" },
  mètre: { category: "Mètres", parent: "Mesure", root: "Outils & Bricolage" },
  maßband: { category: "Mètres", parent: "Mesure", root: "Outils & Bricolage" }, // DE

  // ============================
  // 📏 Outils → Mesure → Niveau
  // ============================
  level: { category: "Niveaux", parent: "Mesure", root: "Outils & Bricolage" },
  spirit_level: { category: "Niveaux", parent: "Mesure", root: "Outils & Bricolage" },
  niveau: { category: "Niveaux", parent: "Mesure", root: "Outils & Bricolage" },
  wasserwaage: { category: "Niveaux", parent: "Mesure", root: "Outils & Bricolage" }, // DE
};

export default tools;
