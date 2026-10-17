export default function Maintenance() {
  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        background: "#ffffff",
        fontFamily: "sans-serif",
        textAlign: "center",
        padding: "0 20px"
      }}
    >
      {/* Logo Locaplux */}
      <h1
        style={{
          fontSize: 80,
          fontWeight: "bold",
          marginBottom: 20,
          letterSpacing: "2px"
        }}
      >
        Locaplux
      </h1>

      {/* Phrase suspense */}
      <p
        style={{
          fontSize: 24,
          maxWidth: 600,
          opacity: 0.8,
          lineHeight: "1.4"
        }}
      >
        Something extraordinary is coming…
      </p>
    </div>
  );
}
