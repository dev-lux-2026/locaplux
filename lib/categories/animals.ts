// lib/categories/animals.ts

const animals = {
  // ============================
  // 🐶 Animaux → Chiens → Nourriture
  // ============================
  dogfood: { category: "Nourriture chien", parent: "Chiens", root: "Animaux" },
  dog_food: { category: "Nourriture chien", parent: "Chiens", root: "Animaux" },
  croquettes_chien: { category: "Nourriture chien", parent: "Chiens", root: "Animaux" },
  hundefutter: { category: "Nourriture chien", parent: "Chiens", root: "Animaux" }, // DE

  // ============================
  // 🐶 Animaux → Chiens → Accessoires
  // ============================
  dogcollar: { category: "Accessoires chien", parent: "Chiens", root: "Animaux" },
  leash: { category: "Accessoires chien", parent: "Chiens", root: "Animaux" },
  laisse: { category: "Accessoires chien", parent: "Chiens", root: "Animaux" },
  hundeleine: { category: "Accessoires chien", parent: "Chiens", root: "Animaux" }, // DE

  // ============================
  // 🐱 Animaux → Chats → Nourriture
  // ============================
  catfood: { category: "Nourriture chat", parent: "Chats", root: "Animaux" },
  cat_food: { category: "Nourriture chat", parent: "Chats", root: "Animaux" },
  croquettes_chat: { category: "Nourriture chat", parent: "Chats", root: "Animaux" },
  katzenfutter: { category: "Nourriture chat", parent: "Chats", root: "Animaux" }, // DE

  // ============================
  // 🐱 Animaux → Chats → Accessoires
  // ============================
  catlitter: { category: "Accessoires chat", parent: "Chats", root: "Animaux" },
  litiere: { category: "Accessoires chat", parent: "Chats", root: "Animaux" },
  katzenstreu: { category: "Accessoires chat", parent: "Chats", root: "Animaux" }, // DE

  // ============================
  // 🐦 Animaux → Oiseaux → Cages
  // ============================
  birdcage: { category: "Cages oiseaux", parent: "Oiseaux", root: "Animaux" },
  cage_oiseau: { category: "Cages oiseaux", parent: "Oiseaux", root: "Animaux" },
  vogelkäfig: { category: "Cages oiseaux", parent: "Oiseaux", root: "Animaux" }, // DE

  // ============================
  // 🐦 Animaux → Oiseaux → Nourriture
  // ============================
  birdfood: { category: "Nourriture oiseaux", parent: "Oiseaux", root: "Animaux" },
  graines_oiseaux: { category: "Nourriture oiseaux", parent: "Oiseaux", root: "Animaux" },
  vogelfutter: { category: "Nourriture oiseaux", parent: "Oiseaux", root: "Animaux" }, // DE

  // ============================
  // 🐟 Animaux → Poissons → Aquariums
  // ============================
  aquarium: { category: "Aquariums", parent: "Poissons", root: "Animaux" },
  fish_tank: { category: "Aquariums", parent: "Poissons", root: "Animaux" },
  aquarium_de: { category: "Aquariums", parent: "Poissons", root: "Animaux" }, // DE variation

  // ============================
  // 🐟 Animaux → Poissons → Nourriture
  // ============================
  fishfood: { category: "Nourriture poissons", parent: "Poissons", root: "Animaux" },
  fish_food: { category: "Nourriture poissons", parent: "Poissons", root: "Animaux" },
  fischfutter: { category: "Nourriture poissons", parent: "Poissons", root: "Animaux" }, // DE

  // ============================
  // 🐰 Animaux → Petits animaux → Cages
  // ============================
  rabbitcage: { category: "Cages petits animaux", parent: "Petits animaux", root: "Animaux" },
  cage_lapin: { category: "Cages petits animaux", parent: "Petits animaux", root: "Animaux" },
  nagerkäfig: { category: "Cages petits animaux", parent: "Petits animaux", root: "Animaux" }, // DE

  // ============================
  // 🐰 Animaux → Petits animaux → Nourriture
  // ============================
  rabbitfood: { category: "Nourriture petits animaux", parent: "Petits animaux", root: "Animaux" },
  nourriture_lapin: { category: "Nourriture petits animaux", parent: "Petits animaux", root: "Animaux" },
  nagerfutter: { category: "Nourriture petits animaux", parent: "Petits animaux", root: "Animaux" }, // DE
};

export default animals;
