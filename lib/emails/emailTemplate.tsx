// /lib/emails/emailTemplate.tsx
import * as React from "react";
import { LOGO_BASE64 } from "./logoBase64";

export const EmailTemplate = ({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) => (
  <html>
    <body
      style={{
        margin: 0,
        padding: 0,
        fontFamily: "Arial, sans-serif",
        backgroundColor: "#f5f5f5",
      }}
    >
      {/* HEADER */}
      <table
        width="100%"
        cellPadding="0"
        cellSpacing="0"
        style={{ backgroundColor: "#000000", padding: "20px 0" }}
      >
        <tr>
          <td align="center">
            <img
              src={LOGO_BASE64}
              alt="Locaplux"
              width="180"
              style={{ display: "block" }}
            />
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
            <h1 style={{ marginTop: 0 }}>{title}</h1>
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
          <td>© {new Date().getFullYear()} Locaplux — Tous droits réservés</td>
        </tr>
      </table>
    </body>
  </html>
);
