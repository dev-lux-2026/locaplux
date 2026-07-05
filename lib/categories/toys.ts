// lib/categories/toys.ts

const toys = {
  // ============================
  // 🧸 Jouets → Bébé → Peluches
  // ============================
  plush: { category: "Peluches", parent: "Bébé", root: "Jouets" },
  plushie: { category: "Peluches", parent: "Bébé", root: "Jouets" },
  teddy: { category: "Peluches", parent: "Bébé", root: "Jouets" },
  peluche: { category: "Peluches", parent: "Bébé", root: "Jouets" },
  kuscheltier: { category: "Peluches", parent: "Bébé", root: "Jouets" }, // DE

  // ============================
  // 🍼 Jouets → Bébé → Jouets d’éveil
  // ============================
  rattle: { category: "Jouets d’éveil", parent: "Bébé", root: "Jouets" },
  hochet: { category: "Jouets d’éveil", parent: "Bébé", root: "Jouets" },
  greifling: { category: "Jouets d’éveil", parent: "Bébé", root: "Jouets" }, // DE

  // ============================
  // 🎲 Jouets → Jeux éducatifs
  // ============================
  puzzle: { category: "Jeux éducatifs", parent: "Jeux éducatifs", root: "Jouets" },
  puzzles: { category: "Jeux éducatifs", parent: "Jeux éducatifs", root: "Jouets" },
  éducatif: { category: "Jeux éducatifs", parent: "Jeux éducatifs", root: "Jouets" },
  lernspiel: { category: "Jeux éducatifs", parent: "Jeux éducatifs", root: "Jouets" }, // DE

  // ============================
  // 🧩 Jouets → Jeux de société
  // ============================
  boardgame: { category: "Jeux de société", parent: "Jeux éducatifs", root: "Jouets" },
  boardgames: { category: "Jeux de société", parent: "Jeux éducatifs", root: "Jouets" },
  jeu_societe: { category: "Jeux de société", parent: "Jeux éducatifs", root: "Jouets" },
  brettspiel: { category: "Jeux de société", parent: "Jeux éducatifs", root: "Jouets" }, // DE

  // ============================
  // 🚗 Jouets → Véhicules jouets
  // ============================
  toycar: { category: "Véhicules jouets", parent: "Véhicules jouets", root: "Jouets" },
  toy_car: { category: "Véhicules jouets", parent: "Véhicules jouets", root: "Jouets" },
  voiture_jouet: { category: "Véhicules jouets", parent: "Véhicules jouets", root: "Jouets" },
  spielzeugauto: { category: "Véhicules jouets", parent: "Véhicules jouets", root: "Jouets" }, // DE

  // ============================
  // 🦸 Jouets → Figurines
  // ============================
  figurine: { category: "Figurines", parent: "Figurines", root: "Jouets" },
  figurines: { category: "Figurines", parent: "Figurines", root: "Jouets" },
  actionfigure: { category: "Figurines", parent: "Figurines", root: "Jouets" },
  spielfigur: { category: "Figurines", parent: "Figurines", root: "Jouets" }, // DE

  // ============================
  // 🧱 Jouets → Jeux de construction
  // ============================
  lego: { category: "Jeux de construction", parent: "Jeux éducatifs", root: "Jouets" },
  duplo: { category: "Jeux de construction", parent: "Jeux éducatifs", root: "Jouets" },
  blocks: { category: "Jeux de construction", parent: "Jeux éducatifs", root: "Jouets" },
  bausteine: { category: "Jeux de construction", parent: "Jeux éducatifs", root: "Jouets" }, // DE
};

export default toys;
