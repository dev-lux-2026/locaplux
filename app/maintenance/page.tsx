"use client";

export default function Maintenance() {
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
      <p style={{ marginBottom: 30 }}>Site en maintenance…</p>

      {/* Accès secret */}
      <div
        onClick={() => window.location.href = "/fr"}
        style={{
          position: "absolute",
          bottom: 10,
          right: 10,
          width: 20,
          height: 20,
          opacity: 0.03,
          cursor: "pointer"
        }}
      />
    </div>
  );
}
