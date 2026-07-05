import "./globals.css";
import SessionWrapper from "./SessionWrapper";
import { ThemeProvider } from "@/components/theme/ThemeProvider";

export const metadata = {
  title: "Locaplux",
  description: "Marketplace premium"
};

export default function RootLayout({ children }) {
  return (
    <html lang="fr">
      <body>
        <SessionWrapper>
          <ThemeProvider>
            {children}
          </ThemeProvider>
        </SessionWrapper>
      </body>
    </html>
  );
}
