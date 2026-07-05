"use client";

import { useState } from "react";

export default function OrderpartnerActions({
  orderId,
  currentStatus,
}: {
  orderId: string;
  currentStatus: string;
}) {
  const [loading, setLoading] = useState(false);

  async function updateStatus(status: string) {
    setLoading(true);

    await fetch(`/api/orders/${orderId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });

    window.location.reload();
  }

  return (
    <div className="mt-6 space-y-3">
      {currentStatus === "paid" && (
        <button
          onClick={() => updateStatus("shipped")}
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 rounded-lg"
        >
          Marquer comme expédié
        </button>
      )}

      {currentStatus === "shipped" && (
        <button
          onClick={() => updateStatus("delivered")}
          disabled={loading}
          className="w-full bg-green-600 text-white py-2 rounded-lg"
        >
          Marquer comme livré
        </button>
      )}
    </div>
  );
}
