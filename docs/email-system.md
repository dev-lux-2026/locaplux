Documentation interne Locaplux — Système Email Premium
(Version officielle — à partager à ton équipe)

1. 🎯 Objectif du système email
Le système email Locaplux a été conçu pour être :

Premium (template unique, branding cohérent, logo Base64)

Maintenable (aucune duplication, structure claire)

Scalable (ajout d’emails simple et rapide)

Sécurisé (API isolées, logique centralisée)

Compatible Next.js App Router

Il remplace totalement l’ancien système basé sur sendEmail.ts et les anciens templates HTML.

2. 🧱 Architecture générale
📁 Templates React
Tous les templates sont dans :

Code
/lib/emails/
Exemples :

/partner/partnerRegistration.tsx

/order/orderShipped.tsx

/product/productApproved.tsx

/alerts/sendVatCheckFailed.ts

📁 Moteur d’envoi
Un seul moteur :

Code
/lib/emails/sendTemplatedEmail.ts
Il applique :

le template premium

le logo Base64

le style unifié

l’envoi via Resend

📁 Fonctions d’envoi
Chaque catégorie a son fichier :

Code
/lib/emails/partner/sendPartnerEmails.ts
/lib/emails/order/sendOrderEmails.ts
/lib/emails/product/sendProductEmails.ts
/lib/emails/alerts/sendAlertEmails.ts
📁 API Routes
Toutes les API emails sont regroupées ici :

Code
/app/api/emails/
Exemples :

Code
/emails/partner/registration
/emails/order/shipped
/emails/product/rejected
/emails/alerts/vat-check-failed
3. 🚀 Comment envoyer un email
Depuis une API, un admin, un workflow ou une action serveur :
ts
await sendPartnerKycApprovedEmail(partner.email, partner.name);
Autres exemples :

ts
await sendOrderShippedEmail(user.email, order.id, trackingNumber);
await sendProductRejectedEmail(partner.email, product.id, reason);
await sendVatCheckFailedEmail(adminEmail, vatNumber, companyName);
4. 🧪 Comment tester un email
1) Appeler directement la fonction d’envoi :
ts
await sendOrderNewEmail("test@locaplux.com", "ORDER123");
2) Appeler l’API correspondante :
Code
POST http://localhost:3000/api/emails/order/new
{
  "to": "test@locaplux.com",
  "orderId": "ORDER123"
}
3) Vérifier dans Resend
→ Dashboard → Logs

5. 🛠 Comment ajouter un nouvel email (procédure officielle)
Étape 1 — Créer le template React
Dans :

Code
/lib/emails/<category>/<NewEmail>.tsx
Étape 2 — Ajouter la fonction d’envoi
Dans :

Code
/lib/emails/<category>/send<Category>Emails.ts
Étape 3 — Créer l’API
Dans :

Code
/app/api/emails/<category>/<new-email>/route.ts
Étape 4 — Tester via Postman / Thunder Client
Étape 5 — Intégrer dans l’admin ou le workflow
6. 🧹 Bonnes pratiques Locaplux
Ne jamais créer d’email HTML brut → toujours un template React

Ne jamais dupliquer un template → tout passe par emailTemplate.tsx

Ne jamais appeler Resend directement → toujours sendTemplatedEmail()

Ne jamais créer d’API email ailleurs que dans /api/emails

Ne jamais modifier le logo Base64 sans validation branding

Ne jamais mélanger logique métier et envoi d’email

7. 🛡 Maintenance & évolutivité
Le système est conçu pour :

ajouter un email en moins de 2 minutes

garantir un style 100% cohérent

éviter les erreurs humaines

permettre à n’importe quel dev de comprendre la structure

isoler les emails du reste du code