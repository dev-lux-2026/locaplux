"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

export default function AddressSearch() {
  const router = useRouter();
  const params = useSearchParams();
  const [address, setAddress] = useState(params.get("address") || "");

  async function searchAddress(e: any) {
    e.preventDefault();

    if (!address.trim()) return;

    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
      address
    )}`;

    const res = await fetch(url);
    const data = await res.json();

    if (!data[0]) {
      alert("Adresse introuvable.");
      return;
    }

    const lat = data[0].lat;
    const lng = data[0].lon;

    const qp = new URLSearchParams(params.toString());
    qp.set("lat", lat);
    qp.set("lng", lng);
    qp.set("address", address);
    qp.set("sort", "distance");
    qp.set("distanceMode", "custom");

    router.push("/?" + qp.toString());
  }

  return (
    <form onSubmit={searchAddress} style={{ display: "flex", gap: 10 }}>
      <input
        type="text"
        placeholder="Adresse de livraison"
        value={address}
        onChange={(e) => setAddress(e.target.value)}
        style={{
          padding: "8px",
          width: "220px",
          borderRadius: "6px",
          border: "1px solid #ccc",
        }}
      />

      <button
        type="submit"
        style={{
          padding: "8px 16px",
          background: "#0070f3",
          color: "white",
          borderRadius: "6px",
          cursor: "pointer",
        }}
      >
        Valider
      </button>
    </form>
  );
}
