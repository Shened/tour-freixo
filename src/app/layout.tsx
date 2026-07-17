import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Tour de Freixo — Classificações",
  description: "Classificações do Tour de Freixo",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-PT">
      <body className="bg-background text-foreground antialiased">
        {children}
      </body>
    </html>
  );
}
