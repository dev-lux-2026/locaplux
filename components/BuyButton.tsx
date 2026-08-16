"use client";

interface BuyButtonProps {
  productId: string;
  quantity: number;
}

export default function BuyButton({ productId, quantity }: BuyButtonProps) {
  const handleBuy = async () => {
    try {
      const res = await fetch("/api/cart/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId, quantity }),
      });

      const data = await res.json();
      console.log("Added to cart:", data);
    } catch (err) {
      console.error("BuyButton error:", err);
    }
  };

  return (
    <button
      onClick={handleBuy}
      className="px-4 py-2 bg-black text-white rounded-md"
    >
      Acheter
    </button>
  );
}
