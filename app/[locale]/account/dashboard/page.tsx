"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Card from "../components/ui/Card";
import Skeleton from "../components/ui/Skeleton";
import Badge from "../components/ui/Badge";

export default function DashboardPage() {
  const [loading, setLoading] = useState(true);

  const [stats, setStats] = useState({
    orders: 0,
    wishlist: 0,
    messages: 0,
    questions: 0,
  });

  const [lastOrders, setLastOrders] = useState<any[]>([]);
  const [lastMessages, setLastMessages] = useState<any[]>([]);

  useEffect(() => {
    async function load() {
      try {
        const [ordersRes, wishlistRes, messagesRes, questionsRes] =
          await Promise.all([
            fetch("/api/orders"),
            fetch("/api/account/wishlist"),
            fetch("/api/messages/conversations"),
            fetch("/api/questions/list"),
          ]);

        const orders = await ordersRes.json();
        const wishlist = await wishlistRes.json();
        const messages = await messagesRes.json();
        const questions = await questionsRes.json();

        setStats({
          orders: orders.length,
          wishlist: wishlist.length,
          messages: messages.length,
          questions: questions.questions?.length || 0,
        });

        setLastOrders(orders.slice(0, 3));
        setLastMessages(messages.slice(0, 3));
      } catch (e) {
        console.error("Erreur dashboard", e);
      }

      setLoading(false);
    }

    load();
  }, []);

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto py-10 px-4 space-y-6">
        <Skeleton className="h-10 w-1/3" />
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-24 w-full" />
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto py-10 px-4 space-y-10">

      {/* HEADER */}
      <header>
        <p className="text-xs font-medium tracking-[0.2em] text-neutral-500 dark:text-neutral-400 uppercase">
          Locaplux • Tableau de bord
        </p>

        <h1 className="mt-2 text-3xl lg:text-4xl font-semibold text-neutral-900 dark:text-white">
          Bienvenue dans votre espace
        </h1>

        <p className="mt-3 text-sm text-neutral-600 dark:text-neutral-400 max-w-2xl">
          Retrouvez ici un aperçu rapide de vos commandes, favoris, messages et questions.
        </p>
      </header>

      {/* STATS */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="p-5 text-center">
          <p className="text-sm text-neutral-500 dark:text-neutral-400">Commandes</p>
          <p className="text-3xl font-semibold mt-1">{stats.orders}</p>
        </Card>

        <Card className="p-5 text-center">
          <p className="text-sm text-neutral-500 dark:text-neutral-400">Favoris</p>
          <p className="text-3xl font-semibold mt-1">{stats.wishlist}</p>
        </Card>

        <Card className="p-5 text-center">
          <p className="text-sm text-neutral-500 dark:text-neutral-400">Messages</p>
          <p className="text-3xl font-semibold mt-1">{stats.messages}</p>
        </Card>

        <Card className="p-5 text-center">
          <p className="text-sm text-neutral-500 dark:text-neutral-400">Questions</p>
          <p className="text-3xl font-semibold mt-1">{stats.questions}</p>
        </Card>
      </section>

      {/* DERNIÈRES COMMANDES */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Dernières commandes</h2>
          <Link href="/account/orders" className="text-sm text-lp-blue hover:underline">
            Voir tout
          </Link>
        </div>

        {lastOrders.length === 0 && (
          <Card className="p-6 text-center text-neutral-500 dark:text-neutral-400">
            Aucune commande récente.
          </Card>
        )}

        <div className="space-y-4">
          {lastOrders.map((order) => (
            <Card key={order.id} className="p-5 flex items-center justify-between">
              <div>
                <p className="font-medium">Commande #{order.id}</p>
                <p className="text-sm text-neutral-500 dark:text-neutral-400">
                  {new Date(order.createdAt).toLocaleDateString("fr-FR")}
                </p>
              </div>

              <Badge variant="info">{order.total} €</Badge>
            </Card>
          ))}
        </div>
      </section>

      {/* DERNIERS MESSAGES */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Derniers messages</h2>
          <Link href="/account/messages" className="text-sm text-lp-blue hover:underline">
            Voir tout
          </Link>
        </div>

        {lastMessages.length === 0 && (
          <Card className="p-6 text-center text-neutral-500 dark:text-neutral-400">
            Aucun message récent.
          </Card>
        )}

        <div className="space-y-4">
          {lastMessages.map((msg) => (
            <Card key={msg.id} className="p-5">
              <p className="font-medium">
                {msg.otherUser?.publicName || msg.otherUser?.name || "Vendeur"}
              </p>

              <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1 line-clamp-1">
                {msg.messages?.[0]?.text || "📎 Pièce jointe"}
              </p>
            </Card>
          ))}
        </div>
      </section>

    </div>
  );
}
