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
      className="verre group relative animate-apparition overflow-hidden rounded-2xl border transition duration-300 hover:-translate-y-1 hover:border-accent/40 hover:shadow-[0_24px_60px_-20px_var(--teinte)] motion-reduce:animate-none motion-reduce:transition-none motion-reduce:hover:translate-y-0"
    >
      {/* Lueur de la couleur du type, derrière l'image */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-3/4 bg-[radial-gradient(ellipse_at_50%_35%,var(--teinte),transparent_65%)] opacity-25 transition duration-500 group-hover:opacity-45 motion-reduce:transition-none"
      />
      {/* Filet doré qui apparaît au survol */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-6 top-0 h-px bg-linear-to-r from-transparent via-accent/70 to-transparent opacity-0 transition duration-300 group-hover:opacity-100"
      />

      {/* Numéro en filigrane, en haut, derrière l'image : purement décoratif */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-1 select-none text-center font-display text-6xl font-semibold italic text-white/[0.05]"
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
          <PokeballDecor className="absolute h-[115%] w-[115%] text-white opacity-[0.06] transition duration-500 group-hover:rotate-45 group-hover:opacity-10 motion-reduce:transition-none motion-reduce:group-hover:rotate-0" />
          {/* Même nom de transition que l'image de la fiche : le navigateur la fait « voler » */}
          <ViewTransition name={`pokemon-${pokemon.id}`} share="morph" default="none">
            <ImagePokemon
              src={pokemon.image}
              alt={pokemon.nomFr}
              taille={128}
              sizes="(min-width: 640px) 128px, 112px"
              className="relative h-28 w-28 object-contain drop-shadow-[0_12px_18px_rgb(0_0_0/0.55)] transition duration-300 group-hover:scale-110 motion-reduce:transition-none motion-reduce:group-hover:scale-100 sm:h-32 sm:w-32"
            />
          </ViewTransition>
        </div>
        <p className="mt-2 font-mono text-[10px] tracking-[0.2em] text-accent/80">{numero}</p>
        <h2 className="text-center font-display text-xl font-semibold leading-tight text-gray-50">{pokemon.nomFr}</h2>
        <div className="mt-1.5 flex flex-wrap justify-center gap-1">
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
