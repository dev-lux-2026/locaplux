"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";

export default function LoginPage() {
  const router = useRouter();
  const { locale } = useParams(); // ← locale dynamique

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true);

    const res = await signIn("credentials", {
      email: form.email,
      password: form.password,
      redirect: false,
    });

    setLoading(false);

    // 🚫 Email non vérifié
    if (res?.error === "EMAIL_NOT_VERIFIED") {
      toast.error("Veuillez vérifier votre email avant de vous connecter.");
      router.push(`/${locale}/register/check-email`); // ← localisé
      return;
    }

    // ❌ Mauvais identifiants
    if (res?.error) {
      toast.error("Identifiants incorrects");
      return;
    }

    // ✔ Connexion OK
    router.push(`/${locale}/home`); // ← localisé
  };

  return (
    <div className="max-w-md mx-auto py-12 px-4">
      <h1 className="text-3xl font-semibold text-gray-900">
        Connexion
      </h1>

      <p className="text-gray-700 mt-2 text-[15px] leading-relaxed">
        Connectez‑vous pour accéder à votre espace Locaplux.
      </p>

      <form onSubmit={handleSubmit} className="mt-10 flex flex-col gap-6">

        {/* Email */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Adresse email
          </label>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2"
            required
          />
        </div>

        {/* Mot de passe */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Mot de passe
          </label>

          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={form.password}
              onChange={handleChange}
              className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2 pr-10"
              required
            />

            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
            >
              {showPassword ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none"
                  viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M13.875 18.825A10.05 10.05 0 0112 19c-5.523 0-10-4.477-10-10 0-1.02.152-2.005.438-2.93m3.12-3.12A9.956 9.956 0 0112 3c5.523 0 10 4.477 10 10 0 1.02-.152 2.005-.438 2.93m-3.12 3.12L4.5 4.5" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none"
                  viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-1.274 4.057-5.065 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Bouton */}
        <button
          type="submit"
          disabled={loading}
          className="px-6 py-3 bg-black text-white rounded-md hover:bg-gray-900 transition text-sm"
        >
          {loading ? "Connexion..." : "Se connecter"}
        </button>

      </form>

      <p className="text-[14px] text-gray-600 mt-6">
        Pas encore de compte ?{" "}
        <Link href={`/${locale}/register`} className="text-black underline">
          Créer un compte
        </Link>
      </p>
    </div>
  );
}
