"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const [code, setCode] = useState("");
  const router = useRouter();

  function handleSubmit(e) {
    e.preventDefault();

    // Ton mot secret ici
    if (code === "lux2026") {
      router.push("/fr"); // Tu entres sur ton vrai site
    }
  }

  return (
    <div style={{
      height: "100vh",
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      background: "#f5f5f5"
    }}>
      <h1 style={{ fontSize: 40, marginBottom: 10 }}>Locaplux</h1>
      <p style={{ marginBottom: 30 }}>Site en préparation…</p>

      <form onSubmit={handleSubmit}>
        <input
          type="password"
          placeholder="Mot secret"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          style={{
            padding: "10px 15px",
            borderRadius: 6,
            border: "1px solid #ccc",
            fontSize: 16
          }}
        />
      </form>
    </div>
  );
}
