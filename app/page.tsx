import { Suspense } from "react";
import BarreRecherche from "@/components/BarreRecherche";
import FiltreTypes from "@/components/FiltreTypes";
import GrillePokemon from "@/components/GrillePokemon";
import Pagination from "@/components/Pagination";
import { SqueletteFiltres, SqueletteGrille } from "@/components/Squelettes";
import { recupererParType, recupererPlusieurs, recupererTousLesNoms } from "@/lib/pokeapi";
import { filtrer, lireParametres, PAR_PAGE } from "@/lib/recherche";
import { TYPES } from "@/lib/types-pokemon";

type ParamsPromesse = PageProps<"/">["searchParams"];

/*
  La page n'est pas async : le titre et la barre de recherche s'affichent tout de suite.
  Les paramètres de l'adresse ne sont connus qu'à la visite : la promesse searchParams
  est transmise à des composants placés sous <Suspense>.
*/
export default function Accueil({ searchParams }: PageProps<"/">) {
  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <p className="surtitre">Collection · 1 025 espèces</p>
        <h1 className="font-display text-5xl font-semibold text-gray-50 sm:text-6xl">Pokédex national</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Les 1 025 Pokémon, de Bulbizarre à Pêchaminus.
        </p>
      </div>

      <Suspense fallback={<div className="squelette h-12 rounded-full" />}>
        <BarreRecherche />
      </Suspense>

      <Suspense fallback={<SqueletteFiltres />}>
        <Filtres searchParams={searchParams} />
      </Suspense>

      <Suspense fallback={<SqueletteGrille />}>
        <Resultats searchParams={searchParams} />
      </Suspense>
    </div>
  );
}

async function Filtres({ searchParams }: { searchParams: ParamsPromesse }) {
  const { q, type } = lireParametres(await searchParams);
  return <FiltreTypes q={q} type={type} />;
}

async function Resultats({ searchParams }: { searchParams: ParamsPromesse }) {
  const { q, type, page } = lireParametres(await searchParams);

  // 1. Une liste légère (noms + numéros), déjà en cache…
  const base = type ? await recupererParType(type) : await recupererTousLesNoms();
  // …recherche sur les noms français et anglais, ou le numéro.
  let correspondances = base;
  if (q) {
    const tous = type ? await recupererTousLesNoms() : base;
    const nomsFr = new Map(tous.map((p) => [p.id, p.nomFr]));
    correspondances = filtrer(
      base.map((p) => ({ ...p, nomFr: p.nomFr ?? nomsFr.get(p.id) })),
      q,
    );
  }

  // 2. Pagination : les bornes viennent de l'adresse, on les ramène dans les limites.
  const nombrePages = Math.max(1, Math.ceil(correspondances.length / PAR_PAGE));
  const pageCourante = Math.min(page, nombrePages);
  const tranche = correspondances.slice((pageCourante - 1) * PAR_PAGE, pageCourante * PAR_PAGE);

  // 3. Le détail des 24 Pokémon affichés seulement, en parallèle.
  const pokemons = await recupererPlusieurs(tranche.map((p) => String(p.id)));

  const contexte = [type && `type ${TYPES[type].libelle}`, q && `« ${q} »`]
    .filter(Boolean)
    .join(", ");

  return (
    <section aria-labelledby="titre-resultats" className="space-y-6">
      <h2 id="titre-resultats" className="text-sm text-gray-600 dark:text-gray-400" aria-live="polite">
        {correspondances.length} Pokémon{contexte && ` pour ${contexte}`}
      </h2>
      <GrillePokemon
        pokemons={pokemons}
        messageVide="Aucun Pokémon ne correspond à cette recherche. Essayez un autre nom ou un autre type."
      />
      <Pagination pageCourante={pageCourante} nombrePages={nombrePages} q={q} type={type} />
    </section>
  );
}
