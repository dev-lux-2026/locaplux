// lib/categories/misc.ts

const misc = {
  // ============================
  // 🧩 Divers → Cadeaux → Cartes cadeaux
  // ============================
  gift_card: { category: "Cartes cadeaux", parent: "Cadeaux", root: "Divers" },
  giftcard: { category: "Cartes cadeaux", parent: "Cadeaux", root: "Divers" },
  carte_cadeau: { category: "Cartes cadeaux", parent: "Cadeaux", root: "Divers" },
  geschenkkarte: { category: "Cartes cadeaux", parent: "Cadeaux", root: "Divers" }, // DE

  // ============================
  // 🧩 Divers → Événements → Billets
  // ============================
  ticket: { category: "Billets", parent: "Événements", root: "Divers" },
  event_ticket: { category: "Billets", parent: "Événements", root: "Divers" },
  billet: { category: "Billets", parent: "Événements", root: "Divers" },
  eintrittskarte: { category: "Billets", parent: "Événements", root: "Divers" }, // DE

  // ============================
  // 🧩 Divers → Accessoires → Porte-clés
  // ============================
  keychain: { category: "Porte-clés", parent: "Accessoires", root: "Divers" },
  key_chain: { category: "Porte-clés", parent: "Accessoires", root: "Divers" },
  porte_cle: { category: "Porte-clés", parent: "Accessoires", root: "Divers" },
  schlüsselanhänger: { category: "Porte-clés", parent: "Accessoires", root: "Divers" }, // DE

  // ============================
  // 🧩 Divers → Accessoires → Gadgets
  // ============================
  gadget: { category: "Gadgets", parent: "Accessoires", root: "Divers" },
  gadgets: { category: "Gadgets", parent: "Accessoires", root: "Divers" },
  accessoire_gadget: { category: "Gadgets", parent: "Accessoires", root: "Divers" },
  gadget_de: { category: "Gadgets", parent: "Accessoires", root: "Divers" }, // DE variation

  // ============================
  // 🧩 Divers → Loisirs → Jeux divers
  // ============================
  boardgame: { category: "Jeux divers", parent: "Loisirs", root: "Divers" },
  table_game: { category: "Jeux divers", parent: "Loisirs", root: "Divers" },
  jeu_divers: { category: "Jeux divers", parent: "Loisirs", root: "Divers" },
  gesellschaftsspiel: { category: "Jeux divers", parent: "Loisirs", root: "Divers" }, // DE

  // ============================
  // 🧩 Divers → Autres → Inclassables
  // ============================
  misc_item: { category: "Inclassables", parent: "Autres", root: "Divers" },
  random_item: { category: "Inclassables", parent: "Autres", root: "Divers" },
  objet_inclassable: { category: "Inclassables", parent: "Autres", root: "Divers" },
  sonstiges: { category: "Inclassables", parent: "Autres", root: "Divers" }, // DE
};

export default misc;
