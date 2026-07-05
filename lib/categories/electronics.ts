// lib/categories/electronics.ts

const electronics = {
  // ============================
  // 📱 Smartphones
  // ============================
  smartphone: { category: "Smartphones", parent: "Téléphonie", root: "Électronique" },
  smartphones: { category: "Smartphones", parent: "Téléphonie", root: "Électronique" },
  phone: { category: "Smartphones", parent: "Téléphonie", root: "Électronique" },
  phones: { category: "Smartphones", parent: "Téléphonie", root: "Électronique" },
  handy: { category: "Smartphones", parent: "Téléphonie", root: "Électronique" }, // DE
  gsm: { category: "Smartphones", parent: "Téléphonie", root: "Électronique" },
  telefon: { category: "Smartphones", parent: "Téléphonie", root: "Électronique" }, // DE
  telefonen: { category: "Smartphones", parent: "Téléphonie", root: "Électronique" }, // LU

  // ============================
  // 📱 Accessoires téléphone
  // ============================
  case: { category: "Accessoires téléphone", parent: "Téléphonie", root: "Électronique" },
  phonecase: { category: "Accessoires téléphone", parent: "Téléphonie", root: "Électronique" },
  coque: { category: "Accessoires téléphone", parent: "Téléphonie", root: "Électronique" },
  schutzhuelle: { category: "Accessoires téléphone", parent: "Téléphonie", root: "Électronique" }, // DE
  ladekabel: { category: "Accessoires téléphone", parent: "Téléphonie", root: "Électronique" }, // DE
  charger: { category: "Accessoires téléphone", parent: "Téléphonie", root: "Électronique" },
  chargeur: { category: "Accessoires téléphone", parent: "Téléphonie", root: "Électronique" },
  opluedkabel: { category: "Accessoires téléphone", parent: "Téléphonie", root: "Électronique" }, // LU

  // ============================
  // 🎧 Audio → Casques
  // ============================
  headphones: { category: "Casques audio", parent: "Audio", root: "Électronique" },
  headset: { category: "Casques audio", parent: "Audio", root: "Électronique" },
  casque: { category: "Casques audio", parent: "Audio", root: "Électronique" },
  kopfhörer: { category: "Casques audio", parent: "Audio", root: "Électronique" }, // DE
  kopfhorer: { category: "Casques audio", parent: "Audio", root: "Électronique" }, // DE sans accents
  kopfhörerinnen: { category: "Casques audio", parent: "Audio", root: "Électronique" }, // DE
  kopfhörerlu: { category: "Casques audio", parent: "Audio", root: "Électronique" }, // LU variation

  // ============================
  // 🎧 Audio → Écouteurs
  // ============================
  earbuds: { category: "Écouteurs", parent: "Audio", root: "Électronique" },
  earphones: { category: "Écouteurs", parent: "Audio", root: "Électronique" },
  écouteurs: { category: "Écouteurs", parent: "Audio", root: "Électronique" },
  ohrhörer: { category: "Écouteurs", parent: "Audio", root: "Électronique" }, // DE
  ohrhorer: { category: "Écouteurs", parent: "Audio", root: "Électronique" }, // DE sans accents

  // ============================
  // 🔊 Audio → Enceintes
  // ============================
  speaker: { category: "Enceintes", parent: "Audio", root: "Électronique" },
  speakers: { category: "Enceintes", parent: "Audio", root: "Électronique" },
  enceinte: { category: "Enceintes", parent: "Audio", root: "Électronique" },
  lautsprecher: { category: "Enceintes", parent: "Audio", root: "Électronique" }, // DE

  // ============================
  // 💻 Informatique → Ordinateurs portables
  // ============================
  laptop: { category: "Ordinateurs portables", parent: "Informatique", root: "Électronique" },
  laptops: { category: "Ordinateurs portables", parent: "Informatique", root: "Électronique" },
  notebook: { category: "Ordinateurs portables", parent: "Informatique", root: "Électronique" },
  computer: { category: "Ordinateurs portables", parent: "Informatique", root: "Électronique" },
  pc: { category: "Ordinateurs portables", parent: "Informatique", root: "Électronique" },
  rechner: { category: "Ordinateurs portables", parent: "Informatique", root: "Électronique" }, // DE

  // ============================
  // 🖱 Informatique → Souris
  // ============================
  mouse: { category: "Souris", parent: "Informatique", root: "Électronique" },
  maus: { category: "Souris", parent: "Informatique", root: "Électronique" }, // DE
  souris: { category: "Souris", parent: "Informatique", root: "Électronique" },

  // ============================
  // ⌨️ Informatique → Claviers
  // ============================
  keyboard: { category: "Claviers", parent: "Informatique", root: "Électronique" },
  tastatur: { category: "Claviers", parent: "Informatique", root: "Électronique" }, // DE
  clavier: { category: "Claviers", parent: "Informatique", root: "Électronique" },

  // ============================
  // 🖥 Informatique → Écrans
  // ============================
  monitor: { category: "Écrans", parent: "Informatique", root: "Électronique" },
  screen: { category: "Écrans", parent: "Informatique", root: "Électronique" },
  bildschirm: { category: "Écrans", parent: "Informatique", root: "Électronique" }, // DE
  écran: { category: "Écrans", parent: "Informatique", root: "Électronique" },

  // ============================
  // 📺 TV & Vidéo → Télévisions
  // ============================
  tv: { category: "Télévisions", parent: "TV & Vidéo", root: "Électronique" },
  television: { category: "Télévisions", parent: "TV & Vidéo", root: "Électronique" },
  fernseher: { category: "Télévisions", parent: "TV & Vidéo", root: "Électronique" }, // DE

  // ============================
  // 📽 TV & Vidéo → Projecteurs
  // ============================
  projector: { category: "Projecteurs", parent: "TV & Vidéo", root: "Électronique" },
  beamer: { category: "Projecteurs", parent: "TV & Vidéo", root: "Électronique" }, // DE

  // ============================
  // 🎮 Consoles
  // ============================
  console: { category: "Consoles", parent: "Jeux vidéo", root: "Électronique" },
  playstation: { category: "Consoles", parent: "Jeux vidéo", root: "Électronique" },
  xbox: { category: "Consoles", parent: "Jeux vidéo", root: "Électronique" },
  nintendo: { category: "Consoles", parent: "Jeux vidéo", root: "Électronique" },

  // ============================
  // 📸 Photo → Appareils photo
  // ============================
  camera: { category: "Appareils photo", parent: "Photo", root: "Électronique" },
  fotoapparat: { category: "Appareils photo", parent: "Photo", root: "Électronique" }, // DE
  appareilphoto: { category: "Appareils photo", parent: "Photo", root: "Électronique" },

  // ============================
  // 📸 Photo → Objectifs
  // ============================
  lens: { category: "Objectifs", parent: "Photo", root: "Électronique" },
  objektiv: { category: "Objectifs", parent: "Photo", root: "Électronique" }, // DE
  objectif: { category: "Objectifs", parent: "Photo", root: "Électronique" },
};

export default electronics;
