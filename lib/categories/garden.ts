// lib/categories/garden.ts

const garden = {
  // ============================
  // 🌿 Jardin → Outils → Outils à main
  // ============================
  shovel: { category: "Outils à main", parent: "Outils jardin", root: "Jardin" },
  spade: { category: "Outils à main", parent: "Outils jardin", root: "Jardin" },
  pelle: { category: "Outils à main", parent: "Outils jardin", root: "Jardin" },
  schaufel: { category: "Outils à main", parent: "Outils jardin", root: "Jardin" }, // DE

  rake: { category: "Outils à main", parent: "Outils jardin", root: "Jardin" },
  râteau: { category: "Outils à main", parent: "Outils jardin", root: "Jardin" },
  rechen: { category: "Outils à main", parent: "Outils jardin", root: "Jardin" }, // DE

  // ============================
  // 🌿 Jardin → Outils → Outils motorisés
  // ============================
  lawnmower: { category: "Outils motorisés", parent: "Outils jardin", root: "Jardin" },
  tondeuse: { category: "Outils motorisés", parent: "Outils jardin", root: "Jardin" },
  rasenmäher: { category: "Outils motorisés", parent: "Outils jardin", root: "Jardin" }, // DE

  chainsaw: { category: "Outils motorisés", parent: "Outils jardin", root: "Jardin" },
  tronçonneuse: { category: "Outils motorisés", parent: "Outils jardin", root: "Jardin" },
  kettensäge: { category: "Outils motorisés", parent: "Outils jardin", root: "Jardin" }, // DE

  // ============================
  // 🌱 Jardin → Plantes → Intérieur
  // ============================
  houseplant: { category: "Plantes d’intérieur", parent: "Plantes", root: "Jardin" },
  indoorplant: { category: "Plantes d’intérieur", parent: "Plantes", root: "Jardin" },
  plante_interieur: { category: "Plantes d’intérieur", parent: "Plantes", root: "Jardin" },
  zimmerpflanze: { category: "Plantes d’intérieur", parent: "Plantes", root: "Jardin" }, // DE

  // ============================
  // 🌱 Jardin → Plantes → Extérieur
  // ============================
  outdoorplant: { category: "Plantes d’extérieur", parent: "Plantes", root: "Jardin" },
  gardenplant: { category: "Plantes d’extérieur", parent: "Plantes", root: "Jardin" },
  plante_exterieur: { category: "Plantes d’extérieur", parent: "Plantes", root: "Jardin" },
  gartenpflanze: { category: "Plantes d’extérieur", parent: "Plantes", root: "Jardin" }, // DE

  // ============================
  // 💧 Jardin → Arrosage
  // ============================
  wateringcan: { category: "Arrosage", parent: "Arrosage", root: "Jardin" },
  arrosoir: { category: "Arrosage", parent: "Arrosage", root: "Jardin" },
  gießkanne: { category: "Arrosage", parent: "Arrosage", root: "Jardin" }, // DE

  hose: { category: "Arrosage", parent: "Arrosage", root: "Jardin" },
  tuyau: { category: "Arrosage", parent: "Arrosage", root: "Jardin" },
  schlauch: { category: "Arrosage", parent: "Arrosage", root: "Jardin" }, // DE

  // ============================
  // 🪑 Jardin → Mobilier extérieur
  // ============================
  gardenchair: { category: "Mobilier extérieur", parent: "Mobilier jardin", root: "Jardin" },
  garden_table: { category: "Mobilier extérieur", parent: "Mobilier jardin", root: "Jardin" },
  chaise_jardin: { category: "Mobilier extérieur", parent: "Mobilier jardin", root: "Jardin" },
  gartenstuhl: { category: "Mobilier extérieur", parent: "Mobilier jardin", root: "Jardin" }, // DE

  // ============================
  // 🔥 Jardin → Barbecue
  // ============================
  barbecue: { category: "Barbecue", parent: "Cuisine extérieure", root: "Jardin" },
  bbq: { category: "Barbecue", parent: "Cuisine extérieure", root: "Jardin" },
  grill: { category: "Barbecue", parent: "Cuisine extérieure", root: "Jardin" },
  grill_de: { category: "Barbecue", parent: "Cuisine extérieure", root: "Jardin" }, // DE variation
};

export default garden;
