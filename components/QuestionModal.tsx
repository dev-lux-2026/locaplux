"use client";

import { useState } from "react";

export default function QuestionModal({ productId, onClose }) {
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const sendQuestion = async () => {
    if (!message.trim()) {
      setError("Veuillez écrire un message.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/questions/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId, message }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Erreur lors de l’envoi.");
        setLoading(false);
        return;
      }

      setSuccess(true);

      setTimeout(() => {
        onClose();
      }, 1500);
    } catch (err) {
      setError("Erreur serveur.");
    }

    setLoading(false);
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-xl">
        {!success ? (
          <>
            <h2 className="text-xl font-semibold mb-4 text-[#1A3A5F]">
              Poser une question
            </h2>

            <textarea
              className="w-full h-32 border rounded-lg p-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#1A3A5F]"
              placeholder="Votre question sur ce produit..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />

            {error && (
              <p className="text-red-600 text-sm mt-2">{error}</p>
            )}

            <div className="flex justify-end gap-3 mt-4">
              <button
                onClick={onClose}
                className="px-4 py-2 rounded-lg border"
              >
                Annuler
              </button>

              <button
                onClick={sendQuestion}
                disabled={loading}
                className="px-4 py-2 rounded-lg bg-[#1A3A5F] text-white hover:bg-[#16314f] transition"
              >
                {loading ? "Envoi..." : "Envoyer"}
              </button>
            </div>
          </>
        ) : (
          <div className="text-center py-6">
            <p className="text-green-600 font-medium">
              Votre question a été envoyée !
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
