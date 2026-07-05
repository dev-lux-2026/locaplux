// lib/categories/sports.ts

const sports = {
  // ============================
  // ⚽ Sport → Football → Équipement
  // ============================
  football: { category: "Équipement football", parent: "Football", root: "Sport" },
  soccer: { category: "Équipement football", parent: "Football", root: "Sport" },
  ballon: { category: "Équipement football", parent: "Football", root: "Sport" },
  fussball: { category: "Équipement football", parent: "Football", root: "Sport" }, // DE

  // ============================
  // 🏀 Sport → Basketball → Ballons
  // ============================
  basketball: { category: "Ballons basketball", parent: "Basketball", root: "Sport" },
  basket: { category: "Ballons basketball", parent: "Basketball", root: "Sport" },
  basketball_ball: { category: "Ballons basketball", parent: "Basketball", root: "Sport" },
  basketball_de: { category: "Ballons basketball", parent: "Basketball", root: "Sport" }, // DE variation

  // ============================
  // 🎾 Sport → Tennis → Raquettes
  // ============================
  tennis: { category: "Raquettes tennis", parent: "Tennis", root: "Sport" },
  racket: { category: "Raquettes tennis", parent: "Tennis", root: "Sport" },
  raquette: { category: "Raquettes tennis", parent: "Tennis", root: "Sport" },
  schläger: { category: "Raquettes tennis", parent: "Tennis", root: "Sport" }, // DE

  // ============================
  // 🚴 Sport → Cyclisme → Vélos
  // ============================
  cycling: { category: "Vélos sport", parent: "Cyclisme", root: "Sport" },
  bike_sport: { category: "Vélos sport", parent: "Cyclisme", root: "Sport" },
  rennrad: { category: "Vélos sport", parent: "Cyclisme", root: "Sport" }, // DE vélo de course

  // ============================
  // 🚴 Sport → Cyclisme → Casques
  // ============================
  bikehelmet: { category: "Casques vélo", parent: "Cyclisme", root: "Sport" },
  vélo_casque: { category: "Casques vélo", parent: "Cyclisme", root: "Sport" },
  fahrradhelm: { category: "Casques vélo", parent: "Cyclisme", root: "Sport" }, // DE

  // ============================
  // 🏋️ Sport → Fitness → Accessoires
  // ============================
  dumbbell: { category: "Accessoires fitness", parent: "Fitness", root: "Sport" },
  dumbbells: { category: "Accessoires fitness", parent: "Fitness", root: "Sport" },
  haltère: { category: "Accessoires fitness", parent: "Fitness", root: "Sport" },
  hantel: { category: "Accessoires fitness", parent: "Fitness", root: "Sport" }, // DE

  // ============================
  // 🧘 Sport → Yoga → Tapis
  // ============================
  yogamat: { category: "Tapis yoga", parent: "Yoga", root: "Sport" },
  yoga_mat: { category: "Tapis yoga", parent: "Yoga", root: "Sport" },
  tapis_yoga: { category: "Tapis yoga", parent: "Yoga", root: "Sport" },
  yogamatte: { category: "Tapis yoga", parent: "Yoga", root: "Sport" }, // DE

  // ============================
  // 🏊 Sport → Natation → Lunettes
  // ============================
  goggles: { category: "Lunettes natation", parent: "Natation", root: "Sport" },
  swim_goggles: { category: "Lunettes natation", parent: "Natation", root: "Sport" },
  lunettes_natation: { category: "Lunettes natation", parent: "Natation", root: "Sport" },
  schwimmbrille: { category: "Lunettes natation", parent: "Natation", root: "Sport" }, // DE

  // ============================
  // 🏂 Sport → Sports d’hiver → Ski
  // ============================
  ski: { category: "Ski", parent: "Sports d’hiver", root: "Sport" },
  skis: { category: "Ski", parent: "Sports d’hiver", root: "Sport" },
  skiausrüstung: { category: "Ski", parent: "Sports d’hiver", root: "Sport" }, // DE

  // ============================
  // 🏂 Sport → Sports d’hiver → Snowboard
  // ============================
  snowboard: { category: "Snowboard", parent: "Sports d’hiver", root: "Sport" },
  snowboard_de: { category: "Snowboard", parent: "Sports d’hiver", root: "Sport" }, // DE variation
};

export default sports;
