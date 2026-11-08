"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";

export default function ForgotPasswordPage() {
  const params = useParams();
  const locale = params?.locale || "fr";

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Une erreur est survenue.");
      }

      setSubmitted(true);
      toast.success("Instructions envoyées par e-mail !");
    } catch (err: any) {
      toast.error(err.message || "Impossible d'envoyer l'e-mail.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto py-12 px-4">
      <h1 className="text-3xl font-semibold text-gray-900">Mot de passe oublié</h1>
      <p className="text-gray-700 mt-2 text-[15px] leading-relaxed">
        Entrez votre adresse e-mail pour recevoir les instructions de réinitialisation.
      </p>

      {submitted ? (
        <div className="mt-8 p-4 bg-green-50 border border-green-200 rounded-md text-green-800 text-sm">
          Si un compte est associé à cette adresse e-mail, vous recevrez un lien de réinitialisation sous peu. Pensez à vérifier vos spams.
          <div className="mt-4">
            <Link href={`/${locale}/login`} className="font-medium underline text-green-900">
              Retour à la connexion
            </Link>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="mt-10 flex flex-col gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">Adresse email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2 text-black bg-white"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="px-6 py-3 bg-black text-white rounded-md hover:bg-gray-900 transition text-sm font-medium"
          >
            {loading ? "Envoi en cours..." : "Envoyer les instructions"}
          </button>

          <div className="text-center">
            <Link href={`/${locale}/login`} className="text-sm text-gray-600 hover:text-black underline">
              Retour à la connexion
            </Link>
          </div>
        </form>
      )}
    </div>
  );
}