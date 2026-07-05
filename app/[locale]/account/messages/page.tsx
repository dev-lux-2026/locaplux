"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Card from "../components/ui/Card";
import Skeleton from "../components/ui/Skeleton";

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

export default function AccountMessagesPage() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  // Load session
  useEffect(() => {
    async function loadSession() {
      const res = await fetch("/api/auth/session");
      const session = await res.json();
      setCurrentUserId(session?.user?.id || null);
    }
    loadSession();
  }, []);

  // Load conversations
  useEffect(() => {
    async function load() {
      const res = await fetch("/api/messages/conversations");
      if (res.ok) {
        const data = await res.json();
        setConversations(data);
      }
      setLoading(false);
    }
    load();
  }, []);

  // Skeleton premium
  if (loading || currentUserId === null) {
    return (
      <div className="max-w-3xl mx-auto py-10 space-y-4">
        <Skeleton className="h-10 w-1/3" />
        <Skeleton className="h-20 w-full" />
        <Skeleton className="h-20 w-full" />
        <Skeleton className="h-20 w-full" />
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto py-10 px-4 space-y-6">
      <h1 className="text-2xl font-semibold">Messages</h1>

      {/* Aucune conversation */}
      {conversations.length === 0 && (
        <Card className="text-center py-16">
          <p className="text-neutral-600 dark:text-neutral-400">
            Aucune conversation pour le moment.
          </p>
        </Card>
      )}

      {/* Liste des conversations */}
      <div className="space-y-4">
        {conversations.map((c) => {
          const last = c.messages?.[0];
          const isUnread = last && last.senderId !== currentUserId;

          return (
            <Link key={c.id} href={`/account/messages/${c.id}`}>
              <Card className="p-5 hover:bg-neutral-50 dark:hover:bg-neutral-900 transition cursor-pointer">
                <div className="flex items-center justify-between">
                  {/* LEFT */}
                  <div className="flex items-center gap-3">
                    {isUnread && (
                      <span className="w-2 h-2 bg-lp-blue rounded-full"></span>
                    )}

                    <div>
                      <p className="font-medium text-lg">
                        {c.otherUser?.publicName ||
                          c.otherUser?.name ||
                          "Vendeur"}
                      </p>

                      <p className="text-sm text-neutral-500 dark:text-neutral-400 line-clamp-1 mt-1">
                        {last?.text || "📎 Pièce jointe"}
                      </p>
                    </div>
                  </div>

                  {/* RIGHT */}
                  <div className="text-xs text-neutral-500 dark:text-neutral-400">
                    {last
                      ? new Date(last.createdAt).toLocaleDateString("fr-FR", {
                          day: "2-digit",
                          month: "short",
                        })
                      : ""}
                  </div>
                </div>
              </Card>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
