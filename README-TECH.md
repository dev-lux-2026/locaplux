app/
  layout.tsx
  proxy.ts
  page.tsx

  products/
    [id]/
      page.tsx

  seller/
    products/
      page.tsx
      new/
        page.tsx
      edit/
        [id]/
          page.tsx

  api/
    products/
      get/route.ts
      list/route.ts
      create/route.ts
      update/route.ts
    categories/
      all/route.ts
      [id]/
        products/route.ts
    upload/route.ts
    vendors/
      [id]/route.ts

components/
  AddToCartButton.tsx
  CategorySelector.tsx
  LanguageSwitcher.tsx

lib/
  cart.ts
  translateCategory.ts
  useCategories.ts
  getLang.ts

locales/
  fr/categories.json
  en/categories.json
  lu/categories.json

prisma/
  schema.prisma

Règles de routing (obligatoires)
1. Les produits utilisent exclusivement l’ID
Page publique : /products/[id]

Page vendeur : /seller/products/edit/[id]

API : /api/products/get?id=...

❌ Interdit :
/product/[slug]

/products/[slug]

mélanger slug et id

✔️ Autorisé :
/products/[id]

🌍 Règles multilingues
1. Langues supportées
fr (pivot)

en

lu (Luxembourgeois)

2. Traductions
Stockées dans :

Code
locales/{lang}/categories.json
3. Utilitaire de traduction
ts
translateCategory(nameFr, lang)
4. Détection de langue
Via :

cookie lang

fallback navigateur

fallback FR

5. Middleware
Utilise proxy.ts (Next.js 14).

🧩 Règles API
1. Format des routes
Produits
Code
GET /api/products/get?id=
GET /api/products/list
POST /api/products/create
POST /api/products/update
Catégories
Code
GET /api/categories/all
GET /api/categories/[id]/products
Upload
Code
POST /api/upload
Vendeur
Code
GET /api/vendors/[id]
2. Réponses API
Succès
json
{
  "success": true,
  "data": { ... }
}
Erreur
json
{
  "success": false,
  "error": "Message explicite"
}
3. Règles
jamais de throw brut → toujours réponse JSON propre

jamais de console.log en production

toujours cache: "no-store" pour les données dynamiques

🧱 Règles Prisma & Base de données
1. Modèle produit
prisma
model Product {
  id          String   @id @default(auto()) @map("_id") @db.ObjectId
  name        String
  description String?
  price       Float
  stock       Int
  images      String[]
  categoryId  String?
  userId      String
  createdAt   DateTime @default(now())
}
2. Règles
jamais de slug dans la DB

toujours stocker les images sous forme de tableau

toujours stocker la catégorie via categoryId

🧩 Règles UI & Composants
1. Composants globaux
AddToCartButton

CategorySelector

LanguageSwitcher

2. Règles
composants UI = client components

pages = server components

pas de logique métier dans les composants UI

🧠 Règles de performance
utiliser cache: "no-store" pour les données dynamiques

utiliser revalidate pour les données statiques

éviter les fetch en cascade

éviter les composants client inutiles

éviter les JSON massifs dans les props

🔐 Règles de sécurité
jamais exposer les clés Cloudinary côté client

jamais exposer les IDs internes sensibles

toujours valider les données côté serveur

toujours vérifier l’authentification pour les routes vendeur

🧹 Règles de propreté du code
TypeScript obligatoire

pas de any sauf cas extrême

pas de code mort

pas de console.log en prod

pas de duplication de logique

respecter l’architecture

🧭 Règles de développement
Branches Git
main = production

dev = développement

feature/* = nouvelles fonctionnalités

Commits
Format :

Code
feat: ajout du module vendeur
fix: correction du routing produit
refactor: nettoyage du code
chore: mise à jour dépendances