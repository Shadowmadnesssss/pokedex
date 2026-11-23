"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useRef, useState, useTransition } from "react";
import { useRaccourci } from "@/hooks/useRaccourci";
import { useRappelTemporise } from "@/hooks/useRappelTemporise";

/** Écrit la recherche dans l'adresse (?q=...), 300 ms après la dernière frappe. */
export default function BarreRecherche() {
  const router = useRouter();
  const chemin = usePathname();
  const parametres = useSearchParams();
  const qAdresse = parametres.get("q") ?? "";
  const [enAttente, demarrer] = useTransition();
  const champ = useRef<HTMLInputElement>(null);

  const [texte, setTexte] = useState(qAdresse);
  const [qVu, setQVu] = useState(qAdresse);
  const [envoye, setEnvoye] = useState(qAdresse);

  // L'adresse a changé sans nous (bouton Précédent, lien de type...) : on remet le champ à jour.
  // Ajustement pendant le rendu, recommandé par React plutôt qu'un effet.
  if (qAdresse !== qVu) {
    setQVu(qAdresse);
    if (qAdresse !== envoye) setTexte(qAdresse);
  }

  useRaccourci("/", () => champ.current?.focus());

  const naviguer = useRappelTemporise((valeur: string) => {
    const q = valeur.trim();
    const suivants = new URLSearchParams(parametres.toString());
    if (q) suivants.set("q", q);
    else suivants.delete("q");
    suivants.delete("page"); // une nouvelle recherche repart de la première page
    const chaine = suivants.toString();
    setEnvoye(q);
    // replace : pas une entrée d'historique par lettre
    demarrer(() => router.replace(chaine ? `${chemin}?${chaine}` : chemin, { scroll: false }));
  }, 300);

  return (
    <div className="relative">
      <label htmlFor="recherche" className="sr-only">
        Rechercher un Pokémon
      </label>
      <span
        aria-hidden="true"
        className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-gray-500"
      >
        ⌕
      </span>
      <input
        ref={champ}
        id="recherche"
        type="search"
        value={texte}
        onChange={(e) => {
          setTexte(e.target.value);
          naviguer(e.target.value);
        }}
        placeholder="Nom (fr ou en) ou numéro…"
        autoComplete="off"
        className="h-12 w-full rounded-full border border-white/10 bg-white/[0.04] pl-10 pr-28 shadow-[inset_0_1px_0_rgb(255_255_255/0.05)] placeholder:text-gray-500 focus:border-accent/60 focus:bg-white/[0.06]"
      />
      <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-sm text-gray-600 dark:text-gray-400">
        {enAttente ? (
          <span role="status">Recherche…</span>
        ) : (
          <kbd className="hidden rounded border border-gray-300 px-1.5 font-mono text-xs sm:inline dark:border-gray-700">
            /
          </kbd>
        )}
      </span>
    </div>
  );
}
