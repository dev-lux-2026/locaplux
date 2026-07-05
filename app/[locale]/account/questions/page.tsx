"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Card from '@/app/[locale]/account/components/ui/Card'
import Badge from '@/app/[locale]/account/components/ui/Badge'
import Skeleton from '@/app/[locale]/account/components/ui/Skeleton'

export default function MyQuestionsPage() {
  const [questions, setQuestions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/questions/list");
        const data = await res.json();
        setQuestions(data.questions || []);
      } catch (e) {
        console.error("Erreur chargement questions", e);
      }
      setLoading(false);
    }

    load();
  }, []);

  const statusVariant = (answer: string | null) =>
    answer ? "success" : "warning";

  const statusLabel = (answer: string | null) =>
    answer ? "Répondu" : "En attente";

  // Skeleton premium
  if (loading) {
    return (
      <div className="max-w-4xl mx-auto py-10 px-4 space-y-4">
        <Skeleton className="h-10 w-1/3" />
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-24 w-full" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-10 px-4 space-y-10">
      {/* HEADER */}
      <header>
        <p className="text-xs font-medium tracking-[0.2em] text-neutral-500 dark:text-neutral-400 uppercase">
          Locaplux • Questions
        </p>

        <h1 className="mt-2 text-3xl lg:text-4xl font-semibold text-neutral-900 dark:text-white">
          Mes questions
        </h1>

        <p className="mt-3 text-sm text-neutral-600 dark:text-neutral-400 max-w-2xl">
          Retrouvez ici toutes les questions que vous avez posées aux vendeurs.
        </p>
      </header>

      {/* Aucune question */}
      {questions.length === 0 && (
        <Card className="text-center py-16">
          <p className="text-neutral-600 dark:text-neutral-400 mb-6">
            Vous n’avez posé aucune question pour le moment.
          </p>

          <Link
            href="/search"
            className="px-6 py-3 bg-black dark:bg-white text-white dark:text-black rounded-lg hover:bg-neutral-900 dark:hover:bg-neutral-200 transition"
          >
            Explorer les produits
          </Link>
        </Card>
      )}

      {/* LISTE DES QUESTIONS */}
      <div className="space-y-6">
        {questions.map((q) => (
          <Card key={q.id} className="p-6">
            <div className="flex flex-col md:flex-row gap-4 md:items-center md:justify-between">
              
              {/* LEFT — Produit */}
              <div className="flex items-center gap-4">
                <img
                  src={q.product.images?.[0] || "/placeholder.jpg"}
                  alt={q.product.name}
                  className="w-20 h-20 rounded-lg object-cover border border-neutral-200 dark:border-neutral-800"
                />

                <div>
                  <Link
                    href={`/product/${q.product.id}`}
                    className="font-medium hover:underline"
                  >
                    {q.product.name}
                  </Link>

                  <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1">
                    Catégorie : {q.product.category?.name}
                  </p>

                  <div className="mt-2">
                    <Badge variant={statusVariant(q.answer)}>
                      {statusLabel(q.answer)}
                    </Badge>
                  </div>
                </div>
              </div>

              {/* RIGHT — Question + Réponse */}
              <div className="text-right md:w-1/3">
                <p className="text-sm text-neutral-700 dark:text-neutral-300 line-clamp-2">
                  {q.message}
                </p>

                {q.answer ? (
                  <p className="mt-2 text-sm text-neutral-500 dark:text-neutral-400 line-clamp-2 italic">
                    Réponse : {q.answer}
                  </p>
                ) : (
                  <p className="mt-2 text-sm text-orange-600 dark:text-orange-400">
                    En attente de réponse…
                  </p>
                )}
              </div>

            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
