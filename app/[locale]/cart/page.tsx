"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Container from "@/components/Container";

export default function CartPage() {
  const router = useRouter();

  const [cart, setCart] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Charger le panier depuis localStorage
  useEffect(() => {
    const stored = localStorage.getItem("cart");
    if (stored) {
      setCart(JSON.parse(stored));
    }
    setLoading(false);
  }, []);

  // Sauvegarder le panier
  const saveCart = (updated: any[]) => {
    setCart(updated);
    localStorage.setItem("cart", JSON.stringify(updated));
  };

  // Modifier quantité
  const updateQuantity = (id: string, delta: number) => {
    const updated = cart.map((item) => {
      if (item.id === id) {
        const newQty = Math.min(
          Math.max(1, item.quantity + delta),
          item.stock // quantité max = stock
        );
        return { ...item, quantity: newQty };
      }
      return item;
    });
    saveCart(updated);
  };

  // Supprimer un produit
  const removeItem = (id: string) => {
    const updated = cart.filter((item) => item.id !== id);
    saveCart(updated);
  };

  if (loading) return <p className="py-10 text-center">Chargement...</p>;

  const subtotal = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const goToCheckout = () => {
    if (cart.length === 0) return;
    router.push("/checkout");
  };

  return (
    <Container>
      <div className="py-10 grid grid-cols-1 lg:grid-cols-3 gap-10">

        {/* LISTE PRODUITS */}
        <div className="lg:col-span-2 space-y-6">
          <h1 className="text-3xl font-semibold text-gray-900 mb-4">
            Votre panier
          </h1>

          {cart.length === 0 && (
            <p className="text-gray-600">Votre panier est vide.</p>
          )}

          {cart.map((item) => (
            <div
              key={item.id}
              className="flex gap-5 bg-white border border-gray-200 rounded-2xl p-5 shadow-sm"
            >
              {/* IMAGE */}
              <div className="w-32 h-32 rounded-xl overflow-hidden bg-gray-100">
                <img
                  src={item.images?.[0]}
                  className="w-full h-full object-cover"
                  alt={item.name}
                />
              </div>

              {/* INFO */}
              <div className="flex-1 flex flex-col justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">
                    {item.name}
                  </h2>

                  <p className="text-gray-700 mt-1">{item.price} €</p>

                  <p className="text-sm text-gray-500 mt-1">
                    État : {item.condition}
                  </p>

                  <p className="text-sm text-gray-500">
                    Référence : {item.reference}
                  </p>

                  <p className="text-xs text-gray-400 mt-1">
                    Stock disponible : {item.stock}
                  </p>
                </div>

                {/* QUANTITÉ */}
                <div className="flex items-center gap-3 mt-4">
                  <button
                    onClick={() => updateQuantity(item.id, -1)}
                    className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded-lg hover:bg-gray-100 transition"
                  >
                    –
                  </button>

                  <span className="w-10 text-center font-medium text-gray-900">
                    {item.quantity}
                  </span>

                  <button
                    onClick={() => updateQuantity(item.id, +1)}
                    className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded-lg hover:bg-gray-100 transition"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* SUPPRIMER */}
              <button
                onClick={() => removeItem(item.id)}
                className="text-gray-400 hover:text-red-500 transition"
              >
                ✕
              </button>
            </div>
          ))}
        </div>

        {/* RÉSUMÉ */}
        <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm h-fit">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Résumé de commande
          </h2>

          <div className="space-y-2 text-gray-700">
            <p className="flex justify-between">
              <span>Sous-total</span>
              <span>{subtotal} €</span>
            </p>

            <p className="flex justify-between text-sm text-gray-500">
              <span>Livraison estimée</span>
              <span>2–4 jours ouvrés</span>
            </p>

            <hr className="my-3" />

            <p className="flex justify-between text-lg font-semibold text-gray-900">
              <span>Total</span>
              <span>{subtotal} €</span>
            </p>
          </div>

          <button
            onClick={goToCheckout}
            disabled={cart.length === 0}
            className="w-full mt-6 px-6 py-3 bg-black text-white rounded-xl shadow hover:bg-gray-900 disabled:opacity-40 disabled:cursor-not-allowed transition"
          >
            Passer au paiement
          </button>
        </div>
      </div>
    </Container>
  );
}
