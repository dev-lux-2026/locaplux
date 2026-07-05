// lib/categories/books.ts

const books = {
  // ============================
  // 📚 Livres → Fiction → Romans
  // ============================
  novel: { category: "Romans", parent: "Fiction", root: "Livres" },
  novels: { category: "Romans", parent: "Fiction", root: "Livres" },
  roman: { category: "Romans", parent: "Fiction", root: "Livres" },
  roman_de: { category: "Romans", parent: "Fiction", root: "Livres" }, // DE variation

  // ============================
  // 📚 Livres → Fiction → Policier
  // ============================
  thriller: { category: "Policier / Thriller", parent: "Fiction", root: "Livres" },
  crime_novel: { category: "Policier / Thriller", parent: "Fiction", root: "Livres" },
  policier: { category: "Policier / Thriller", parent: "Fiction", root: "Livres" },
  krimi: { category: "Policier / Thriller", parent: "Fiction", root: "Livres" }, // DE

  // ============================
  // 📚 Livres → Fiction → Fantasy
  // ============================
  fantasy: { category: "Fantasy", parent: "Fiction", root: "Livres" },
  fantasy_book: { category: "Fantasy", parent: "Fiction", root: "Livres" },
  livre_fantasy: { category: "Fantasy", parent: "Fiction", root: "Livres" },
  fantasy_de: { category: "Fantasy", parent: "Fiction", root: "Livres" }, // DE variation

  // ============================
  // 📘 Livres → Non-fiction → Développement personnel
  // ============================
  selfhelp: { category: "Développement personnel", parent: "Non-fiction", root: "Livres" },
  self_help: { category: "Développement personnel", parent: "Non-fiction", root: "Livres" },
  developpement_perso: { category: "Développement personnel", parent: "Non-fiction", root: "Livres" },
  selbsthilfe: { category: "Développement personnel", parent: "Non-fiction", root: "Livres" }, // DE

  // ============================
  // 📘 Livres → Non-fiction → Histoire
  // ============================
  history_book: { category: "Histoire", parent: "Non-fiction", root: "Livres" },
  historical: { category: "Histoire", parent: "Non-fiction", root: "Livres" },
  histoire: { category: "Histoire", parent: "Non-fiction", root: "Livres" },
  geschichte: { category: "Histoire", parent: "Non-fiction", root: "Livres" }, // DE

  // ============================
  // 📗 Livres → Non-fiction → Cuisine
  // ============================
  cookbook: { category: "Cuisine", parent: "Non-fiction", root: "Livres" },
  cooking_book: { category: "Cuisine", parent: "Non-fiction", root: "Livres" },
  livre_cuisine: { category: "Cuisine", parent: "Non-fiction", root: "Livres" },
  kochbuch: { category: "Cuisine", parent: "Non-fiction", root: "Livres" }, // DE

  // ============================
  // 📙 Livres → Enfants → Albums
  // ============================
  kids_book: { category: "Livres enfants", parent: "Enfants", root: "Livres" },
  children_book: { category: "Livres enfants", parent: "Enfants", root: "Livres" },
  livre_enfant: { category: "Livres enfants", parent: "Enfants", root: "Livres" },
  kinderbuch: { category: "Livres enfants", parent: "Enfants", root: "Livres" }, // DE

  // ============================
  // 📙 Livres → Enfants → BD / Manga
  // ============================
  manga: { category: "BD / Manga", parent: "Enfants", root: "Livres" },
  comic: { category: "BD / Manga", parent: "Enfants", root: "Livres" },
  bd: { category: "BD / Manga", parent: "Enfants", root: "Livres" },
  comic_de: { category: "BD / Manga", parent: "Enfants", root: "Livres" }, // DE variation
};

export default books;
