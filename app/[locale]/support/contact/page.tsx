"use client";

import { useState } from "react";

export default function SupportContactPage() {
  const [form, setForm] = useState({
    email: "",
    subject: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/support/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      setLoading(false);

      if (!res.ok) {
        if (res.status === 400 && data.details) {
          const fieldErrors = data.details.fieldErrors;

          if (fieldErrors.email) {
            setError("Adresse email invalide.");
          } else if (fieldErrors.subject) {
            setError("Le sujet doit contenir au moins 3 caractères.");
          } else if (fieldErrors.message) {
            setError("Le message doit contenir au moins 10 caractères.");
          } else {
            setError("Données invalides.");
          }

          return;
        }

        setError("Erreur lors de l’envoi du message.");
        return;
      }

      alert("Votre message a été envoyé. Nous vous répondrons rapidement.");

      setTimeout(() => {
        window.location.href = "/register/partner";
      }, 2000);

      setForm({ email: "", subject: "", message: "" });

    } catch (err) {
      setLoading(false);
      setError("Erreur réseau. Vérifiez votre connexion.");
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0B0B0C] py-12 px-4">
      <div className="max-w-xl mx-auto space-y-8">

        <header className="space-y-2">
          <h1 className="text-3xl font-semibold text-gray-900 dark:text-white">
            Contacter le support
          </h1>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Notre équipe vous répond généralement sous 24 heures.
          </p>
        </header>

        <form
          onSubmit={handleSubmit}
          className="space-y-6 bg-white dark:bg-[#0F0F10] border border-gray-200 dark:border-white/10 rounded-2xl p-6 shadow-sm"
        >
          {error && (
            <p className="text-red-500 text-sm font-medium">{error}</p>
          )}

          <div>
            <label className="block text-sm mb-1">Votre email</label>
            <input
              type="email"
              required
              className="w-full border rounded px-3 py-2 dark:bg-[#18181A]"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm mb-1">Sujet</label>
            <input
              type="text"
              required
              className="w-full border rounded px-3 py-2 dark:bg-[#18181A]"
              value={form.subject}
              onChange={(e) => setForm({ ...form, subject: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm mb-1">Message</label>
            <textarea
              required
              rows={5}
              className="w-full border rounded px-3 py-2 dark:bg-[#18181A]"
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full px-4 py-3 bg-black text-white dark:bg-white dark:text-black rounded-lg text-sm font-medium hover:bg-gray-900 dark:hover:bg-gray-200 transition"
          >
            {loading ? "Envoi..." : "Envoyer le message"}
          </button>
        </form>

      </div>
    </div>
  );
}
