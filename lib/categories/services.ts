// lib/categories/services.ts

const services = {
  // ============================
  // 🧹 Services → Maison → Nettoyage
  // ============================
  cleaning_service: { category: "Service de nettoyage", parent: "Maison", root: "Services" },
  home_cleaning: { category: "Service de nettoyage", parent: "Maison", root: "Services" },
  nettoyage_maison: { category: "Service de nettoyage", parent: "Maison", root: "Services" },
  reinigungsdienst: { category: "Service de nettoyage", parent: "Maison", root: "Services" }, // DE

  // ============================
  // 🔧 Services → Maison → Réparations
  // ============================
  repair_service: { category: "Réparations", parent: "Maison", root: "Services" },
  handyman: { category: "Réparations", parent: "Maison", root: "Services" },
  service_reparation: { category: "Réparations", parent: "Maison", root: "Services" },
  reparaturdienst: { category: "Réparations", parent: "Maison", root: "Services" }, // DE

  // ============================
  // 🚚 Services → Logistique → Livraison
  // ============================
  delivery_service: { category: "Livraison", parent: "Logistique", root: "Services" },
  express_delivery: { category: "Livraison", parent: "Logistique", root: "Services" },
  service_livraison: { category: "Livraison", parent: "Logistique", root: "Services" },
  lieferservice: { category: "Livraison", parent: "Logistique", root: "Services" }, // DE

  // ============================
  // 🚚 Services → Logistique → Déménagement
  // ============================
  moving_service: { category: "Déménagement", parent: "Logistique", root: "Services" },
  movers: { category: "Déménagement", parent: "Logistique", root: "Services" },
  service_demenagement: { category: "Déménagement", parent: "Logistique", root: "Services" },
  umzugsdienst: { category: "Déménagement", parent: "Logistique", root: "Services" }, // DE

  // ============================
  // 🧑‍🏫 Services → Formation → Cours particuliers
  // ============================
  tutoring: { category: "Cours particuliers", parent: "Formation", root: "Services" },
  private_lessons: { category: "Cours particuliers", parent: "Formation", root: "Services" },
  cours_particulier: { category: "Cours particuliers", parent: "Formation", root: "Services" },
  nachhilfe: { category: "Cours particuliers", parent: "Formation", root: "Services" }, // DE

  // ============================
  // 🧑‍💻 Services → Formation → Informatique
  // ============================
  it_training: { category: "Formation informatique", parent: "Formation", root: "Services" },
  computer_training: { category: "Formation informatique", parent: "Formation", root: "Services" },
  formation_informatique: { category: "Formation informatique", parent: "Formation", root: "Services" },
  it_schulung: { category: "Formation informatique", parent: "Formation", root: "Services" }, // DE

  // ============================
  // 📸 Services → Création → Photographie
  // ============================
  photography: { category: "Photographie", parent: "Création", root: "Services" },
  photo_service: { category: "Photographie", parent: "Création", root: "Services" },
  photographe: { category: "Photographie", parent: "Création", root: "Services" },
  fotograf: { category: "Photographie", parent: "Création", root: "Services" }, // DE

  // ============================
  // 🎥 Services → Création → Vidéo
  // ============================
  video_service: { category: "Vidéo", parent: "Création", root: "Services" },
  videography: { category: "Vidéo", parent: "Création", root: "Services" },
  service_video: { category: "Vidéo", parent: "Création", root: "Services" },
  videodienst: { category: "Vidéo", parent: "Création", root: "Services" }, // DE
};

export default services;
