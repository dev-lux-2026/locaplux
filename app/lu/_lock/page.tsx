// lock sync
"use client";

import { useState } from "react";

export default function LockPage() {
  const [password, setPassword] = useState("");

  const submit = async () => {
    const res = await fetch("/api/unlock", {
      method: "POST",
      body: JSON.stringify({ password }),
    });

    if (res.ok) {
      window.location.href = "/";
    } else {
      alert("Mot de passe incorrect");
    }
  };

  return (
    <div style={{ padding: 40 }}>
      <h1>Accès restreint</h1>
      <input
        type="password"
        placeholder="Mot de passe"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={submit}>Entrer</button>
    </div>
  );
}
