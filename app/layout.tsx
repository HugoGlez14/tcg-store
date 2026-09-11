import type { Metadata } from "next";
import "./globals.css";
import "./visual-upgrades.css";
import "./color-type.css";
import "./tcg-loaders.css";

export const metadata: Metadata = {
  title: "Tienda de cartas coleccionables",
  description: "Catálogo de cartas, expansiones y accesorios coleccionables.",
  other: {
    "codex-preview": "development",
  },
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className="antialiased">{children}</body>
    </html>
  );
}
