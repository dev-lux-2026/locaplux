"use client";

import { useState, useEffect, Suspense } from "react";
import { signIn, getSession } from "next-auth/react";
import { useRouter, useParams, useSearchParams } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";

function LoginContent() {
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  const locale = params?.locale || "fr";

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  // Écoute des notifications de succès (ex: validation de l'email)
  useEffect(() => {
    const verified = searchParams.get("verified");
    const emailParam = searchParams.get("email");

    if (verified === "true") {
      toast.success("Votre adresse e-mail a été validée avec succès ! Vous pouvez maintenant vous connecter.");
    }
    
    if (emailParam) {
      setForm((prev) => ({ ...prev, email: decodeURIComponent(emailParam) }));
    }
  }, [searchParams]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await signIn("credentials", {
        email: form.email,
        password: form.password,
        redirect: false,
      });

      console.log("=== 🔬 DIAGNOSTIC CONNEXION BRUT ===", res);

      // 🚫 Cas 1 : Email non vérifié
      if (res?.error === "EMAIL_NOT_VERIFIED") {
        setLoading(false);
        toast.error("Veuillez vérifier votre email avant de vous connecter.");
        router.push(`/${locale}/register/check-email`);
        return;
      }

      // ❌ Cas 2 : Identifiants incorrects (CredentialsSignin)
      if (res?.error === "CredentialsSignin" || res?.status === 401) {
        setLoading(false);
        toast.error("Adresse email ou mot de passe incorrect.");
        return;
      }

      // ⚠️ Cas 3 : Autre erreur retournée par Next-Auth
      if (res?.error) {
        setLoading(false);
        toast.error(`Erreur de connexion : ${res.error}`);
        return;
      }

      // ⚠️ Cas 4 : Pas d'erreur explicite mais échec réseau/statut non valide
      if (res && !res.ok) {
        setLoading(false);
        toast.error(`Une erreur est survenue (Code ${res.status}).`);
        return;
      }

      // ✔ Cas 5 : Tout est OK, authentification réussie
      toast.success("Authentification réussie !");
      
      // Récupération de la session à jour pour aiguiller la redirection
      const session = await getSession();
      const user = session?.user as any;

      setLoading(false);

      // Si l'utilisateur a déjà configuré son profil, on l'envoie sur son espace
      if (user?.firstName && user?.lastName && user?.address) {
        router.push(`/${locale}/account/profile`);
      } else {
        // Sinon, redirection vers l'onboarding pour compléter les données manquantes
        router.push(`/${locale}/account/onboarding/address`);
      }

    } catch (err: any) {
      setLoading(false);
      console.error("🔴 CRASH COMPLET DU COMPOSANT :", err);
      toast.error("Une erreur technique est survenue. Veuillez réessayer.");
    }
  };

  return (
    <div className="max-w-md mx-auto py-12 px-4">
      <h1 className="text-3xl font-semibold text-gray-900">Connexion</h1>
      <p className="text-gray-700 mt-2 text-[15px] leading-relaxed">
        Connectez‑vous pour accéder à votre espace Locaplux (Mode Diagnostic).
      </p>

      <form onSubmit={handleSubmit} className="mt-10 flex flex-col gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">Adresse email</label>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2 text-black bg-white"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Mot de passe</label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={form.password}
              onChange={handleChange}
              className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2 pr-10 text-black bg-white"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
            >
              {showPassword ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-5.523 0-10-4.477-10-10 0-1.02.152-2.005.438-2.93m3.12-3.12A9.956 9.956 0 0112 3c5.523 0 10 4.477 10 10 0 1.02-.152 2.005-.438 2.93m-3.12 3.12L4.5 4.5" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-1.274 4.057-5.065 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              )}
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="px-6 py-3 bg-black text-white rounded-md hover:bg-gray-900 transition text-sm font-medium"
        >
          {loading ? "Vérification..." : "Se connecter"}
        </button>
      </form>

      <p className="text-[14px] text-gray-600 mt-6">
        Pas encore de compte ?{" "}
        <Link href={`/${locale}/register`} className="text-black underline">Créer un compte</Link>
      </p>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="text-center py-12">Chargement...</div>}>
      <LoginContent />
    </Suspense>
  );
}
