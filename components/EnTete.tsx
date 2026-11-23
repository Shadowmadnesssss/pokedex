import Link from "next/link";
import { Suspense, type ReactNode } from "react";
import BoutonHasard from "@/components/BoutonHasard";
import CompteurFavoris from "@/components/CompteurFavoris";
import IndicateurSacoche from "@/components/IndicateurSacoche";
import LienNav, { CLASSES_LIEN_NAV } from "@/components/LienNav";

/**
 * Chaque LienNav lit usePathname : sur une route dynamique, le chemin n'est connu qu'à la
 * visite, donc on l'entoure d'un Suspense avec le texte du lien en secours.
 */
function Lien({ href, children }: { href: string; children: ReactNode }) {
  return (
    <Suspense
      fallback={
        <Link href={href} className={`${CLASSES_LIEN_NAV} text-red-50`}>
          {children}
        </Link>
      }
    >
      <LienNav href={href}>{children}</LienNav>
    </Suspense>
  );
}

export default function EnTete() {
  return (
    <header className="sticky top-0 z-30 bg-red-700 text-white shadow-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-2 px-4 py-3">
        <Link href="/" className="flex items-center gap-2 rounded-full text-xl font-black tracking-tight">
          <span
            aria-hidden="true"
            className="relative inline-block h-7 w-7 overflow-hidden rounded-full border-2 border-gray-900 bg-white before:absolute before:inset-x-0 before:top-0 before:h-1/2 before:bg-red-500 after:absolute after:left-1/2 after:top-1/2 after:h-2.5 after:w-2.5 after:-translate-x-1/2 after:-translate-y-1/2 after:rounded-full after:border-2 after:border-gray-900 after:bg-white"
          />
          Pokédex
        </Link>
        <div className="flex items-center gap-1">
          {/* Sur téléphone, ces liens sont dans la barre d'onglets en bas de l'écran. */}
          <nav aria-label="Navigation principale" className="hidden sm:block">
            <ul className="flex items-center gap-1">
              <li>
                <Lien href="/">Tous</Lien>
              </li>
              <li>
                <Lien href="/favoris">
                  Favoris <CompteurFavoris />
                </Lien>
              </li>
              <li>
                <Lien href="/sacoche">
                  Sacoche <IndicateurSacoche />
                </Lien>
              </li>
              <li>
                <Lien href="/comparer">Comparer</Lien>
              </li>
            </ul>
          </nav>
          <BoutonHasard />
        </div>
      </div>
    </header>
  );
}
