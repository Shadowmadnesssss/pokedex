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
        <Link href={href} className={`${CLASSES_LIEN_NAV} text-gray-400`}>
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
    <header className="sticky top-0 z-30 border-b border-white/[0.06] bg-gray-950/70 backdrop-blur-xl">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-2 px-4 py-3">
        <Link href="/" className="group flex items-center gap-2.5 rounded-full">
          {/* Poké Ball au trait doré */}
          <svg aria-hidden="true" viewBox="0 0 32 32" className="h-7 w-7 text-accent transition duration-500 group-hover:rotate-180 motion-reduce:transition-none">
            <circle cx="16" cy="16" r="14" fill="none" stroke="currentColor" strokeWidth="1.5" />
            <path d="M2 16h9M21 16h9" stroke="currentColor" strokeWidth="1.5" />
            <circle cx="16" cy="16" r="4.5" fill="none" stroke="currentColor" strokeWidth="1.5" />
          </svg>
          <span className="font-display text-2xl font-semibold tracking-wide text-gray-50">Pokédex</span>
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
