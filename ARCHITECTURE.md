🧱 Architecture globale
Le projet repose sur une architecture modulaire, scalable, et séparée par responsabilités.

🧩 Technologies principales
Next.js 14 (App Router) — pages serveur + composants client

Prisma ORM — accès DB

MongoDB — stockage

Cloudinary — upload images + auto‑tagging

Proxy middleware — gestion langue

TypeScript — typage strict

API REST — communication interne

📂 Structure des dossiers
Code
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
🔄 Lifecycle complet d’un produit
1) Création produit (vendeur)
Le vendeur ouvre /seller/products/new

Il remplit :

nom

description

prix

stock

images

Lors de l’upload :

l’image part vers /api/upload

Cloudinary renvoie :

URL

tags

mapping tags → autoCategoryId

Le vendeur peut corriger la catégorie via CategorySelector

Le formulaire envoie vers /api/products/create

Prisma crée le produit en DB

2) Affichage produit (public)
L’utilisateur visite /products/[id]

La page charge :

/api/products/get?id=...

/api/vendors/[id]

/api/categories/[id]/products

La langue est déterminée par :

cookie lang

sinon navigateur

Les catégories sont traduites via :

ts
translateCategory(category.name, lang)
Le bouton panier utilise :

ts
addToCart(product)
3) Édition produit (vendeur)
Le vendeur ouvre /seller/products/edit/[id]

La page charge le produit

Le vendeur modifie :

nom

description

prix

stock

images

catégorie

Le formulaire envoie vers /api/products/update

🌍 Architecture multilingue
1) Langue pivot : FR
Toutes les catégories en DB sont en français.

2) Traductions
Code
locales/fr/categories.json
locales/en/categories.json
locales/lu/categories.json
3) Utilitaire
ts
translateCategory(nameFr, lang)
4) Détection langue
Dans proxy.ts :

lit cookie lang

sinon navigateur

sinon FR

5) Sélecteur de langue
Composant client :

Code
<LanguageSwitcher />
🧩 Architecture API
Produits
Route	Description
GET /api/products/get?id=	Récupère un produit
GET /api/products/list	Liste tous les produits
POST /api/products/create	Crée un produit
POST /api/products/update	Met à jour un produit
Catégories
Route	Description
GET /api/categories/all	Liste des catégories
GET /api/categories/[id]/products	Produits similaires
Upload
Route	Description
POST /api/upload	Upload Cloudinary + auto‑catégorie
Vendeur
Route	Description
GET /api/vendors/[id]	Infos vendeur
🧠 Architecture Cloudinary
1) Upload
fichier → /api/upload

upload vers Cloudinary

extraction tags

mapping tags → catégorie

2) Auto‑catégorisation
Exemple :

Code
tag: "shoes" → categoryId: "chaussures"
tag: "camera" → categoryId: "appareils photo"
3) Correction manuelle
Le vendeur peut corriger via :

Code
<CategorySelector autoCategoryId={autoCategoryId} />
🧱 Architecture catégorie
1) Stockage DB
nom FR

parentId (optionnel)

slug (optionnel)

id (ObjectId)

2) Traduction dynamique
FR → EN → LU via JSON

jamais stocker les traductions en DB

3) Sélecteur dynamique
Chargé via :

Code
/api/categories/all
🛒 Architecture panier
1) Stockage local
Dans lib/cart.ts :

localStorage

ajout produit

suppression

quantité

2) Bouton
Code
<AddToCartButton product={product} />
🔐 Architecture sécurité
pas de slug public

ID uniquement

pas de données sensibles côté client

validation API systématique

pas de console.log en prod

pas de clés Cloudinary côté client

⚡ Architecture performance
pages produits = server components

composants UI = client components

fetch = cache: "no-store"

pas de fetch en cascade inutile

pas de JSON massif dans les props

🧹 Architecture propreté
TypeScript strict

pas de duplication slug/id

pas de code mort

pas de console.log

architecture modulaire

séparation claire UI / logique / API

🧭 Diagramme de flux (simplifié)
Code
[Seller] → /seller/products/new
    ↓
[Upload Image] → /api/upload → Cloudinary → autoCategoryId
    ↓
[Form Submit] → /api/products/create → Prisma → MongoDB
    ↓
[Public Page] → /products/[id]
    ↓
[API] → /api/products/get?id=
    ↓
[Vendor] → /api/vendors/[id]
    ↓
[Similar] → /api/categories/[id]/products