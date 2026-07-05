// lib/categories/baby.ts

const baby = {
  // ============================
  // 👶 Bébé → Poussettes
  // ============================
  stroller: { category: "Poussettes", parent: "Bébé", root: "Puériculture" },
  pushchair: { category: "Poussettes", parent: "Bébé", root: "Puériculture" },
  poussette: { category: "Poussettes", parent: "Bébé", root: "Puériculture" },
  kinderwagen: { category: "Poussettes", parent: "Bébé", root: "Puériculture" }, // DE
  buggie: { category: "Poussettes", parent: "Bébé", root: "Puériculture" },

  // ============================
  // 👶 Bébé → Sièges auto
  // ============================
  carseat: { category: "Sièges auto", parent: "Bébé", root: "Puériculture" },
  babyseat: { category: "Sièges auto", parent: "Bébé", root: "Puériculture" },
  siège_auto: { category: "Sièges auto", parent: "Bébé", root: "Puériculture" },
  kindersitz: { category: "Sièges auto", parent: "Bébé", root: "Puériculture" }, // DE

  // ============================
  // 👶 Bébé → Lits bébé
  // ============================
  crib: { category: "Lits bébé", parent: "Bébé", root: "Puériculture" },
  babybed: { category: "Lits bébé", parent: "Bébé", root: "Puériculture" },
  lit_bebe: { category: "Lits bébé", parent: "Bébé", root: "Puériculture" },
  babybett: { category: "Lits bébé", parent: "Bébé", root: "Puériculture" }, // DE

  // ============================
  // 👶 Bébé → Biberons
  // ============================
  bottle: { category: "Biberons", parent: "Alimentation bébé", root: "Puériculture" },
  babybottle: { category: "Biberons", parent: "Alimentation bébé", root: "Puériculture" },
  biberon: { category: "Biberons", parent: "Alimentation bébé", root: "Puériculture" },
  fläschchen: { category: "Biberons", parent: "Alimentation bébé", root: "Puériculture" }, // DE

  // ============================
  // 👶 Bébé → Tire-lait
  // ============================
  breastpump: { category: "Tire-lait", parent: "Alimentation bébé", root: "Puériculture" },
  tire_lait: { category: "Tire-lait", parent: "Alimentation bébé", root: "Puériculture" },
  milchpumpe: { category: "Tire-lait", parent: "Alimentation bébé", root: "Puériculture" }, // DE

  // ============================
  // 👶 Bébé → Changes → Couches
  // ============================
  diaper: { category: "Couches", parent: "Changes", root: "Puériculture" },
  diapers: { category: "Couches", parent: "Changes", root: "Puériculture" },
  couche: { category: "Couches", parent: "Changes", root: "Puériculture" },
  windel: { category: "Couches", parent: "Changes", root: "Puériculture" }, // DE

  // ============================
  // 👶 Bébé → Changes → Lingettes
  // ============================
  wipes: { category: "Lingettes", parent: "Changes", root: "Puériculture" },
  lingettes: { category: "Lingettes", parent: "Changes", root: "Puériculture" },
  feuchttücher: { category: "Lingettes", parent: "Changes", root: "Puériculture" }, // DE

  // ============================
  // 👶 Bébé → Jouets bébé
  // ============================
  babytoy: { category: "Jouets bébé", parent: "Bébé", root: "Puériculture" },
  baby_toy: { category: "Jouets bébé", parent: "Bébé", root: "Puériculture" },
  jouet_bebe: { category: "Jouets bébé", parent: "Bébé", root: "Puériculture" },
  babyspielzeug: { category: "Jouets bébé", parent: "Bébé", root: "Puériculture" }, // DE
};

export default baby;
