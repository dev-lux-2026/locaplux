Roadmap complète du Marketplace (version stable)
Phase 1 — Fondations techniques
[x] Installation Next.js App Router

[x] Installation Prisma + PostgreSQL

[x] Installation NextAuth

[x] Modèle User (user / seller / admin)

[x] Layout global propre

[x] Middleware global (protection automatique)

Phase 2 — Authentification & Sessions
[x] Page Register

[x] Page Login

[x] Session côté serveur (getServerSession)

[x] Redirections propres

[ ] Google OAuth (en cours dans ton onglet Google Cloud)

Phase 3 — Dashboard utilisateur
[x] Page /dashboard

[x] Affichage du rôle

[x] Bouton “Devenir vendeur”

[x] API /api/seller/request

Phase 4 — Dashboard admin
[x] Page /admin

[x] Liste des utilisateurs non vendeurs

[x] Validation vendeur

[x] API /api/admin/validate-seller

[x] Protection admin via middleware

Phase 5 — Dashboard vendeur
[x] Page /seller (accueil)

[x] Page /seller/products (liste)

[x] Page /seller/boosts

[x] Page /seller/settings

[x] Protection seller via middleware

Phase 6 — CRUD Produits (vendeur)
[x] Liste des produits

[x] Page “Ajouter un produit”

[x] Page “Modifier un produit”

[x] API create

[x] API update

[x] API delete

[ ] Upload d’images produit (Cloudinary / UploadThing)

[ ] Assignation catégorie → produit

Phase 7 — Catégories (admin)
[ ] Modèle Category

[ ] CRUD catégories admin

[ ] Assignation catégorie → produit

[ ] Page publique catégorie

Phase 8 — Page produit publique
[ ] Page /product/[slug]

[ ] SEO + slug unique

[ ] Affichage vendeur

[ ] Produits similaires

Phase 9 — Panier & Checkout
[ ] Panier local

[ ] Panier connecté

[ ] Checkout Stripe

[ ] Confirmation commande

Phase 10 — Commandes
[ ] Modèle Order

[ ] Commandes côté client

[ ] Commandes côté vendeur

[ ] Commandes côté admin

Phase 11 — Boosts avancés
[ ] Modèle Boost

[ ] Achat boost

[ ] Mise en avant produit

[ ] Expiration boost

[ ] Statistiques boost

Phase 12 — Optimisations & UI
[ ] Refonte UI dashboard

[ ] Composants réutilisables

[ ] Animations / transitions

[ ] Dark mode

[ ] Accessibilité

_________*****______

Projet Marketplace Next.js :
- Next.js App Router + Prisma + PostgreSQL + NextAuth
- Rôles : user / seller / admin
- Middleware protège dashboard, seller, admin
- Dashboard user : devenir vendeur
- Dashboard admin : valider vendeurs
- Dashboard seller : produits, boosts, settings
- CRUD produits complet (create/update/delete)
- À venir : upload images, catégories, page produit publique, panier, commandes, boosts avancés
