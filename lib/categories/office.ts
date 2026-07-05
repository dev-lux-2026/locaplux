// lib/categories/office.ts

const office = {
  // ============================
  // 🖨 Bureau → Matériel → Imprimantes
  // ============================
  printer: { category: "Imprimantes", parent: "Matériel", root: "Bureau" },
  printers: { category: "Imprimantes", parent: "Matériel", root: "Bureau" },
  imprimante: { category: "Imprimantes", parent: "Matériel", root: "Bureau" },
  drucker: { category: "Imprimantes", parent: "Matériel", root: "Bureau" }, // DE

  // ============================
  // 🖨 Bureau → Matériel → Scanners
  // ============================
  scanner: { category: "Scanners", parent: "Matériel", root: "Bureau" },
  scan: { category: "Scanners", parent: "Matériel", root: "Bureau" },
  scanneur: { category: "Scanners", parent: "Matériel", root: "Bureau" },
  scanner_de: { category: "Scanners", parent: "Matériel", root: "Bureau" }, // DE variation

  // ============================
  // 💺 Bureau → Mobilier → Chaises
  // ============================
  office_chair: { category: "Chaises de bureau", parent: "Mobilier", root: "Bureau" },
  desk_chair: { category: "Chaises de bureau", parent: "Mobilier", root: "Bureau" },
  chaise_bureau: { category: "Chaises de bureau", parent: "Mobilier", root: "Bureau" },
  bürostuhl: { category: "Chaises de bureau", parent: "Mobilier", root: "Bureau" }, // DE

  // ============================
  // 💺 Bureau → Mobilier → Bureaux
  // ============================
  office_desk: { category: "Bureaux", parent: "Mobilier", root: "Bureau" },
  desk: { category: "Bureaux", parent: "Mobilier", root: "Bureau" },
  bureau: { category: "Bureaux", parent: "Mobilier", root: "Bureau" },
  schreibtisch: { category: "Bureaux", parent: "Mobilier", root: "Bureau" }, // DE

  // ============================
  // 🗄 Bureau → Rangement → Armoires
  // ============================
  cabinet: { category: "Armoires de rangement", parent: "Rangement", root: "Bureau" },
  storage_cabinet: { category: "Armoires de rangement", parent: "Rangement", root: "Bureau" },
  armoire_bureau: { category: "Armoires de rangement", parent: "Rangement", root: "Bureau" },
  aktenschrank: { category: "Armoires de rangement", parent: "Rangement", root: "Bureau" }, // DE

  // ============================
  // 🗄 Bureau → Rangement → Tiroirs
  // ============================
  drawer_unit: { category: "Caissons / Tiroirs", parent: "Rangement", root: "Bureau" },
  drawers: { category: "Caissons / Tiroirs", parent: "Rangement", root: "Bureau" },
  caisson: { category: "Caissons / Tiroirs", parent: "Rangement", root: "Bureau" },
  schubladen: { category: "Caissons / Tiroirs", parent: "Rangement", root: "Bureau" }, // DE

  // ============================
  // 🖥 Bureau → Informatique → Écrans
  // ============================
  monitor: { category: "Écrans", parent: "Informatique", root: "Bureau" },
  screen: { category: "Écrans", parent: "Informatique", root: "Bureau" },
  écran: { category: "Écrans", parent: "Informatique", root: "Bureau" },
  bildschirm: { category: "Écrans", parent: "Informatique", root: "Bureau" }, // DE

  // ============================
  // 🖥 Bureau → Informatique → Claviers
  // ============================
  keyboard: { category: "Claviers", parent: "Informatique", root: "Bureau" },
  clavier: { category: "Claviers", parent: "Informatique", root: "Bureau" },
  tastatur: { category: "Claviers", parent: "Informatique", root: "Bureau" }, // DE

  // ============================
  // 🖥 Bureau → Informatique → Souris
  // ============================
  mouse: { category: "Souris", parent: "Informatique", root: "Bureau" },
  souris: { category: "Souris", parent: "Informatique", root: "Bureau" },
  maus: { category: "Souris", parent: "Informatique", root: "Bureau" }, // DE
};

export default office;
