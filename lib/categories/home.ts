// lib/categories/home.ts

const home = {
  // ============================
  // 🪑 Maison → Meubles → Sièges
  // ============================
  chair: { category: "Meubles", parent: "Maison", root: "Maison" },
  chairs: { category: "Meubles", parent: "Maison", root: "Maison" },
  chaise: { category: "Meubles", parent: "Maison", root: "Maison" },
  chaises: { category: "Meubles", parent: "Maison", root: "Maison" },
  stull: { category: "Meubles", parent: "Maison", root: "Maison" },
  stuhl: { category: "Meubles", parent: "Maison", root: "Maison" },
  sitz: { category: "Meubles", parent: "Maison", root: "Maison" },
  seat: { category: "Meubles", parent: "Maison", root: "Maison" },

  // ============================
  // 🛋 Maison → Meubles → Canapés
  // ============================
  sofa: { category: "Meubles", parent: "Maison", root: "Maison" },
  couch: { category: "Meubles", parent: "Maison", root: "Maison" },
  canapé: { category: "Meubles", parent: "Maison", root: "Maison" },
  kanapee: { category: "Meubles", parent: "Maison", root: "Maison" },
  sofa_de: { category: "Meubles", parent: "Maison", root: "Maison" },
  loveseat: { category: "Meubles", parent: "Maison", root: "Maison" },

  // ============================
  // 🛏 Maison → Literie → Lits
  // ============================
  bed: { category: "Literie", parent: "Maison", root: "Maison" },
  beds: { category: "Literie", parent: "Maison", root: "Maison" },
  lit: { category: "Literie", parent: "Maison", root: "Maison" },
  better: { category: "Literie", parent: "Maison", root: "Maison" },
  bett: { category: "Literie", parent: "Maison", root: "Maison" },
  "single bed": { category: "Literie", parent: "Maison", root: "Maison" },
  "double bed": { category: "Literie", parent: "Maison", root: "Maison" },
  "queen bed": { category: "Literie", parent: "Maison", root: "Maison" },
  "king bed": { category: "Literie", parent: "Maison", root: "Maison" },

  // ============================
  // 🛏 Maison → Literie → Matelas
  // ============================
  mattress: { category: "Matelas", parent: "Literie", root: "Maison" },
  mattresses: { category: "Matelas", parent: "Literie", root: "Maison" },
  matelas: { category: "Matelas", parent: "Literie", root: "Maison" },
  "memory foam": { category: "Matelas", parent: "Literie", root: "Maison" },
  "foam mattress": { category: "Matelas", parent: "Literie", root: "Maison" },

  // ============================
  // 🛏 Maison → Literie → Sommier / Boxspring
  // ============================
  sommier: { category: "Literie", parent: "Maison", root: "Maison" },
  boxspring: { category: "Literie", parent: "Maison", root: "Maison" },
  "box spring": { category: "Literie", parent: "Maison", root: "Maison" },
  "bed base": { category: "Literie", parent: "Maison", root: "Maison" },

  // ============================
  // 🛏 Maison → Literie → Cadres de lit
  // ============================
  "bed frame": { category: "Literie", parent: "Maison", root: "Maison" },
  cadre: { category: "Literie", parent: "Maison", root: "Maison" },
  "cadre de lit": { category: "Literie", parent: "Maison", root: "Maison" },
  "metal frame": { category: "Literie", parent: "Maison", root: "Maison" },

  // ============================
  // 🛏 Maison → Literie → Têtes de lit
  // ============================
  headboard: { category: "Literie", parent: "Maison", root: "Maison" },
  "tête de lit": { category: "Literie", parent: "Maison", root: "Maison" },

  // ============================
  // 🛏 Maison → Literie → Oreillers / Couettes
  // ============================
  pillow: { category: "Literie", parent: "Maison", root: "Maison" },
  pillows: { category: "Literie", parent: "Maison", root: "Maison" },
  oreiller: { category: "Literie", parent: "Maison", root: "Maison" },

  duvet: { category: "Literie", parent: "Maison", root: "Maison" },
  couette: { category: "Literie", parent: "Maison", root: "Maison" },
  quilt: { category: "Literie", parent: "Maison", root: "Maison" },
  comforter: { category: "Literie", parent: "Maison", root: "Maison" },

  bedding: { category: "Literie", parent: "Maison", root: "Maison" },
  bedroom: { category: "Literie", parent: "Maison", root: "Maison" },

  // ============================
  // 🗄 Maison → Meubles → Rangement
  // ============================
  shelf: { category: "Meubles", parent: "Maison", root: "Maison" },
  shelves: { category: "Meubles", parent: "Maison", root: "Maison" },
  étagère: { category: "Meubles", parent: "Maison", root: "Maison" },
  etagere: { category: "Meubles", parent: "Maison", root: "Maison" },
  regal: { category: "Meubles", parent: "Maison", root: "Maison" },

  // ============================
  // 🍽 Maison → Cuisine → Ustensiles
  // ============================
  pan: { category: "Maison", parent: "Cuisine", root: "Maison" },
  fryingpan: { category: "Maison", parent: "Cuisine", root: "Maison" },
  poele: { category: "Maison", parent: "Cuisine", root: "Maison" },
  pfanne: { category: "Maison", parent: "Cuisine", root: "Maison" },

  // ============================
  // 🍽 Maison → Cuisine → Vaisselle
  // ============================
  plate: { category: "Maison", parent: "Cuisine", root: "Maison" },
  plates: { category: "Maison", parent: "Cuisine", root: "Maison" },
  assiette: { category: "Maison", parent: "Cuisine", root: "Maison" },
  teller: { category: "Maison", parent: "Cuisine", root: "Maison" },

  // ============================
  // 🍽 Maison → Cuisine → Petits appareils
  // ============================
  toaster: { category: "Électroménager", parent: "Maison", root: "Maison" },
  mixer: { category: "Électroménager", parent: "Maison", root: "Maison" },
  blender: { category: "Électroménager", parent: "Maison", root: "Maison" },
  grillepain: { category: "Électroménager", parent: "Maison", root: "Maison" },
  küchenmaschine: { category: "Électroménager", parent: "Maison", root: "Maison" },

  // ============================
  // 🕯 Maison → Décoration → Lampes
  // ============================
  lamp: { category: "Maison", parent: "Décoration", root: "Maison" },
  lamps: { category: "Maison", parent: "Décoration", root: "Maison" },
  lampe: { category: "Maison", parent: "Décoration", root: "Maison" },
  leuchte: { category: "Maison", parent: "Décoration", root: "Maison" },

  // ============================
  // 🖼 Maison → Décoration → Tableaux
  // ============================
  painting: { category: "Maison", parent: "Décoration", root: "Maison" },
  picture: { category: "Maison", parent: "Décoration", root: "Maison" },
  tableau: { category: "Maison", parent: "Décoration", root: "Maison" },
  gemälde: { category: "Maison", parent: "Décoration", root: "Maison" },

  // ============================
  // 🧺 Maison → Literie → Draps
  // ============================
  sheet: { category: "Literie", parent: "Maison", root: "Maison" },
  sheets: { category: "Literie", parent: "Maison", root: "Maison" },
  drap: { category: "Literie", parent: "Maison", root: "Maison" },
  bettwäsche: { category: "Literie", parent: "Maison", root: "Maison" },

  // ============================
  // 🧺 Maison → Salle de bain → Serviettes
  // ============================
  towel: { category: "Maison", parent: "Salle de bain", root: "Maison" },
  towels: { category: "Maison", parent: "Salle de bain", root: "Maison" },
  serviette: { category: "Maison", parent: "Salle de bain", root: "Maison" },
  handtuch: { category: "Maison", parent: "Salle de bain", root: "Maison" },
};

export default home;
