"use client";

import { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import toast from "react-hot-toast";

export default function ChangeEmailPage() {
  const router = useRouter();
  const { locale } = useParams(); // ← locale dynamique (fr, en, lu)

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);

    const res = await fetch("/api/auth/change-email", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });

    setLoading(false);

    if (!res.ok) {
      toast.error("Impossible de modifier l'email");
      return;
    }

    toast.success("Email mis à jour. Vérifiez votre boîte mail.");

    // 🔥 Redirection localisée
    router.push(`/${locale}/register/check-email`);
  }

  return (
    <div className="max-w-md mx-auto py-20">
      <h1 className="text-3xl font-bold mb-4">Modifier votre email</h1>

      <p className="text-gray-600 mb-6">
        Entrez une nouvelle adresse email. Nous vous enverrons un nouveau lien de validation.
      </p>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Nouvelle adresse email
          </label>
          <input
            type="email"
            className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-black text-white py-3 rounded-md hover:bg-gray-900 transition"
        >
          {loading ? "Envoi..." : "Mettre à jour l'email"}
        </button>
      </form>
    </div>
  );
}
