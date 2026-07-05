// lib/categories/luggage.ts

const luggage = {
  // ============================
  // 🧳 Bagagerie → Valises → Rigides
  // ============================
  hard_suitcase: { category: "Valises rigides", parent: "Valises", root: "Bagagerie" },
  hard_luggage: { category: "Valises rigides", parent: "Valises", root: "Bagagerie" },
  valise_rigide: { category: "Valises rigides", parent: "Valises", root: "Bagagerie" },
  hartschalenkoffer: { category: "Valises rigides", parent: "Valises", root: "Bagagerie" }, // DE

  // ============================
  // 🧳 Bagagerie → Valises → Souples
  // ============================
  soft_suitcase: { category: "Valises souples", parent: "Valises", root: "Bagagerie" },
  soft_luggage: { category: "Valises souples", parent: "Valises", root: "Bagagerie" },
  valise_souple: { category: "Valises souples", parent: "Valises", root: "Bagagerie" },
  weichkoffer: { category: "Valises souples", parent: "Valises", root: "Bagagerie" }, // DE

  // ============================
  // 🎒 Bagagerie → Sacs → Sacs à dos
  // ============================
  backpack: { category: "Sacs à dos", parent: "Sacs", root: "Bagagerie" },
  travel_backpack: { category: "Sacs à dos", parent: "Sacs", root: "Bagagerie" },
  sac_dos: { category: "Sacs à dos", parent: "Sacs", root: "Bagagerie" },
  rucksack: { category: "Sacs à dos", parent: "Sacs", root: "Bagagerie" }, // DE

  // ============================
  // 🎒 Bagagerie → Sacs → Sacs de voyage
  // ============================
  travel_bag: { category: "Sacs de voyage", parent: "Sacs", root: "Bagagerie" },
  duffel_bag: { category: "Sacs de voyage", parent: "Sacs", root: "Bagagerie" },
  sac_voyage: { category: "Sacs de voyage", parent: "Sacs", root: "Bagagerie" },
  reisetasche: { category: "Sacs de voyage", parent: "Sacs", root: "Bagagerie" }, // DE

  // ============================
  // 🎒 Bagagerie → Accessoires → Trousse de toilette
  // ============================
  toiletry_bag: { category: "Trousses de toilette", parent: "Accessoires", root: "Bagagerie" },
  wash_bag: { category: "Trousses de toilette", parent: "Accessoires", root: "Bagagerie" },
  trousse_toilette: { category: "Trousses de toilette", parent: "Accessoires", root: "Bagagerie" },
  kulturbeutel: { category: "Trousses de toilette", parent: "Accessoires", root: "Bagagerie" }, // DE

  // ============================
  // 🎒 Bagagerie → Accessoires → Étiquettes
  // ============================
  luggage_tag: { category: "Étiquettes bagage", parent: "Accessoires", root: "Bagagerie" },
  bag_tag: { category: "Étiquettes bagage", parent: "Accessoires", root: "Bagagerie" },
  etiquette_bagage: { category: "Étiquettes bagage", parent: "Accessoires", root: "Bagagerie" },
  gepäckanhänger: { category: "Étiquettes bagage", parent: "Accessoires", root: "Bagagerie" }, // DE
};

export default luggage;
