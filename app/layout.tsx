import type {
  Metadata,
} from "next";

import {
  CartProvider,
} from "@/components/cart-provider";

import "./globals.css";
import "./visual-upgrades.css";
import "./color-type.css";
import "./tcg-loaders.css";
import "./brand-overrides.css";

export const metadata:
  Metadata = {
  title:
    "Pokeamigos | Cartas coleccionables",

  description:
    "Catálogo de Pokémon, Riftbound, Yu-Gi-Oh!, expansiones y accesorios coleccionables.",

  other: {
    "codex-preview":
      "development",
  },

  icons: {
    icon:
      "/favicon.svg",

    shortcut:
      "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children:
    React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className="antialiased">
        <CartProvider>
          {children}
        </CartProvider>
      </body>
    </html>
  );
}