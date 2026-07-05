"use client";

import { addToCart } from "@/lib/cart";
import { useState } from "react";

export default function AddToCartButton({ product }: { product: any }) {
  const [loading, setLoading] = useState(false);

  function handleAdd() {
    setLoading(true);

    addToCart({
      _id: product.id,
      name: product.name,
      price: product.price,
      images: product.images,
      partnerId: product.partnerId,
      quantity: 1,
    });

    setLoading(false);
  }

  return (
    <button
      onClick={handleAdd}
      disabled={loading}
      className="w-full bg-black text-white py-3 rounded-lg text-lg font-semibold"
    >
      {loading ? "Ajout..." : "Ajouter au panier"}
    </button>
  );
}
