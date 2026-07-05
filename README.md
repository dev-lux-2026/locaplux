README.md — Marketplace Multivendeur (Next.js 14 + Prisma + MongoDB)
🚀 Présentation du projet
Marketplace multivendeur moderne, inspirée d’Amazon / Vinted, construite avec :

Next.js 14 (App Router)

Prisma ORM

MongoDB

Authentification sécurisée

Module vendeur complet

Gestion des catégories multilingue (FR / EN / LU)

Upload Cloudinary + auto‑détection de catégorie

Produits avec ID (pas slug)

Proxy middleware pour la langue

Architecture propre, scalable, modulaire

📂 Structure du projet
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
🧩 Fonctionnalités principales
✔️ 1. Produits basés sur ID
Toutes les pages produits utilisent :

Code
/products/[id]
L’API correspondante :

Code
/api/products/get?id=...
Plus aucun conflit [slug] vs [id].

✔️ 2. Upload Cloudinary + auto‑détection de catégorie
L’API /api/upload :

upload l’image

détecte la catégorie via tags Cloudinary

renvoie autoCategoryId

Le formulaire vendeur utilise :

tsx
<CategorySelector autoCategoryId={autoCategoryId} />
✔️ 3. Sélecteur de catégories dynamique
API :

Code
/api/categories/all
Hook :

Code
useCategories()
Composant :

Code
<CategorySelector />
✔️ 4. Multilingue FR / EN / LU
Dictionnaires :
Code
locales/fr/categories.json
locales/en/categories.json
locales/lu/categories.json
Utilitaire :
ts
translateCategory(nameFr, lang)
✔️ 5. Proxy middleware pour la langue
Fichier obligatoire :

Code
proxy.ts
Il :

lit le cookie lang

sinon détecte la langue navigateur

sinon FR

définit le cookie

fonctionne avec Next.js 14

✔️ 6. Sélecteur de langue (client)
Composant :

Code
<LanguageSwitcher />
Intégré dans layout.tsx.

✔️ 7. Page produit publique
Chemin :

Code
app/products/[id]/page.tsx
Charge :

produit

vendeur

produits similaires

bouton AddToCart

✔️ 8. Module vendeur complet
Liste des produits

Création

Édition

Upload images

Auto‑catégorisation

Sélecteur manuel

Stock, prix, description

🛠️ Installation
Code
npm install
npx prisma generate
npm run dev
🗄️ Base de données (Prisma + MongoDB)
Modèle principal :

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
🌍 API Routes principales
Route	Description
/api/products/get?id=	Récupère un produit
/api/products/list	Liste tous les produits
/api/products/create	Crée un produit
/api/products/update	Met à jour un produit
/api/categories/all	Liste des catégories
/api/categories/[id]/products	Produits similaires
/api/upload	Upload Cloudinary + auto‑catégorie
/api/vendors/[id]	Infos vendeur
🌐 Multilingue
Récupérer la langue côté serveur :
ts
const lang = getLang();
Traduire une catégorie :
ts
translateCategory(category.name, lang)
Changer la langue :
tsx
<LanguageSwitcher />
🧱 Architecture produit
ID = source de vérité

Slug = supprimé (évite conflits)

Pages publiques = /products/[id]

Pages vendeur = /seller/products/...

🛒 Panier
Composant :

Code
components/AddToCartButton.tsx
Fonction :

Code
lib/cart.ts
🔐 Authentification
Login / Register

Sessions sécurisées

Dashboard vendeur

📦 Upload Cloudinary
Upload image

Extraction tags

Mapping vers catégorie

Suggestion automatique

🧭 Navigation
Layout global

Header avec sélecteur de langue

Pages publiques + vendeur

🧹 Bonnes pratiques intégrées
Architecture modulaire

API REST propre

Pas de duplication slug/id

Proxy middleware Next.js 14

Séparation client/server

Composants réutilisables

README.md — Marketplace Multivendeur (Next.js 14 + Prisma + MongoDB)
🚀 Présentation
Ce projet est une marketplace multivendeur moderne, inspirée d’Amazon / Vinted, construite avec :

Next.js 14 (App Router)

Prisma ORM

MongoDB

Authentification sécurisée

Module vendeur complet

Gestion des catégories multilingue (FR / EN / LU)

Upload Cloudinary + auto‑détection de catégorie

Produits basés sur ID

Proxy middleware pour la langue

Architecture modulaire, scalable, propre

📂 Structure du projet
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
🧩 Fonctionnalités principales
✔️ Produits basés sur ID
Toutes les pages publiques utilisent :

Code
/products/[id]
L’API correspondante :

Code
/api/products/get?id=...
Plus aucun conflit [slug] vs [id].

✔️ Upload Cloudinary + auto‑catégorisation
L’API /api/upload :

upload l’image

détecte la catégorie via tags Cloudinary

renvoie autoCategoryId

Le formulaire vendeur utilise :

tsx
<CategorySelector autoCategoryId={autoCategoryId} />
✔️ Sélecteur de catégories dynamique
API :

Code
/api/categories/all
Hook :

ts
useCategories()
Composant :

tsx
<CategorySelector />
✔️ Multilingue FR / EN / LU
Dictionnaires :
Code
locales/fr/categories.json
locales/en/categories.json
locales/lu/categories.json
Utilitaire :
ts
translateCategory(nameFr, lang)
✔️ Proxy middleware pour la langue (Next.js 14)
Fichier obligatoire :

Code
proxy.ts
Il :

lit le cookie lang

sinon détecte la langue navigateur

sinon FR

définit le cookie

fonctionne avec Next.js 14 (middleware.ts déprécié)

✔️ Sélecteur de langue (client)
Composant :

tsx
<LanguageSwitcher />
Intégré dans layout.tsx.

✔️ Page produit publique
Chemin :

Code
app/products/[id]/page.tsx
Charge :

produit

vendeur

produits similaires

bouton AddToCart

✔️ Module vendeur complet
Liste des produits

Création

Édition

Upload images

Auto‑catégorisation

Sélecteur manuel

Stock, prix, description

🛠️ Installation
Code
npm install
npx prisma generate
npm run dev
🗄️ Base de données (Prisma + MongoDB)
Modèle principal :

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
🌍 API Routes principales
Route	Description
/api/products/get?id=	Récupère un produit
/api/products/list	Liste tous les produits
/api/products/create	Crée un produit
/api/products/update	Met à jour un produit
/api/categories/all	Liste des catégories
/api/categories/[id]/products	Produits similaires
/api/upload	Upload Cloudinary + auto‑catégorie
/api/vendors/[id]	Infos vendeur
🌐 Multilingue
Récupérer la langue côté serveur :
ts
const lang = getLang();
Traduire une catégorie :
ts
translateCategory(category.name, lang)
Changer la langue :
tsx
<LanguageSwitcher />
🧱 Architecture produit
ID = source de vérité

Slug = supprimé (évite conflits)

Pages publiques = /products/[id]

Pages vendeur = /seller/products/...

🛒 Panier
Composant :

Code
components/AddToCartButton.tsx
Fonction :

Code
lib/cart.ts
📦 Upload Cloudinary
Upload image

Extraction tags

Mapping vers catégorie

Suggestion automatique

🧭 Navigation
Layout global

Header avec sélecteur de langue

Pages publiques + vendeur

🧹 Bonnes pratiques intégrées
Architecture modulaire

API REST propre

Pas de duplication slug/id

Proxy middleware Next.js 14

Séparation client/server

Composants réutilisables

Phase 1 — Fondations techniques (100% terminée)
Installation Next.js 14 (App Router)

Installation Prisma + MongoDB

Configuration Prisma + génération du client

Authentification + sessions

Dashboard admin / vendeur

Routing propre (App Router)

Nettoyage des anciens modules

Migration vers architecture ID (plus de slug)

Mise en place du proxy Next.js 14 (remplace middleware)

Mise en place du système multilingue FR/EN/LU

✔️ Statut : entièrement terminé

Phase 2 — Module Vendeur (95% terminé)
Déjà fait :
Page liste produits vendeur

Page création produit

Page édition produit

Upload Cloudinary

Auto‑catégorisation via tags Cloudinary

Sélecteur de catégorie dynamique

API produits (create, update, get, list)

API catégories (all, products by category)

Architecture produit basée sur ID

Correction complète du conflit slug/id

Reste à faire :
Validation stricte des formulaires

Gestion des erreurs UI

Amélioration UX (loading states, messages)

✔️ Statut : presque terminé

Phase 3 — Pages publiques (80% terminé)
Déjà fait :
Page produit publique /products/[id]

Chargement vendeur

Chargement produits similaires

Bouton AddToCart fonctionnel

Traduction des catégories

Détection langue via proxy

Sélecteur de langue dans layout

Reste à faire :
Page catégorie publique

Page vendeur publique

Page liste produits publique (homepage)

✔️ Statut : bien avancé

Phase 4 — Multilingue (70% terminé)
Déjà fait :
Proxy Next.js 14 pour la langue

Cookie lang

Détection navigateur

Sélecteur de langue client

Helper serveur getLang()

Traduction des catégories via JSON

Reste à faire :
Traduction des textes généraux (boutons, labels, titres)

Mise en place d’un système locales/{lang}/common.json

Hook useTranslation()

✔️ Statut : en cours

Phase 5 — Panier & Checkout (10% terminé)
Déjà fait :
Bouton AddToCart

Stockage local du panier

Reste à faire :
Page panier

Page checkout

Paiement (Stripe ou autre)

Validation stock avant paiement

✔️ Statut : débuté

Phase 6 — Vendeurs (40% terminé)
Déjà fait :
API vendeur /api/vendors/[id]

Affichage vendeur sur page produit

Reste à faire :
Page publique vendeur

Page profil vendeur

Gestion des informations vendeur

Gestion des boosts / abonnements (premium)

✔️ Statut : en cours

Phase 7 — Catégories (80% terminé)
Déjà fait :
API catégories

Sélecteur dynamique

Auto‑catégorisation Cloudinary

Traduction FR/EN/LU

Reste à faire :
Page publique catégorie

Navigation par catégorie

✔️ Statut : presque terminé

Phase 8 — Optimisations & sécurité (0% commencé)
Rate limiting API

Validation Zod

Optimisation images

Optimisation SEO

Cache intelligent

Logs & monitoring

✔️ Statut : à faire

📌 Où nous en sommes EXACTEMENT maintenant
✔️ Architecture : 100% propre
Plus aucun conflit slug/id

Routing stable

Proxy Next.js 14 opérationnel

Pages serveur + composants client bien séparés

✔️ Module vendeur : fonctionnel
Création produit OK

Édition produit OK

Upload Cloudinary OK

Auto‑catégorisation OK

Sélecteur catégorie OK

✔️ Page produit publique : fonctionnelle
Chargement produit OK

Chargement vendeur OK

Produits similaires OK

AddToCart OK

Traduction catégories OK

✔️ Multilingue : fonctionnel mais pas complet
Détection langue OK

Sélecteur langue OK

Traduction catégories OK

Traduction textes généraux → à faire

✔️ Ce qui reste pour finaliser la base du marketplace
Page catégorie publique

Page vendeur publique

Page liste produits publique

Traduction des textes généraux

Page panier

Page checkout