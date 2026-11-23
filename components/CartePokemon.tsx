import Link from "next/link";
import type { CSSProperties } from "react";
import BadgeType from "@/components/BadgeType";
import BoutonAjoutRapide from "@/components/BoutonAjoutRapide";
import BoutonFavori from "@/components/BoutonFavori";
import ImagePokemon from "@/components/ImagePokemon";
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
      className="group relative animate-apparition overflow-hidden rounded-2xl border border-gray-200 bg-white bg-linear-to-br from-(--teinte)/25 to-transparent to-70% shadow-sm transition duration-200 hover:-translate-y-1 hover:shadow-lg motion-reduce:animate-none motion-reduce:transition-none motion-reduce:hover:translate-y-0 dark:border-gray-800 dark:bg-gray-900 dark:from-(--teinte)/30"
    >
      {/* Numéro en filigrane, purement décoratif */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -right-1 bottom-12 select-none text-5xl font-black text-gray-900/5 dark:text-white/5"
      >
        {numero}
      </span>

      <Link
        href={`/pokemon/${pokemon.nom}`}
        className="relative flex flex-col items-center gap-1 rounded-2xl px-3 pb-4 pt-8"
      >
        <ImagePokemon
          src={pokemon.image}
          alt={pokemon.nomFr}
          taille={128}
          sizes="(min-width: 640px) 128px, 112px"
          className="h-28 w-28 object-contain drop-shadow-lg transition duration-300 group-hover:scale-110 motion-reduce:transition-none motion-reduce:group-hover:scale-100 sm:h-32 sm:w-32"
        />
        <p className="font-mono text-xs text-gray-600 dark:text-gray-400">{numero}</p>
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
