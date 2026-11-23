import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import EnTete from "@/components/EnTete";
import HydratationStores from "@/components/HydratationStores";
import PiedDePage from "@/components/PiedDePage";
import "./globals.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    template: "%s · Pokédex",
    default: "Pokédex",
  },
  description:
    "Les 1 025 Pokémon avec leurs illustrations officielles : recherche, filtres par type, fiches détaillées, favoris et sacoche d'équipe.",
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#b91c1c" },
    { media: "(prefers-color-scheme: dark)", color: "#030712" },
  ],
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="fr" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col font-sans">
        <a
          href="#contenu"
          className="sr-only z-50 rounded bg-white px-3 py-2 text-gray-900 focus:not-sr-only focus:fixed focus:left-2 focus:top-2"
        >
          Aller au contenu
        </a>
        <HydratationStores />
        <EnTete />
        <main id="contenu" className="mx-auto w-full max-w-6xl flex-1 px-4 py-6">
          {children}
        </main>
        <PiedDePage />
      </body>
    </html>
  );
}
