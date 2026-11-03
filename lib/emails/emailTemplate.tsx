// /lib/emails/emailTemplate.tsx
import * as React from "react";

export const EmailTemplate = ({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
  logoBase64?: string; // Gardé optionnel pour ne pas casser d'autres imports potentiels
}) => {
  return (
    <html>
      <body
        style={{
          margin: 0,
          padding: 0,
          fontFamily: "Arial, sans-serif",
          backgroundColor: "#f5f5f5",
        }}
      >
        {/* HEADER - Texte Locaplux au lieu de l'image */}
        <table
          width="100%"
          cellPadding="0"
          cellSpacing="0"
          style={{ backgroundColor: "#000000", padding: "25px 0" }}
        >
          <tr>
            <td align="center">
              <span
                style={{
                  color: "#ffffff",
                  fontSize: "24px",
                  fontWeight: "bold",
                  letterSpacing: "1.5px",
                  textDecoration: "none",
                }}
              >
                Locaplux
              </span>
            </td>
          </tr>
        </table>

        {/* CONTENT */}
        <table
          width="100%"
          cellPadding="0"
          cellSpacing="0"
          style={{
            maxWidth: "600px",
            margin: "0 auto",
            background: "#ffffff",
            padding: "40px",
          }}
        >
          <tr>
            <td>
              <h1 style={{ marginTop: 0, color: "#111111" }}>{title}</h1>
              <div>{children}</div>
            </td>
          </tr>
        </table>

        {/* FOOTER */}
        <table
          width="100%"
          cellPadding="0"
          cellSpacing="0"
          style={{
            textAlign: "center",
            padding: "20px 0",
            color: "#888",
            fontSize: "12px",
          }}
        >
          <tr>
            <td>
              © {new Date().getFullYear()} Locaplux — Tous droits réservés
            </td>
          </tr>
        </table>
      </body>
    </html>
  );
};