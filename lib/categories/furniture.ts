// lib/categories/furniture.ts

const furniture = {
  // ============================
  // 🛋 Mobilier → Salon → Canapés
  // ============================
  sofa: { category: "Canapés", parent: "Salon", root: "Mobilier" },
  couch: { category: "Canapés", parent: "Salon", root: "Mobilier" },
  canapé: { category: "Canapés", parent: "Salon", root: "Mobilier" },
  sofa_de: { category: "Canapés", parent: "Salon", root: "Mobilier" }, // DE variation

  // ============================
  // 🛋 Mobilier → Salon → Fauteuils
  // ============================
  armchair: { category: "Fauteuils", parent: "Salon", root: "Mobilier" },
  fauteuil: { category: "Fauteuils", parent: "Salon", root: "Mobilier" },
  sessel: { category: "Fauteuils", parent: "Salon", root: "Mobilier" }, // DE

  // ============================
  // 🛏 Mobilier → Chambre → Lits
  // ============================
  bed: { category: "Lits", parent: "Chambre", root: "Mobilier" },
  beds: { category: "Lits", parent: "Chambre", root: "Mobilier" },
  lit: { category: "Lits", parent: "Chambre", root: "Mobilier" },
  bett: { category: "Lits", parent: "Chambre", root: "Mobilier" }, // DE

  // ============================
  // 🛏 Mobilier → Chambre → Matelas
  // ============================
  mattress: { category: "Matelas", parent: "Chambre", root: "Mobilier" },
  matelas: { category: "Matelas", parent: "Chambre", root: "Mobilier" },
  matratze: { category: "Matelas", parent: "Chambre", root: "Mobilier" }, // DE

  // ============================
  // 🍽 Mobilier → Salle à manger → Tables
  // ============================
  dining_table: { category: "Tables", parent: "Salle à manger", root: "Mobilier" },
  table: { category: "Tables", parent: "Salle à manger", root: "Mobilier" },
  table_manger: { category: "Tables", parent: "Salle à manger", root: "Mobilier" },
  esstisch: { category: "Tables", parent: "Salle à manger", root: "Mobilier" }, // DE

  // ============================
  // 🍽 Mobilier → Salle à manger → Chaises
  // ============================
  dining_chair: { category: "Chaises", parent: "Salle à manger", root: "Mobilier" },
  dining_chairs: { category: "Chaises", parent: "Salle à manger", root: "Mobilier" },
  chaise: { category: "Chaises", parent: "Salle à manger", root: "Mobilier" },
  stuhl: { category: "Chaises", parent: "Salle à manger", root: "Mobilier" }, // DE

  // ============================
  // 🗄 Mobilier → Rangement → Armoires
  // ============================
  wardrobe: { category: "Armoires", parent: "Rangement", root: "Mobilier" },
  armoire: { category: "Armoires", parent: "Rangement", root: "Mobilier" },
  kleiderschrank: { category: "Armoires", parent: "Rangement", root: "Mobilier" }, // DE

  // ============================
  // 🗄 Mobilier → Rangement → Étagères
  // ============================
  shelf: { category: "Étagères", parent: "Rangement", root: "Mobilier" },
  shelves: { category: "Étagères", parent: "Rangement", root: "Mobilier" },
  étagère: { category: "Étagères", parent: "Rangement", root: "Mobilier" },
  regal: { category: "Étagères", parent: "Rangement", root: "Mobilier" }, // DE
};

export default furniture;
