"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";

export default function CapturePage() {
  const params = useSearchParams();
  const session = params.get("session");
  const router = useRouter();

  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /* ------------------------------------------------------ */
  /* REDIRECT IF NO SESSION                                 */
  /* ------------------------------------------------------ */
  useEffect(() => {
    if (!session) {
      setError("Session invalide.");
    }
  }, [session]);

  async function handleCapture(e: any) {
    const file = e.target.files?.[0];
    if (!file || !session) return;

    setUploading(true);

    try {
      const fd = new FormData();
      fd.append("file", file);
      fd.append("session", session);

      const res = await fetch("/api/partner/products/mobile-upload", {
        method: "POST",
        body: fd,
      });

      if (!res.ok) {
        setError("Erreur lors de l’envoi de la photo.");
        setUploading(false);
        return;
      }

      router.push("/partner/products/capture/success");
    } catch (err) {
      setError("Erreur réseau.");
    }

    setUploading(false);
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 bg-gray-50 dark:bg-[#0B0B0C] text-center">
      <h1 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
        Prendre une photo
      </h1>

      <p className="text-sm text-gray-600 dark:text-gray-400 mb-6 max-w-sm">
        Prenez une photo du produit avec votre téléphone. Elle sera envoyée
        automatiquement vers votre interface partenaire.
      </p>

      {/* INPUT FILE */}
      <input
        type="file"
        accept="image/*"
        capture="environment"
        onChange={handleCapture}
        className="w-full max-w-xs text-sm"
      />

      {uploading && (
        <p className="mt-4 text-gray-600 dark:text-gray-400">
          Envoi en cours…
        </p>
      )}

      {error && (
        <p className="mt-4 text-red-600 dark:text-red-400 text-sm">{error}</p>
      )}

      {/* RETOUR */}
      <button
        onClick={() => router.back()}
        className="mt-8 px-5 py-2.5 bg-black dark:bg-white text-white dark:text-black rounded-xl text-sm font-medium hover:bg-gray-900 dark:hover:bg-gray-200 transition"
      >
        Retour
      </button>
    </div>
  );
}
