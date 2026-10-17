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
          fontSize: 100,          // plus grand
          fontWeight: "bold",
          marginBottom: 10,
          letterSpacing: "3px"
        }}
      >
        Locaplux
      </h1>

      {/* Phrase suspense */}
      <p
        style={{
          fontSize: 20,           // plus petit
          maxWidth: 500,
          opacity: 0.7,
          marginTop: 10,
          lineHeight: "1.4"
        }}
      >
        Something extraordinary is coming…
      </p>
    </div>
  );
}
