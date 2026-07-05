"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import ConversationListSkeleton from "@/components/ui/ConversationListSkeleton";

type Message = {
  id: string;
  text: string | null;
  createdAt: string;
  senderId: string;
};

type Conversation = {
  id: string;
  order: { id: string };
  messages: Message[];
  otherUser?: {
    publicName: string | null;
    name: string | null;
  };
};

export default function PartnerMessagesPage() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  // Charger la session
  useEffect(() => {
    const loadSession = async () => {
      const res = await fetch("/api/auth/session");
      const session = await res.json();
      setCurrentUserId(session?.user?.id || null);
    };
    loadSession();
  }, []);

  // Charger les conversations
  useEffect(() => {
    const load = async () => {
      const res = await fetch("/api/messages/conversations");
      if (res.ok) {
        const data = await res.json();
        setConversations(data);
      }
      setLoading(false);
    };
    load();
  }, []);

  // 🔥 SKELETON PREMIUM
  if (loading || currentUserId === null) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto py-12 px-4 lg:px-0">
          <ConversationListSkeleton />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto py-12 px-4 lg:px-0 space-y-10">

        {/* HEADER */}
        <header>
          <p className="text-xs font-medium tracking-[0.2em] text-gray-500 uppercase">
            Locaplux • Messages
          </p>
          <h1 className="mt-2 text-3xl lg:text-4xl font-semibold text-gray-900">
            Messages clients
          </h1>
          <p className="mt-3 text-sm text-gray-600 max-w-2xl">
            Retrouvez ici toutes vos conversations avec les clients.  
            Une interface claire, moderne et premium pour gérer vos échanges.
          </p>
        </header>

        {/* LISTE DES CONVERSATIONS */}
        <section className="space-y-6">
          {conversations.length === 0 && (
            <div className="text-center py-20 text-gray-500">
              Aucun message pour le moment.
            </div>
          )}

          {conversations.map((c) => {
            const last = c.messages?.[0];
            const isUnread = last && last.senderId !== currentUserId;

            return (
              <Link
                key={c.id}
                href={`/partner/messages/${c.id}`}
                className="block bg-white border border-gray-200 rounded-2xl p-6 shadow-sm hover:shadow-md hover:bg-gray-50 transition-all"
              >
                <div className="flex flex-col lg:flex-row justify-between lg:items-center gap-4">

                  {/* Infos client */}
                  <div className="space-y-1">
                    <p className="text-lg font-semibold text-gray-900">
                      {c.otherUser?.publicName ||
                        c.otherUser?.name ||
                        "Client"}
                    </p>

                    <p className="text-sm text-gray-600 line-clamp-1">
                      {last?.text || "📎 Pièce jointe"}
                    </p>
                  </div>

                  {/* Statut + date */}
                  <div className="flex flex-col items-end gap-1">
                    {isUnread && (
                      <span className="px-3 py-1.5 text-xs font-medium bg-black text-white rounded-full">
                        Nouveau message
                      </span>
                    )}

                    <p className="text-xs text-gray-500">
                      {last
                        ? new Date(last.createdAt).toLocaleDateString("fr-FR")
                        : ""}
                    </p>
                  </div>

                </div>
              </Link>
            );
          })}
        </section>
      </div>
    </div>
  );
}
