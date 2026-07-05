// lib/categories/vehicles.ts

const vehicles = {
  // ============================
  // 🚗 Véhicules → Voitures
  // ============================
  car: { category: "Voitures", parent: "Véhicules", root: "Transport" },
  cars: { category: "Voitures", parent: "Véhicules", root: "Transport" },
  auto: { category: "Voitures", parent: "Véhicules", root: "Transport" },
  voiture: { category: "Voitures", parent: "Véhicules", root: "Transport" },
  wagen: { category: "Voitures", parent: "Véhicules", root: "Transport" }, // DE
  autos: { category: "Voitures", parent: "Véhicules", root: "Transport" },
  autoen: { category: "Voitures", parent: "Véhicules", root: "Transport" }, // LU variation

  // ============================
  // 🏍 Véhicules → Motos
  // ============================
  motorcycle: { category: "Motos", parent: "Véhicules", root: "Transport" },
  motorbike: { category: "Motos", parent: "Véhicules", root: "Transport" },
  moto: { category: "Motos", parent: "Véhicules", root: "Transport" },
  motos: { category: "Motos", parent: "Véhicules", root: "Transport" },
  motorrad: { category: "Motos", parent: "Véhicules", root: "Transport" }, // DE
  motorräder: { category: "Motos", parent: "Véhicules", root: "Transport" }, // DE
  motoen: { category: "Motos", parent: "Véhicules", root: "Transport" }, // LU

  // ============================
  // 🚲 Véhicules → Vélos
  // ============================
  bike: { category: "Vélos", parent: "Véhicules", root: "Transport" },
  bicycle: { category: "Vélos", parent: "Véhicules", root: "Transport" },
  vélo: { category: "Vélos", parent: "Véhicules", root: "Transport" },
  vélos: { category: "Vélos", parent: "Véhicules", root: "Transport" },
  velo: { category: "Vélos", parent: "Véhicules", root: "Transport" },
  vëlo: { category: "Vélos", parent: "Véhicules", root: "Transport" }, // LU
  fahrrad: { category: "Vélos", parent: "Véhicules", root: "Transport" }, // DE
  räder: { category: "Vélos", parent: "Véhicules", root: "Transport" }, // DE

  // ============================
  // 🛴 Véhicules → Trottinettes
  // ============================
  scooter: { category: "Trottinettes", parent: "Véhicules", root: "Transport" },
  e_scooter: { category: "Trottinettes", parent: "Véhicules", root: "Transport" },
  trottinette: { category: "Trottinettes", parent: "Véhicules", root: "Transport" },
  roller: { category: "Trottinettes", parent: "Véhicules", root: "Transport" }, // DE/LU usage
  tretroller: { category: "Trottinettes", parent: "Véhicules", root: "Transport" }, // DE

  // ============================
  // 🛞 Véhicules → Pièces détachées
  // ============================
  tire: { category: "Pièces détachées", parent: "Véhicules", root: "Transport" },
  tyres: { category: "Pièces détachées", parent: "Véhicules", root: "Transport" },
  pneu: { category: "Pièces détachées", parent: "Véhicules", root: "Transport" },
  pneus: { category: "Pièces détachées", parent: "Véhicules", root: "Transport" },
  reifen: { category: "Pièces détachées", parent: "Véhicules", root: "Transport" }, // DE

  // ============================
  // 🧰 Véhicules → Accessoires
  // ============================
  helmet: { category: "Accessoires véhicules", parent: "Véhicules", root: "Transport" },
  helm: { category: "Accessoires véhicules", parent: "Véhicules", root: "Transport" }, // DE
  casque_moto: { category: "Accessoires véhicules", parent: "Véhicules", root: "Transport" },
  gps: { category: "Accessoires véhicules", parent: "Véhicules", root: "Transport" },
  dashcam: { category: "Accessoires véhicules", parent: "Véhicules", root: "Transport" },
  dachbox: { category: "Accessoires véhicules", parent: "Véhicules", root: "Transport" }, // DE coffre de toit
};

export default vehicles;
