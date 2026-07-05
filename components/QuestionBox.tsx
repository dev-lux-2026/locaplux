"use client";

import { useState } from "react";
import { detectForbiddenContent } from "@/utils/messageFilterClient";

export default function QuestionBox({
  productId,
  unlocked,
}: {
  productId: string;
  unlocked: boolean;
}) {
  const [message, setMessage] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [error, setError] = useState("");
  const [sending, setSending] = useState(false);
  const [success, setSuccess] = useState(false);

  function handleMessageChange(e: any) {
    const text = e.target.value;
    setMessage(text);

    if (!unlocked && detectForbiddenContent(text)) {
      setError(
        "Certaines informations (email, numéro, adresse…) ne peuvent pas être envoyées avant la livraison."
      );
    } else {
      setError("");
    }
  }

  function handleFileChange(e: any) {
    if (!unlocked) {
      setError("Les fichiers ne peuvent être envoyés qu’après la livraison.");
      return;
    }

    setFiles(Array.from(e.target.files));
  }

  async function send() {
    if (!message.trim()) {
      setError("Veuillez écrire un message.");
      return;
    }

    if (!unlocked && detectForbiddenContent(message)) {
      setError(
        "Votre message contient des informations interdites avant la livraison."
      );
      return;
    }

    setSending(true);

    const form = new FormData();
    form.append("productId", productId);
    form.append("message", message);

    if (unlocked) {
      files.forEach((f) => form.append("files", f));
    }

    const res = await fetch("/api/questions/send", {
      method: "POST",
      body: form,
    });

    const data = await res.json();
    setSending(false);

    if (data.error) {
      setError(data.error);
      return;
    }

    setSuccess(true);
    setMessage("");
    setFiles([]);
  }

  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm space-y-4">
      <h2 className="text-xl font-semibold">Poser une question</h2>

      {success && (
        <p className="text-green-700 bg-green-100 p-3 rounded-lg">
          Votre message a bien été envoyé.
        </p>
      )}

      <textarea
        className="w-full border border-gray-300 rounded-xl p-3 h-32"
        placeholder="Votre question…"
        value={message}
        onChange={handleMessageChange}
      />

      {error && <p className="text-red-600 text-sm">{error}</p>}

      {unlocked ? (
        <input
          type="file"
          multiple
          onChange={handleFileChange}
          className="text-sm"
        />
      ) : (
        <p className="text-gray-500 text-sm">
          Les fichiers seront disponibles après la livraison.
        </p>
      )}

      <button
        onClick={send}
        disabled={sending || (!!error && !unlocked)}
        className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-900 disabled:opacity-50"
      >
        {sending ? "Envoi…" : "Envoyer"}
      </button>
    </div>
  );
}
