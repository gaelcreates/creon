import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "CREON — Le média des créatifs suisses",
  description:
    "Events, créateurs, articles. La culture créative en Suisse, curée à la main.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="fr" className="h-full antialiased">
      <body className="min-h-screen flex flex-col">{children}</body>
    </html>
  );
}
