import Link from "next/link";
import { ViewTransition, type CSSProperties } from "react";
import BadgeType from "@/components/BadgeType";
import BoutonAjoutRapide from "@/components/BoutonAjoutRapide";
import BoutonFavori from "@/components/BoutonFavori";
import ImagePokemon from "@/components/ImagePokemon";
import PokeballDecor from "@/components/PokeballDecor";
import { formaterNumero } from "@/lib/conversion";
import type { Pokemon } from "@/types/pokemon";

type Props = { pokemon: Pokemon };

export default function CartePokemon({ pokemon }: Props) {
  const numero = formaterNumero(pokemon.id);
  // La teinte du type principal est transmise par une variable CSS locale.
  const teinte = { "--teinte": `var(--color-type-${pokemon.types[0]})` } as CSSProperties;

  return (
    <article
      style={teinte}
      className="group relative animate-apparition overflow-hidden rounded-2xl border border-(--teinte)/25 bg-white bg-linear-to-b from-(--teinte)/35 via-(--teinte)/10 via-55% to-transparent shadow-sm transition duration-200 hover:-translate-y-1 hover:border-(--teinte)/60 hover:shadow-lg hover:shadow-(--teinte)/20 motion-reduce:animate-none motion-reduce:transition-none motion-reduce:hover:translate-y-0 dark:bg-gray-900 dark:from-(--teinte)/35"
    >
      {/* Numéro en filigrane, en haut, derrière l'image : purement décoratif */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-1 select-none text-center font-mono text-5xl font-black tracking-tighter text-gray-900/[0.07] dark:text-white/[0.07]"
      >
        {numero}
      </span>

      <Link
        href={`/pokemon/${pokemon.nom}`}
        // Précharge aussi le contenu qui dépend de [nom] (pas seulement la coque de la page) :
        // la fiche s'affiche sans attendre, et l'image peut « voler » jusqu'à elle.
        prefetch={true}
        className="relative flex flex-col items-center gap-1 rounded-2xl px-3 pb-4 pt-8"
      >
        <div className="relative grid place-items-center">
          {/* Halo en forme de Poké Ball, qui tourne au survol */}
          <PokeballDecor className="absolute h-[115%] w-[115%] text-(--teinte) opacity-25 transition duration-500 group-hover:rotate-45 group-hover:opacity-40 motion-reduce:transition-none motion-reduce:group-hover:rotate-0" />
          {/* Même nom de transition que l'image de la fiche : le navigateur la fait « voler » */}
          <ViewTransition name={`pokemon-${pokemon.id}`} share="morph" default="none">
            <ImagePokemon
              src={pokemon.image}
              alt={pokemon.nomFr}
              taille={128}
              sizes="(min-width: 640px) 128px, 112px"
              className="relative h-28 w-28 object-contain drop-shadow-lg transition duration-300 group-hover:scale-110 motion-reduce:transition-none motion-reduce:group-hover:scale-100 sm:h-32 sm:w-32"
            />
          </ViewTransition>
        </div>
        <p className="mt-1 font-mono text-xs text-gray-600 dark:text-gray-400">{numero}</p>
        <h2 className="text-center font-semibold leading-tight">{pokemon.nomFr}</h2>
        <div className="mt-1 flex flex-wrap justify-center gap-1">
          {pokemon.types.map((type) => (
            <BadgeType key={type} type={type} />
          ))}
        </div>
      </Link>

      {/* Les boutons sont SORTIS du lien : un bouton dans un lien pose problème au clic et à l'accessibilité. */}
      <div className="absolute left-2 top-2 z-10">
        <BoutonFavori nom={pokemon.nom} nomAffiche={pokemon.nomFr} />
      </div>
      <div className="absolute right-2 top-2 z-10">
        <BoutonAjoutRapide pokemon={pokemon} />
      </div>
    </article>
  );
}
