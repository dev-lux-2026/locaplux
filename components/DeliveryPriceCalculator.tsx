"use client";

import { useState } from "react";

export default function DeliveryPriceCalculator({ productId }: { productId: string }) {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  async function calculate() {
    setLoading(true);
    setError(null);

    // 1) Récupérer position client
    const pos = await new Promise<GeolocationPosition>((resolve, reject) =>
      navigator.geolocation.getCurrentPosition(resolve, reject)
    );

    const clientLat = pos.coords.latitude;
    const clientLng = pos.coords.longitude;

    // 2) Appel API
    const res = await fetch("/api/delivery/price", {
      method: "POST",
      body: JSON.stringify({ productId, clientLat, clientLng }),
    });

    const data = await res.json();

    if (!res.ok) {
      setError(data.error || "Erreur");
    } else {
      setResult(data);
    }

    setLoading(false);
  }

  return (
    <div className="mt-4 p-4 border rounded-lg bg-neutral-900 text-white">
      <button
        onClick={calculate}
        disabled={loading}
        className="px-4 py-2 bg-blue-600 rounded hover:bg-blue-700"
      >
        {loading ? "Calcul..." : "Calculer le prix de livraison"}
      </button>

      {error && <p className="text-red-400 mt-2">{error}</p>}

      {result && (
        <div className="mt-3">
          <p>Distance : <strong>{result.distanceKm} km</strong></p>
          <p>Prix : <strong>{result.price} €</strong></p>
        </div>
      )}
    </div>
  );
}
