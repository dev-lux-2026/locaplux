"use client";

import { useRouter, useSearchParams } from "next/navigation";

export default function GeoButton() {
  const router = useRouter();
  const params = useSearchParams();

  function detectLocation() {
    if (!navigator.geolocation) {
      alert("La géolocalisation n’est pas supportée.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lat = pos.coords.latitude.toString();
        const lng = pos.coords.longitude.toString();

        const qp = new URLSearchParams(params.toString());
        qp.set("lat", lat);
        qp.set("lng", lng);
        qp.set("sort", "distance");
        qp.set("distanceMode", "auto");

        router.push("/?" + qp.toString());
      },
      () => alert("Impossible d’obtenir votre position.")
    );
  }

  return (
    <button
      type="button"
      onClick={detectLocation}
      style={{
        padding: "8px 16px",
        background: "#0070f3",
        color: "white",
        borderRadius: "6px",
        cursor: "pointer",
      }}
    >
      Autour de moi
    </button>
  );
}
