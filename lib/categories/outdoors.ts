// lib/categories/outdoors.ts

const outdoors = {
  // ============================
  // 🏕 Outdoor → Camping → Tentes
  // ============================
  tent: { category: "Tentes", parent: "Camping", root: "Outdoor" },
  camping_tent: { category: "Tentes", parent: "Camping", root: "Outdoor" },
  tente: { category: "Tentes", parent: "Camping", root: "Outdoor" },
  zelt: { category: "Tentes", parent: "Camping", root: "Outdoor" }, // DE

  // ============================
  // 🏕 Outdoor → Camping → Sacs de couchage
  // ============================
  sleeping_bag: { category: "Sacs de couchage", parent: "Camping", root: "Outdoor" },
  sleepingbag: { category: "Sacs de couchage", parent: "Camping", root: "Outdoor" },
  sac_couchage: { category: "Sacs de couchage", parent: "Camping", root: "Outdoor" },
  schlafsack: { category: "Sacs de couchage", parent: "Camping", root: "Outdoor" }, // DE

  // ============================
  // 🔦 Outdoor → Randonnée → Lampes frontales
  // ============================
  headlamp: { category: "Lampes frontales", parent: "Randonnée", root: "Outdoor" },
  head_light: { category: "Lampes frontales", parent: "Randonnée", root: "Outdoor" },
  lampe_frontale: { category: "Lampes frontales", parent: "Randonnée", root: "Outdoor" },
  stirnlampe: { category: "Lampes frontales", parent: "Randonnée", root: "Outdoor" }, // DE

  // ============================
  // 🔦 Outdoor → Randonnée → Bâtons
  // ============================
  trekking_pole: { category: "Bâtons de randonnée", parent: "Randonnée", root: "Outdoor" },
  hiking_pole: { category: "Bâtons de randonnée", parent: "Randonnée", root: "Outdoor" },
  baton_randonnee: { category: "Bâtons de randonnée", parent: "Randonnée", root: "Outdoor" },
  wanderstock: { category: "Bâtons de randonnée", parent: "Randonnée", root: "Outdoor" }, // DE

  // ============================
  // 🔥 Outdoor → Feu → Réchauds
  // ============================
  camping_stove: { category: "Réchauds", parent: "Feu", root: "Outdoor" },
  stove: { category: "Réchauds", parent: "Feu", root: "Outdoor" },
  réchaud: { category: "Réchauds", parent: "Feu", root: "Outdoor" },
  campingkocher: { category: "Réchauds", parent: "Feu", root: "Outdoor" }, // DE

  // ============================
  // 🔥 Outdoor → Feu → Barbecues
  // ============================
  barbecue: { category: "Barbecues", parent: "Feu", root: "Outdoor" },
  bbq: { category: "Barbecues", parent: "Feu", root: "Outdoor" },
  grill: { category: "Barbecues", parent: "Feu", root: "Outdoor" },
  grill_de: { category: "Barbecues", parent: "Feu", root: "Outdoor" }, // DE variation

  // ============================
  // 🎒 Outdoor → Accessoires → Sacs à dos
  // ============================
  backpack: { category: "Sacs à dos", parent: "Accessoires", root: "Outdoor" },
  hiking_backpack: { category: "Sacs à dos", parent: "Accessoires", root: "Outdoor" },
  sac_dos: { category: "Sacs à dos", parent: "Accessoires", root: "Outdoor" },
  rucksack: { category: "Sacs à dos", parent: "Accessoires", root: "Outdoor" }, // DE

  // ============================
  // 🎒 Outdoor → Accessoires → Glacières
  // ============================
  cooler: { category: "Glacières", parent: "Accessoires", root: "Outdoor" },
  ice_box: { category: "Glacières", parent: "Accessoires", root: "Outdoor" },
  glacière: { category: "Glacières", parent: "Accessoires", root: "Outdoor" },
  kühlbox: { category: "Glacières", parent: "Accessoires", root: "Outdoor" }, // DE
};

export default outdoors;
