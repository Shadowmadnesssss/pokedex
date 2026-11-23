"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import IndicateurSacoche from "@/components/IndicateurSacoche";
import { useFavoris } from "@/stores/favoris";

const ICONE = "h-6 w-6";

const ONGLETS: { href: string; libelle: string; icone: ReactNode }[] = [
  {
    href: "/",
    libelle: "Tous",
    icone: (
      <svg viewBox="0 0 24 24" className={ICONE} fill="none" stroke="currentColor" strokeWidth="1.5">
        <rect x="3" y="3" width="7" height="7" rx="1.5" />
        <rect x="14" y="3" width="7" height="7" rx="1.5" />
        <rect x="3" y="14" width="7" height="7" rx="1.5" />
        <rect x="14" y="14" width="7" height="7" rx="1.5" />
      </svg>
    ),
  },
  {
    href: "/favoris",
    libelle: "Favoris",
    icone: (
      <svg viewBox="0 0 24 24" className={ICONE} fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round">
        <path d="M12 3l2.8 5.7 6.2.9-4.5 4.4 1.1 6.2L12 17.3 6.4 20.2l1.1-6.2L3 9.6l6.2-.9z" />
      </svg>
    ),
  },
  {
    href: "/sacoche",
    libelle: "Sacoche",
    icone: (
      <svg viewBox="0 0 24 24" className={ICONE} fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round">
        <path d="M5 8h14l-1 12H6z" />
        <path d="M9 8V6a3 3 0 016 0v2" />
      </svg>
    ),
  },
  {
    href: "/comparer",
    libelle: "Comparer",
    icone: (
      <svg viewBox="0 0 24 24" className={ICONE} fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
        <path d="M6 20V10M12 20V4M18 20v-7" />
      </svg>
    ),
  },
];

function PastilleFavoris() {
  const nombre = useFavoris((etat) => etat.noms.length);
  if (nombre === 0) return null;
  return (
    <span className="absolute -right-2.5 -top-1.5 min-w-4 rounded-full px-1 text-center text-[10px] font-bold leading-4 bouton-or">
      <span className="sr-only">, </span>
      {nombre}
    </span>
  );
}

/** Barre d'onglets fixée en bas de l'écran, uniquement sur téléphone (comme une appli). */
export default function BarreOnglets() {
  const chemin = usePathname();
  return (
    <nav
      aria-label="Navigation principale (mobile)"
      className="fixed inset-x-0 bottom-0 z-30 border-t border-white/[0.06] bg-gray-950/80 pb-[env(safe-area-inset-bottom)] backdrop-blur-xl sm:hidden"
    >
      <ul className="grid grid-cols-4">
        {ONGLETS.map((o) => {
          const actif = o.href === "/" ? chemin === "/" || chemin.startsWith("/pokemon") : chemin.startsWith(o.href);
          return (
            <li key={o.href}>
              <Link
                href={o.href}
                aria-current={actif ? "page" : undefined}
                className={`flex flex-col items-center gap-0.5 py-2 text-[11px] font-semibold transition ${
                  actif ? "text-accent" : "text-gray-500"
                }`}
              >
                <span className="relative">
                  {o.icone}
                  {o.href === "/favoris" && <PastilleFavoris />}
                </span>
                {o.href === "/sacoche" ? (
                  <span className="flex flex-col items-center gap-0.5">
                    {o.libelle}
                    <IndicateurSacoche variante="onglets" />
                  </span>
                ) : (
                  o.libelle
                )}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
