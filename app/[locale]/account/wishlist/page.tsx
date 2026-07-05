"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import Skeleton from "../components/ui/Skeleton";

export default function WishlistPage() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadWishlist() {
      try {
        const res = await fetch("/api/account/wishlist");
        const data = await res.json();
        setItems(data);
      } catch (e) {
        console.error("Erreur chargement wishlist", e);
      }
      setLoading(false);
    }

    loadWishlist();
  }, []);

  async function removeFromWishlist(productId: string) {
    await fetch(`/api/account/wishlist/${productId}`, {
      method: "DELETE",
    });

    setItems((prev) => prev.filter((p) => p.id !== productId));
  }

  // Skeleton premium
  if (loading) {
    return (
      <div className="max-w-5xl mx-auto py-10 px-4 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        <Skeleton className="h-64 w-full" />
        <Skeleton className="h-64 w-full" />
        <Skeleton className="h-64 w-full" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto py-10 px-4 space-y-10">
      {/* HEADER */}
      <header>
        <p className="text-xs font-medium tracking-[0.2em] text-neutral-500 dark:text-neutral-400 uppercase">
          Locaplux • Favoris
        </p>

        <h1 className="mt-2 text-3xl lg:text-4xl font-semibold text-neutral-900 dark:text-white">
          Mes produits favoris
        </h1>

        <p className="mt-3 text-sm text-neutral-600 dark:text-neutral-400 max-w-2xl">
          Retrouvez ici tous les produits que vous avez ajoutés à votre liste de favoris.
        </p>
      </header>

      {/* AUCUN FAVORI */}
      {items.length === 0 && (
        <Card className="text-center py-16">
          <p className="text-neutral-600 dark:text-neutral-400 mb-6">
            Aucun produit dans vos favoris pour le moment.
          </p>

          <Link
            href="/search"
            className="px-6 py-3 bg-black dark:bg-white text-white dark:text-black rounded-lg hover:bg-neutral-900 dark:hover:bg-neutral-200 transition"
          >
            Explorer les produits
          </Link>
        </Card>
      )}

      {/* GRID DES FAVORIS */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {items.map((product) => (
          <Card
            key={product.id}
            className="p-3 flex flex-col bg-white dark:bg-neutral-900"
          >
            {/* IMAGE */}
            <Link href={`/product/${product.id}`}>
              <img
                src={product.imageUrl}
                alt={product.name}
                className="w-full h-48 object-cover rounded-lg border border-neutral-200 dark:border-neutral-800"
              />
            </Link>

            {/* INFOS */}
            <div className="mt-3 flex-1">
              <Link
                href={`/product/${product.id}`}
                className="font-medium block hover:underline text-neutral-900 dark:text-white"
              >
                {product.name}
              </Link>

              <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1">
                {product.categoryName}
              </p>

              <p className="text-lg font-semibold text-neutral-900 dark:text-white mt-3">
                {product.price} €
              </p>
            </div>

            {/* ACTIONS */}
            <div className="mt-4 flex gap-2">
              <Link
                href={`/product/${product.id}`}
                className="flex-1 px-4 py-2 bg-black dark:bg-white text-white dark:text-black rounded-lg text-center hover:bg-neutral-900 dark:hover:bg-neutral-200 transition"
              >
                Voir
              </Link>

              <Button
                variant="outline"
                className="px-4 py-2"
                onClick={() => removeFromWishlist(product.id)}
              >
                Retirer
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
