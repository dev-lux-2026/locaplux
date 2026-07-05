"use client";

import { useEffect, useState, useRef } from "react";
import { useParams } from "next/navigation";
import MessageSkeleton from "@/components/ui/MessageSkeleton";

type Message = {
  id: string;
  text: string | null;
  image: string | null;
  createdAt: string;
  read: boolean;
  sender: {
    id: string;
    publicName: string | null;
    name: string | null;
  };
};

type Conversation = {
  id: string;
  order: { id: string };
  messages: Message[];
};

export default function PartnerConversationPage() {
  const { conversationId } = useParams();

  const [conversation, setConversation] = useState<Conversation | null>(null);
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [uploading, setUploading] = useState(false);

  const bottomRef = useRef<HTMLDivElement>(null);

  // Charger conversation + marquer comme lu
  const load = async () => {
    const res = await fetch(`/api/messages/${conversationId}`);
    if (!res.ok) return;

    const data = await res.json();
    setConversation(data);

    await fetch("/api/messages/read", {
      method: "POST",
      body: JSON.stringify({ conversationId }),
      headers: { "Content-Type": "application/json" },
    });

    setTimeout(() => {
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 50);
  };

  useEffect(() => {
    if (conversationId) load();
  }, [conversationId]);

  // Envoi message texte
  const onSend = async () => {
    if (!message.trim()) return;

    setSending(true);

    const res = await fetch("/api/messages/create", {
      method: "POST",
      body: JSON.stringify({ conversationId, text: message }),
      headers: { "Content-Type": "application/json" },
    });

    setSending(false);

    if (res.ok) {
      setMessage("");
      await load();
    }
  };

  // Upload image
  const onUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);

    const formData = new FormData();
    formData.append("file", file);

    const uploadRes = await fetch("/api/messages/upload", {
      method: "POST",
      body: formData,
    });

    setUploading(false);

    if (!uploadRes.ok) return;

    const { url } = await uploadRes.json();

    const res = await fetch("/api/messages/create", {
      method: "POST",
      body: JSON.stringify({ conversationId, image: url }),
      headers: { "Content-Type": "application/json" },
    });

    if (res.ok) {
      await load();
    }

    e.target.value = "";
  };

  /* -----------------------------------
     🔥 SKELETON PREMIUM
  ----------------------------------- */
  if (!conversation) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-[#0B0B0C]">
        <div className="max-w-3xl mx-auto py-10 px-4 space-y-4">
          {Array.from({ length: 10 }).map((_, i) => (
            <MessageSkeleton key={i} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0B0B0C] flex flex-col">

      {/* HEADER */}
      <div className="p-6 border-b border-gray-200 dark:border-white/10 bg-white dark:bg-[#0F0F10] shadow-sm">
        <p className="text-xs font-medium tracking-[0.2em] text-gray-500 dark:text-gray-400 uppercase">
          Locaplux • Messages
        </p>

        <h1 className="mt-2 text-3xl font-semibold text-gray-900 dark:text-white">
          Conversation client
        </h1>

        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
          Commande #{conversation.order.id}
        </p>
      </div>

      {/* MESSAGES */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-gray-50 dark:bg-[#0B0B0C]">
        {conversation.messages.map((m) => {
          const isMe = m.sender.id === "partner";

          return (
            <div
              key={m.id}
              className={`flex flex-col ${
                isMe ? "items-end text-right" : "items-start text-left"
              }`}
            >
              {/* Auteur + date */}
              <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                {m.sender.publicName || m.sender.name || "Utilisateur"} •{" "}
                {new Date(m.createdAt).toLocaleString("fr-FR")}
              </div>

              {/* Message texte */}
              {m.text && (
                <div
                  className={`px-4 py-2 rounded-2xl shadow-sm max-w-xs text-sm leading-relaxed ${
                    isMe
                      ? "bg-black text-white rounded-br-none"
                      : "bg-white dark:bg-[#1A1A1C] text-gray-800 dark:text-gray-200 rounded-bl-none border border-gray-200 dark:border-white/10"
                  }`}
                >
                  {m.text}
                </div>
              )}

              {/* Image */}
              {m.image && (
                <img
                  src={m.image}
                  alt="Pièce jointe"
                  className="mt-2 max-w-xs rounded-xl border border-gray-200 dark:border-white/10 shadow-sm"
                />
              )}
            </div>
          );
        })}

        <div ref={bottomRef} />
      </div>

      {/* INPUT */}
      <div className="border-t border-gray-200 dark:border-white/10 p-4 bg-white dark:bg-[#0F0F10] flex gap-3 items-center shadow-sm">

        {/* Upload */}
        <label className="cursor-pointer px-3 py-2 text-sm bg-gray-100 dark:bg-[#1A1A1C] text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-200 dark:hover:bg-[#2A2A2C] transition">
          📎
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={onUpload}
          />
        </label>

        {/* Champ texte */}
        <input
          className="flex-1 border border-gray-300 dark:border-white/10 rounded-xl px-4 py-2 text-sm bg-white dark:bg-[#1A1A1C] text-gray-900 dark:text-white focus:ring-2 focus:ring-black dark:focus:ring-white focus:border-black dark:focus:border-white"
          placeholder="Écrire un message au client…"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && onSend()}
        />

        {/* Bouton envoyer */}
        <button
          onClick={onSend}
          disabled={sending || !message.trim()}
          className="px-5 py-2 bg-black dark:bg-white text-white dark:text-black rounded-xl text-sm hover:bg-gray-900 dark:hover:bg-gray-200 transition disabled:opacity-50"
        >
          Envoyer
        </button>

        {uploading && (
          <span className="text-xs text-gray-400 dark:text-gray-500">
            Upload…
          </span>
        )}
      </div>
    </div>
  );
}
