"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter, useParams } from "next/navigation";
import { signIn } from "next-auth/react";
import { PasswordField } from "@/components/auth/PasswordField";

export default function CreatePasswordPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { locale } = useParams(); // ← locale dynamique (fr, en, lu)

  const token = searchParams.get("token") || "";

  const [status, setStatus] = useState<"loading" | "invalid" | "expired" | "ok">(
    "loading"
  );

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");

  // Vérification du token
  useEffect(() => {
    if (!token || token.trim() === "") {
      setStatus("invalid");
      return;
    }

    async function checkToken() {
      try {
        const res = await fetch("/api/auth/validate-token?token=" + token);
        const data = await res.json();

        if (data.valid) {
          setStatus("ok");
        } else if (data.reason === "expired") {
          setStatus("expired");
        } else {
          setStatus("invalid");
        }
      } catch (err) {
        setStatus("invalid");
      }
    }

    checkToken();
  }, [token]);

  // Soumission du formulaire
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (password !== confirm) {
      setError("Les mots de passe ne correspondent pas.");
      return;
    }

    const res = await fetch("/api/auth/create-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token, password }),
    });

    const data = await res.json();

    if (!data.success) {
      setError(data.message || "Une erreur est survenue.");
      return;
    }

    const email = data.email;

    // Connexion automatique + redirection localisée
    await signIn("credentials", {
      redirect: true,
      email,
      password,
      callbackUrl: `/${locale}/partner/dashboard`, // ← localisé
    });
  }

  // ÉTATS SPÉCIAUX
  if (status === "loading") {
    return <p className="text-center mt-10">Chargement…</p>;
  }

  if (status === "invalid") {
    return (
      <div className="max-w-md mx-auto mt-20 text-center">
        <h1 className="text-xl font-semibold mb-4">Lien invalide</h1>
        <p>Ce lien n’est pas valide. Veuillez contacter le support.</p>
      </div>
    );
  }

  if (status === "expired") {
    return (
      <div className="max-w-md mx-auto mt-20 text-center">
        <h1 className="text-xl font-semibold mb-4">Lien expiré</h1>
        <p>
          Votre lien a expiré. Un nouveau lien vient de vous être envoyé
          automatiquement.
        </p>
      </div>
    );
  }

  // FORMULAIRE PRINCIPAL
  return (
    <div className="max-w-md mx-auto mt-20">
      <h1 className="text-2xl font-semibold mb-6 text-center">
        Créer votre mot de passe
      </h1>

      <form onSubmit={handleSubmit} className="space-y-5">
        <PasswordField value={password} onChange={setPassword} />

        <div>
          <label className="block mb-1 font-medium">
            Confirmer le mot de passe
          </label>
          <input
            type="password"
            className="w-full border rounded px-3 py-2"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            required
          />
        </div>

        {error && <p className="text-red-600 text-sm">{error}</p>}

        <button
          type="submit"
          className="w-full bg-black text-white py-2 rounded font-semibold hover:bg-gray-900"
        >
          Valider
        </button>
      </form>
    </div>
  );
}
