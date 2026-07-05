// lib/categories/videogames.ts

const videogames = {
  // ============================
  // 🎮 Jeux vidéo → Consoles → PlayStation
  // ============================
  playstation: { category: "PlayStation", parent: "Consoles", root: "Jeux vidéo" },
  ps4: { category: "PlayStation", parent: "Consoles", root: "Jeux vidéo" },
  ps5: { category: "PlayStation", parent: "Consoles", root: "Jeux vidéo" },
  playstation_de: { category: "PlayStation", parent: "Consoles", root: "Jeux vidéo" }, // DE variation

  // ============================
  // 🎮 Jeux vidéo → Consoles → Xbox
  // ============================
  xbox: { category: "Xbox", parent: "Consoles", root: "Jeux vidéo" },
  xboxone: { category: "Xbox", parent: "Consoles", root: "Jeux vidéo" },
  xboxseries: { category: "Xbox", parent: "Consoles", root: "Jeux vidéo" },
  xbox_de: { category: "Xbox", parent: "Consoles", root: "Jeux vidéo" }, // DE variation

  // ============================
  // 🎮 Jeux vidéo → Consoles → Nintendo
  // ============================
  nintendo: { category: "Nintendo", parent: "Consoles", root: "Jeux vidéo" },
  switch: { category: "Nintendo", parent: "Consoles", root: "Jeux vidéo" },
  wii: { category: "Nintendo", parent: "Consoles", root: "Jeux vidéo" },
  nintendo_de: { category: "Nintendo", parent: "Consoles", root: "Jeux vidéo" }, // DE variation

  // ============================
  // 🎮 Jeux vidéo → Jeux → PlayStation
  // ============================
  ps4_game: { category: "Jeux PlayStation", parent: "Jeux", root: "Jeux vidéo" },
  ps5_game: { category: "Jeux PlayStation", parent: "Jeux", root: "Jeux vidéo" },
  jeu_ps: { category: "Jeux PlayStation", parent: "Jeux", root: "Jeux vidéo" },
  playstation_spiel: { category: "Jeux PlayStation", parent: "Jeux", root: "Jeux vidéo" }, // DE

  // ============================
  // 🎮 Jeux vidéo → Jeux → Xbox
  // ============================
  xbox_game: { category: "Jeux Xbox", parent: "Jeux", root: "Jeux vidéo" },
  jeu_xbox: { category: "Jeux Xbox", parent: "Jeux", root: "Jeux vidéo" },
  xbox_spiel: { category: "Jeux Xbox", parent: "Jeux", root: "Jeux vidéo" }, // DE

  // ============================
  // 🎮 Jeux vidéo → Jeux → Nintendo
  // ============================
  switch_game: { category: "Jeux Nintendo", parent: "Jeux", root: "Jeux vidéo" },
  jeu_switch: { category: "Jeux Nintendo", parent: "Jeux", root: "Jeux vidéo" },
  nintendo_spiel: { category: "Jeux Nintendo", parent: "Jeux", root: "Jeux vidéo" }, // DE

  // ============================
  // 🎮 Jeux vidéo → Accessoires → Manettes
  // ============================
  controller: { category: "Manettes", parent: "Accessoires", root: "Jeux vidéo" },
  gamepad: { category: "Manettes", parent: "Accessoires", root: "Jeux vidéo" },
  manette: { category: "Manettes", parent: "Accessoires", root: "Jeux vidéo" },
  controller_de: { category: "Manettes", parent: "Accessoires", root: "Jeux vidéo" }, // DE variation

  // ============================
  // 🎮 Jeux vidéo → Accessoires → Casques gaming
  // ============================
  gaming_headset: { category: "Casques gaming", parent: "Accessoires", root: "Jeux vidéo" },
  casque_gaming: { category: "Casques gaming", parent: "Accessoires", root: "Jeux vidéo" },
  gaming_kopfhörer: { category: "Casques gaming", parent: "Accessoires", root: "Jeux vidéo" }, // DE

  // ============================
  // 🎮 Jeux vidéo → Accessoires → Claviers gaming
  // ============================
  gaming_keyboard: { category: "Claviers gaming", parent: "Accessoires", root: "Jeux vidéo" },
  clavier_gaming: { category: "Claviers gaming", parent: "Accessoires", root: "Jeux vidéo" },
  gaming_tastatur: { category: "Claviers gaming", parent: "Accessoires", root: "Jeux vidéo" }, // DE
};

export default videogames;
