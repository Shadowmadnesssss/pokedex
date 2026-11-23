"use client";

import Image from "next/image";
import { useState, type CSSProperties } from "react";
import ImagePokemon from "@/components/ImagePokemon";
import type { Pokemon } from "@/types/pokemon";

type Mode = "illustration" | "home" | "chromatique" | "anime";
type Option = { mode: Mode; libelle: string; src: string };

type Props = {
  pokemon: Pick<Pokemon, "nomFr" | "image" | "visuels" | "types">;
  numero: string;
};

/**
 * Bonus : choisir le visuel de la fiche.
 * L'état ne concerne que ce composant : un simple useState suffit.
 */
export default function VisuelsPokemon({ pokemon, numero }: Props) {
  const [mode, setMode] = useState<Mode>("illustration");

  // On ne propose que les visuels qui existent pour ce Pokémon.
  const candidats: [Mode, string, string | null][] = [
    ["illustration", "Illustration", pokemon.image],
    ["home", "3D", pokemon.visuels.home],
    ["chromatique", "3D chromatique", pokemon.visuels.homeChromatique],
    ["anime", "Animé", pokemon.visuels.anime],
  ];
  const options: Option[] = candidats.flatMap(([m, libelle, src]) =>
    src ? [{ mode: m, libelle, src }] : [],
  );

  const actuel = options.find((o) => o.mode === mode) ?? options[0];
  const teinte = { "--teinte": `var(--color-type-${pokemon.types[0]})` } as CSSProperties;

  return (
    <div className="flex w-full max-w-md flex-col items-center gap-3 justify-self-center">
      <div
        style={teinte}
        className="relative flex aspect-square w-full items-center justify-center overflow-hidden rounded-3xl bg-linear-to-br from-(--teinte)/40 to-(--teinte)/5"
      >
        <span
          aria-hidden="true"
          className="pointer-events-none absolute bottom-2 right-4 select-none text-7xl font-black text-gray-900/10 dark:text-white/10"
        >
          {numero}
        </span>

        {!actuel || actuel.mode === "illustration" ? (
          // L'illustration est l'image principale : préchargée pour un bon score Lighthouse.
          <ImagePokemon
            src={pokemon.image}
            alt={`Illustration officielle de ${pokemon.nomFr}`}
            taille={400}
            sizes="(min-width: 768px) 400px, 85vw"
            preload
            className="relative h-auto w-4/5 animate-apparition drop-shadow-2xl motion-reduce:animate-none"
          />
        ) : actuel.mode === "anime" ? (
          // GIF animé : unoptimized, sinon l'optimisation d'image figerait l'animation.
          <Image
            key={actuel.src}
            src={actuel.src}
            alt={`${pokemon.nomFr}, sprite animé`}
            width={96}
            height={96}
            unoptimized
            className="relative h-auto w-2/5 animate-apparition drop-shadow-2xl motion-reduce:animate-none"
          />
        ) : (
          <ImagePokemon
            key={actuel.src}
            src={actuel.src}
            alt={`${pokemon.nomFr}, rendu 3D${actuel.mode === "chromatique" ? " chromatique" : ""}`}
            taille={400}
            sizes="(min-width: 768px) 400px, 85vw"
            className="relative h-auto w-4/5 animate-apparition drop-shadow-2xl motion-reduce:animate-none"
          />
        )}
      </div>

      {options.length > 1 && (
        <div
          role="group"
          aria-label="Choisir le visuel"
          className="flex flex-wrap justify-center gap-1 rounded-full border border-gray-200 bg-white p-1 dark:border-gray-800 dark:bg-gray-900"
        >
          {options.map((o) => {
            const actif = o.mode === actuel?.mode;
            return (
              <button
                key={o.mode}
                type="button"
                aria-pressed={actif}
                onClick={() => setMode(o.mode)}
                className={`rounded-full px-3 py-1.5 text-sm font-semibold transition ${
                  actif
                    ? "bg-gray-900 text-white dark:bg-white dark:text-gray-900"
                    : "text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
                }`}
              >
                {o.libelle}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
