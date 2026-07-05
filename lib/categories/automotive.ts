// lib/categories/automotive.ts

const automotive = {
  // ============================
  // 🚗 Auto → Moteur → Filtres
  // ============================
  oil_filter: { category: "Filtres moteur", parent: "Moteur", root: "Automobile" },
  air_filter: { category: "Filtres moteur", parent: "Moteur", root: "Automobile" },
  filtre_huile: { category: "Filtres moteur", parent: "Moteur", root: "Automobile" },
  ölfilter: { category: "Filtres moteur", parent: "Moteur", root: "Automobile" }, // DE

  // ============================
  // 🚗 Auto → Moteur → Bougies
  // ============================
  spark_plug: { category: "Bougies", parent: "Moteur", root: "Automobile" },
  spark_plugs: { category: "Bougies", parent: "Moteur", root: "Automobile" },
  bougie: { category: "Bougies", parent: "Moteur", root: "Automobile" },
  zündkerze: { category: "Bougies", parent: "Moteur", root: "Automobile" }, // DE

  // ============================
  // 🚗 Auto → Freinage → Plaquettes
  // ============================
  brake_pads: { category: "Plaquettes de frein", parent: "Freinage", root: "Automobile" },
  brakepad: { category: "Plaquettes de frein", parent: "Freinage", root: "Automobile" },
  plaquettes_frein: { category: "Plaquettes de frein", parent: "Freinage", root: "Automobile" },
  bremsbeläge: { category: "Plaquettes de frein", parent: "Freinage", root: "Automobile" }, // DE

  // ============================
  // 🚗 Auto → Freinage → Disques
  // ============================
  brake_disc: { category: "Disques de frein", parent: "Freinage", root: "Automobile" },
  brake_discs: { category: "Disques de frein", parent: "Freinage", root: "Automobile" },
  disque_frein: { category: "Disques de frein", parent: "Freinage", root: "Automobile" },
  bremsscheibe: { category: "Disques de frein", parent: "Freinage", root: "Automobile" }, // DE

  // ============================
  // 🚗 Auto → Pneus → Été
  // ============================
  summer_tire: { category: "Pneus été", parent: "Pneus", root: "Automobile" },
  summer_tires: { category: "Pneus été", parent: "Pneus", root: "Automobile" },
  pneu_ete: { category: "Pneus été", parent: "Pneus", root: "Automobile" },
  sommerreifen: { category: "Pneus été", parent: "Pneus", root: "Automobile" }, // DE

  // ============================
  // 🚗 Auto → Pneus → Hiver
  // ============================
  winter_tire: { category: "Pneus hiver", parent: "Pneus", root: "Automobile" },
  winter_tires: { category: "Pneus hiver", parent: "Pneus", root: "Automobile" },
  pneu_hiver: { category: "Pneus hiver", parent: "Pneus", root: "Automobile" },
  winterreifen: { category: "Pneus hiver", parent: "Pneus", root: "Automobile" }, // DE

  // ============================
  // 🚗 Auto → Éclairage → Ampoules
  // ============================
  headlight_bulb: { category: "Ampoules auto", parent: "Éclairage", root: "Automobile" },
  car_bulb: { category: "Ampoules auto", parent: "Éclairage", root: "Automobile" },
  ampoule_auto: { category: "Ampoules auto", parent: "Éclairage", root: "Automobile" },
  scheinwerferlampe: { category: "Ampoules auto", parent: "Éclairage", root: "Automobile" }, // DE

  // ============================
  // 🚗 Auto → Éclairage → LED
  // ============================
  led_car: { category: "LED auto", parent: "Éclairage", root: "Automobile" },
  led_headlight: { category: "LED auto", parent: "Éclairage", root: "Automobile" },
  led_auto: { category: "LED auto", parent: "Éclairage", root: "Automobile" },
  led_scheinwerfer: { category: "LED auto", parent: "Éclairage", root: "Automobile" }, // DE

  // ============================
  // 🚗 Auto → Accessoires → Tapis
  // ============================
  car_mat: { category: "Tapis de voiture", parent: "Accessoires", root: "Automobile" },
  car_mats: { category: "Tapis de voiture", parent: "Accessoires", root: "Automobile" },
  tapis_voiture: { category: "Tapis de voiture", parent: "Accessoires", root: "Automobile" },
  auto_fußmatten: { category: "Tapis de voiture", parent: "Accessoires", root: "Automobile" }, // DE

  // ============================
  // 🚗 Auto → Accessoires → Housses
  // ============================
  seat_cover: { category: "Housses de siège", parent: "Accessoires", root: "Automobile" },
  seat_covers: { category: "Housses de siège", parent: "Accessoires", root: "Automobile" },
  housse_siege: { category: "Housses de siège", parent: "Accessoires", root: "Automobile" },
  autositzbezug: { category: "Housses de siège", parent: "Accessoires", root: "Automobile" }, // DE
};

export default automotive;
