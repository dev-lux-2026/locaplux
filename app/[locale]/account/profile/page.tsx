"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useParams } from "next/navigation";
import toast from "react-hot-toast";

export default function ProfilePage() {
  const { data: session, update } = useSession();
  const user = session?.user as any;
  const params = useParams();
  const locale = params?.locale || "fr";

  // États pour la gestion du mode édition en ligne (Style Marketplace)
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  
  // Structure des données alignée avec Supabase & Prisma
  const [formData, setFormData] = useState({
    phone: "",
    address: "",
    postal: "",
    city: "",
    country: "France",
    shippingAddress: "",
    shippingPostal: "",
    shippingCity: "",
    shippingCountry: "France",
  });

 // Synchronisation des données de session dès que l'utilisateur est connecté
  useEffect(() => {
    if (user) {
      setFormData({
        phone: user.phone || "",
        // ✨ Combine le numéro et la rue si ton formulaire a un champ unique "address", 
        // ou sépare-les si tu as des champs distincts.
        address: user.street || user.address || "", 
        number: user.number || "", // ✨ Ajoute le champ number ici s'il fait partie de ton state
        postal: user.postal || "",
        city: user.city || "",
        country: user.country || "Luxembourg",
        shippingAddress: user.shippingAddress || "",
        shippingPostal: user.shippingPostal || "",
        shippingCity: user.shippingCity || "",
        shippingCountry: user.shippingCountry || "Luxembourg",
      });
    }
  }, [user]);

  // Déterminer le statut affiché
  const displayStatus =
    user?.role === "partner"
      ? "Partenaire Locaplux"
      : "Acheteur Locaplux";

  // Détection stricte et professionnelle d'un profil incomplet
  const isProfileIncomplete = !user?.firstName || !user?.lastName || !user?.address;

  // Reconstruction propre du nom affiché à partir des deux colonnes distinctes
  const fullName = user?.firstName && user?.lastName 
    ? `${user.firstName} ${user.lastName}` 
    : user?.name;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // 🚀 1. Sauvegarde étanche en Base de données (Supabase via l'API Prisma)
      const res = await fetch(`/api/account/update-profile`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        throw new Error("Erreur lors de la sauvegarde côté serveur");
      }

      // 🔄 2. Rafraîchissement à chaud du cookie NextAuth (évite d'avoir à se reconnecter)
      await update({
        ...session,
        user: {
          ...session?.user,
          ...formData,
        }
      });

      toast.success("Vos coordonnées ont été enregistrées avec succès !");
      setIsEditing(false);
    } catch (err) {
      console.error("🔴 Erreur sauvegarde profil :", err);
      toast.error("Une erreur est survenue lors de la sauvegarde.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto py-12 px-4">
      {/* Bandeau d'invite officiel si les informations du compte ne sont pas finalisées */}
      {isProfileIncomplete && !isEditing && (
        <div className="mb-8 p-4 bg-amber-50 border border-amber-200 rounded-xl flex items-center justify-between text-amber-900 text-sm">
          <div className="flex items-center gap-2">
            <span>⚠️</span>
            <p>
              <strong>Votre profil n'est pas complètement configuré.</strong> Veuillez finaliser vos informations personnelles pour accéder à l'ensemble des services Locaplux.
            </p>
          </div>
          <Link 
            href={`/${locale}/account/onboarding/address`} 
            className="px-4 py-1.5 bg-amber-600 text-white rounded-lg font-medium hover:bg-amber-700 transition text-[13px] whitespace-nowrap"
          >
            Finaliser mon profil
          </Link>
        </div>
      )}

      <div className="flex justify-between items-center border-b border-gray-100 pb-4">
        <div>
          <h1 className="text-3xl font-semibold text-gray-900">Mon profil</h1>
          <p className="text-gray-700 mt-2 text-[15px]">
            Retrouvez ici vos informations personnelles et votre activité sur Locaplux.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href={`/${locale}`}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition text-sm flex items-center gap-1"
          >
            🏠 Accueil
          </Link>
          {!isEditing && (
            <button
              onClick={() => setIsEditing(true)}
              className="px-4 py-2 bg-black text-white rounded-lg font-medium hover:bg-gray-800 transition text-sm"
            >
              ✏️ Modifier
            </button>
          )}
        </div>
      </div>

      {isEditing ? (
        /* ======================== MODE ÉDITION IN-PLACE ======================== */
        <form onSubmit={handleSave} className="mt-10 flex flex-col gap-6">
          <div>
            <p className="text-sm text-gray-500 mb-1">Nom & Prénom (Sécurisé - Non Modifiable)</p>
            <input
              type="text"
              value={fullName || "Non renseigné"}
              disabled
              className="w-full border border-gray-200 bg-gray-50 text-gray-500 rounded-md px-3 py-2 text-[15px] cursor-not-allowed"
            />
          </div>

          <div>
            <p className="text-sm text-gray-500 mb-1">Email (Lié au compte)</p>
            <input
              type="text"
              value={user?.email || ""}
              disabled
              className="w-full border border-gray-200 bg-gray-50 text-gray-500 rounded-md px-3 py-2 text-[15px] cursor-not-allowed"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-500 mb-1">Téléphone</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="w-full border border-gray-300 bg-white text-black rounded-md px-3 py-2 text-[15px] focus:ring-1 focus:ring-black focus:outline-none"
              placeholder="+33 6 00 00 00 00"
            />
          </div>

          <div className="p-4 bg-gray-50 rounded-xl border border-gray-200 space-y-4">
            <p className="text-sm font-semibold text-gray-900">📦 Adresse de livraison spécifique</p>
            <div>
              <label className="block text-xs text-gray-500 mb-1">Rue et numéro (Livraison)</label>
              <input
                type="text"
                name="shippingAddress"
                value={formData.shippingAddress}
                onChange={handleChange}
                className="w-full border border-gray-300 bg-white text-black rounded-md px-3 py-2 text-sm focus:ring-1 focus:ring-black focus:outline-none"
                placeholder="Laisser vide si identique à la facturation"
              />
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div className="col-span-1">
                <label className="block text-xs text-gray-500 mb-1">Code postal</label>
                <input
                  type="text"
                  name="shippingPostal"
                  value={formData.shippingPostal}
                  onChange={handleChange}
                  className="w-full border border-gray-300 bg-white text-black rounded-md px-3 py-2 text-sm focus:ring-1 focus:ring-black focus:outline-none"
                />
              </div>
              <div className="col-span-1">
                <label className="block text-xs text-gray-500 mb-1">Ville</label>
                <input
                  type="text"
                  name="shippingCity"
                  value={formData.shippingCity}
                  onChange={handleChange}
                  className="w-full border border-gray-300 bg-white text-black rounded-md px-3 py-2 text-sm focus:ring-1 focus:ring-black focus:outline-none"
                />
              </div>
              <div className="col-span-1">
                <label className="block text-xs text-gray-500 mb-1">Pays</label>
                <input
                  type="text"
                  name="shippingCountry"
                  value={formData.shippingCountry}
                  onChange={handleChange}
                  className="w-full border border-gray-300 bg-white text-black rounded-md px-3 py-2 text-sm focus:ring-1 focus:ring-black focus:outline-none"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t">
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              disabled={loading}
              className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-md font-medium text-sm hover:bg-gray-50 transition"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-black text-white rounded-md font-medium text-sm hover:bg-gray-900 transition"
            >
              {loading ? "Enregistrement..." : "Sauvegarder"}
            </button>
          </div>
        </form>
      ) : (
        /* ======================== MODE LECTURE D'ORIGINE ENRICHI ======================== */
        <div className="mt-10 flex flex-col gap-6">
          <div>
            <p className="text-sm text-gray-500">Nom & Prénom</p>
            <p className="text-lg font-medium">{fullName || "Non renseigné"}</p>
          </div>

          <div>
            <p className="text-sm text-gray-500">Email</p>
            <p className="text-lg font-medium">{user?.email}</p>
          </div>

          <div>
            <p className="text-sm text-gray-500">Téléphone</p>
            <p className="text-lg font-medium">{user?.phone || "Non renseigné"}</p>
          </div>

          <div>
            <p className="text-sm text-gray-500">Statut</p>
            <p className="text-lg font-medium">{displayStatus}</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-6 border-t">
            <div className="p-4 bg-gray-50 border border-gray-200 rounded-xl">
              <p className="text-xs font-semibold uppercase text-gray-400 tracking-wider">🏠 Adresse principale / de facturation</p>
              {user?.address ? (
                <p className="text-[15px] text-gray-800 mt-2 leading-relaxed">
                  {user.address}<br />
                  {user.postal} {user.city}<br />
                  <span className="text-xs font-medium text-gray-500">{user.country || "France"}</span>
                </p>
              ) : (
                <p className="text-[14px] text-gray-400 italic mt-2">Aucune adresse enregistrée.</p>
              )}
            </div>

            <div className="p-4 bg-gray-50 border border-gray-200 rounded-xl">
              <p className="text-xs font-semibold uppercase text-gray-400 tracking-wider">📦 Adresse de livraison spécifique</p>
              {user?.shippingAddress ? (
                <p className="text-[15px] text-gray-800 mt-2 leading-relaxed">
                  {user.shippingAddress}<br />
                  {user.shippingPostal} {user.shippingCity}<br />
                  <span className="text-xs font-medium text-gray-500">{user.shippingCountry || "France"}</span>
                </p>
              ) : user?.address ? (
                <p className="text-[14px] text-gray-500 italic mt-2">Identique à l'adresse de facturation.</p>
              ) : (
                <p className="text-[14px] text-gray-400 italic mt-2">Aucune adresse de livraison renseignée.</p>
              )}
            </div>
          </div>
          {user?.role === "partner" && (
            <div className="pt-6 border-t">
              <p className="text-sm text-gray-500">Partenaire</p>
              <p className="text-[15px] text-gray-700 mt-1">
                Votre compte partenaire est actif. Vous pouvez gérer vos produits,
                vos commandes et vos informations professionnelles.
              </p>
            </div>
          )}

          {user?.role === "partner" && (
            <div className="pt-6 border-t">
              <p className="text-sm text-gray-500">Partenaire</p>
              <p className="text-[15px] text-gray-700 mt-1">
                Votre compte partenaire est actif. Vous pouvez gérer vos produits,
                vos commandes et vos informations professionnelles.
              </p>
            </div>
          )}

          {user?.role !== "partner" && (
            <div className="pt-6 border-t">
              <p className="text-sm text-gray-500">Partenaires</p>
              <p className="text-[15px] text-gray-700 mt-1">
                Vous achetez exclusivement auprès de partenaires professionnels,
                reconnus et vérifiés.
              </p>
            </div>
          )}
        </div>
      )}

      {/* --- BLOC AVATAR AUTOMATIQUE (INITIALE UNIQUEMENT) --- */}
      <div className="mt-12 pt-8 border-t border-gray-100 text-center flex flex-col items-center justify-center">
        <div className="w-24 h-24 bg-gradient-to-tr from-black to-gray-700 text-white font-bold flex items-center justify-center rounded-full text-3xl uppercase shadow-md border-4 border-white ring-2 ring-gray-100">
          {user?.firstName?.charAt(0) || user?.name?.charAt(0) || "U"}
        </div>
        <h3 className="font-semibold text-gray-900 mt-4 text-xl">{fullName}</h3>
        <p className="text-xs text-gray-400 font-bold mt-1 tracking-wide uppercase">
          {displayStatus}
        </p>
      </div>
    </div>
  );
}
