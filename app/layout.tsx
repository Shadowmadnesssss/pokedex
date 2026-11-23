import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Geist, Geist_Mono } from "next/font/google";
import { Suspense } from "react";
import BarreOnglets from "@/components/BarreOnglets";
import EnTete from "@/components/EnTete";
import HydratationStores from "@/components/HydratationStores";
import PiedDePage from "@/components/PiedDePage";
import "./globals.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });
// Serif élégante pour les titres (pas de version variable : on choisit les graisses)
const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

export const metadata: Metadata = {
  title: {
    template: "%s · Pokédex",
    default: "Pokédex",
  },
  description:
    "Les 1 025 Pokémon avec leurs illustrations officielles : recherche, filtres par type, fiches détaillées, favoris et sacoche d'équipe.",
};

export const viewport: Viewport = {
  themeColor: "#09090b",
  colorScheme: "dark",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="fr" className={`${geistSans.variable} ${geistMono.variable} ${cormorant.variable} dark h-full antialiased`}>
      {/* pb-16 sur téléphone : la place de la barre d'onglets fixée en bas */}
      <body className="flex min-h-full flex-col pb-16 font-sans sm:pb-0">
        <a
          href="#contenu"
          className="sr-only z-50 rounded bg-accent px-3 py-2 text-gray-950 focus:not-sr-only focus:fixed focus:left-2 focus:top-2"
        >
          Aller au contenu
        </a>
        <HydratationStores />
        <EnTete />
        <main id="contenu" className="mx-auto w-full max-w-6xl flex-1 px-4 py-6">
          {children}
        </main>
        <PiedDePage />
        {/* usePathname : sur une route dynamique, le chemin n'est connu qu'à la visite */}
        <Suspense fallback={null}>
          <BarreOnglets />
        </Suspense>
      </body>
    </html>
  );
}
