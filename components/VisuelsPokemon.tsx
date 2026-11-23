"use client";

import Image from "next/image";
import { useState, ViewTransition } from "react";
import ImagePokemon from "@/components/ImagePokemon";
import type { Pokemon } from "@/types/pokemon";

type Mode = "illustration" | "home" | "chromatique" | "anime";
type Option = { mode: Mode; libelle: string; src: string };

type Props = {
  pokemon: Pick<Pokemon, "id" | "nomFr" | "image" | "visuels">;
};

const IMAGE = "relative h-auto w-full drop-shadow-2xl";

/**
 * Bonus : choisir le visuel de la fiche.
 * L'état ne concerne que ce composant : un simple useState suffit.
 */
export default function VisuelsPokemon({ pokemon }: Props) {
  const [mode, setMode] = useState<Mode>("illustration");

  // On ne propose que les visuels qui existent pour ce Pokémon.
  const candidats: [Mode, string, string | null][] = [
    ["illustration", "Illustration", pokemon.image],
    ["home", "3D", pokemon.visuels.home],
    ["chromatique", "Chromatique", pokemon.visuels.homeChromatique],
    ["anime", "Animé", pokemon.visuels.anime],
  ];
  const options: Option[] = candidats.flatMap(([m, libelle, src]) =>
    src ? [{ mode: m, libelle, src }] : [],
  );
  const actuel = options.find((o) => o.mode === mode) ?? options[0];

  return (
    <div className="flex w-full flex-col items-center gap-4">
      <div className="grid aspect-square w-64 place-items-center sm:w-80">
        {!actuel || actuel.mode === "illustration" ? (
          // Même nom que l'image de la carte : c'est elle qui « vole » depuis la liste.
          <ViewTransition name={`pokemon-${pokemon.id}`} share="morph" default="none">
            <ImagePokemon
              src={pokemon.image}
              alt={`Illustration officielle de ${pokemon.nomFr}`}
              taille={400}
              sizes="(min-width: 640px) 320px, 256px"
              preload
              className={IMAGE}
            />
          </ViewTransition>
        ) : actuel.mode === "anime" ? (
          // GIF animé : unoptimized, sinon l'optimisation d'image figerait l'animation.
          <Image
            key={actuel.src}
            src={actuel.src}
            alt={`${pokemon.nomFr}, sprite animé`}
            width={96}
            height={96}
            unoptimized
            className="relative h-auto w-1/2 animate-apparition drop-shadow-2xl motion-reduce:animate-none"
          />
        ) : (
          <ImagePokemon
            key={actuel.src}
            src={actuel.src}
            alt={`${pokemon.nomFr}, rendu 3D${actuel.mode === "chromatique" ? " chromatique" : ""}`}
            taille={400}
            sizes="(min-width: 640px) 320px, 256px"
            className={`${IMAGE} animate-apparition motion-reduce:animate-none`}
          />
        )}
      </div>

      {options.length > 1 && (
        <div
          role="group"
          aria-label="Choisir le visuel"
          className="flex justify-center gap-0.5 rounded-full bg-white/70 p-1 shadow-sm backdrop-blur dark:bg-gray-900/70"
        >
          {options.map((o) => {
            const actif = o.mode === actuel?.mode;
            return (
              <button
                key={o.mode}
                type="button"
                aria-pressed={actif}
                onClick={() => setMode(o.mode)}
                className={`rounded-full px-2.5 py-1.5 text-sm font-semibold transition sm:px-3 ${
                  actif
                    ? "bg-gray-900 text-white dark:bg-white dark:text-gray-900"
                    : "text-gray-800 hover:bg-white dark:text-gray-200 dark:hover:bg-gray-800"
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
