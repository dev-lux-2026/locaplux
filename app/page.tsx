export default function Home() {
  return (
    <div style={{
      height: "100vh",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      flexDirection: "column",
      fontFamily: "sans-serif",
      textAlign: "center",
      padding: "20px"
    }}>
      <h1 style={{ fontSize: "2rem", marginBottom: "1rem" }}>
        Vous ne pourrez plus vous en passer.
      </h1>
      <p style={{ fontSize: "1.2rem", opacity: 0.7 }}>
        Locaplux arrive très bientôt…
      </p>
    </div>
  );
}
