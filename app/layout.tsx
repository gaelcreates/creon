import type { Metadata } from "next";
import { Inter_Tight } from "next/font/google";
import "./globals.css";

const interTight = Inter_Tight({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-display-google",
  display: "swap",
});

export const metadata: Metadata = {
  title: "CREON — La plateforme suisse pour les créateurs",
  description:
    "Annuaire, feed et events de la scène créative suisse romande. Curé à la main par CREON crew.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="fr"
      className={`${interTight.variable} h-full antialiased`}
    >
      <body className="min-h-screen flex flex-col">{children}</body>
    </html>
  );
}
