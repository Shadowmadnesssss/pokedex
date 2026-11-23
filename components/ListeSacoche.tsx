"use client";

import Link from "next/link";
import { useState } from "react";
import BadgeType from "@/components/BadgeType";
import ImagePokemon from "@/components/ImagePokemon";
import TypesCouverts from "@/components/TypesCouverts";
import { useStoresHydrates } from "@/hooks/useStoresHydrates";
import { formaterNumero } from "@/lib/conversion";
import { TAILLE_MAX, useSacoche } from "@/stores/sacoche";
import type { MembreEquipe } from "@/types/pokemon";

export default function ListeSacoche() {
  const hydrate = useStoresHydrates();
  const equipe = useSacoche((etat) => etat.equipe);
  const libres = TAILLE_MAX - equipe.length;

  if (!hydrate) {
    return (
      <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3" aria-hidden="true">
        {Array.from({ length: TAILLE_MAX }, (_, i) => (
          <li key={i} className="h-40 animate-pulse rounded-2xl bg-gray-200 motion-reduce:animate-none dark:bg-gray-800" />
        ))}
      </ul>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="font-semibold tabular-nums">
          {equipe.length} / {TAILLE_MAX} Pokémon
        </p>
        <BoutonVider />
      </div>

      <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {equipe.map((membre) => (
          <li key={membre.id}>
            <CarteMembre membre={membre} />
          </li>
        ))}
        {/* Les emplacements libres sont dessinés, pas cachés : chacun ramène à la liste. */}
        {Array.from({ length: libres }, (_, i) => (
          <li key={`libre-${i}`}>
            <Link
              href="/"
              className="flex h-full min-h-40 flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-gray-300 text-gray-600 transition hover:border-accent hover:text-accent dark:border-gray-700 dark:text-gray-400"
            >
              <span aria-hidden="true" className="text-3xl">
                +
              </span>
              <span className="text-sm font-semibold">Emplacement libre — ajouter un Pokémon</span>
            </Link>
          </li>
        ))}
      </ul>

      <TypesCouverts />
    </div>
  );
}

function CarteMembre({ membre }: { membre: MembreEquipe }) {
  const renommer = useSacoche((etat) => etat.renommer);
  const retirer = useSacoche((etat) => etat.retirer);
  const idChamp = `surnom-${membre.id}`;
  const surnom = membre.surnom?.trim();

  return (
    <article className="flex h-full animate-apparition gap-4 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm motion-reduce:animate-none dark:border-gray-800 dark:bg-gray-900">
      <Link href={`/pokemon/${membre.nom}`} className="shrink-0 rounded-xl">
        <ImagePokemon src={membre.image} alt={membre.nomFr} taille={96} className="h-24 w-24 drop-shadow-md" />
      </Link>
      <div className="flex min-w-0 flex-1 flex-col gap-2">
        <div>
          <p className="font-mono text-xs text-gray-600 dark:text-gray-400">{formaterNumero(membre.id)}</p>
          <h2 className="truncate font-bold">
            {surnom || membre.nomFr}
            {surnom && (
              <span className="font-normal text-gray-600 dark:text-gray-400"> ({membre.nomFr})</span>
            )}
          </h2>
        </div>
        <div className="flex flex-wrap gap-1">
          {membre.types.map((t) => (
            <BadgeType key={t} type={t} />
          ))}
        </div>
        <label htmlFor={idChamp} className="sr-only">
          Surnom de {membre.nomFr}
        </label>
        <input
          id={idChamp}
          type="text"
          value={membre.surnom ?? ""}
          onChange={(e) => renommer(membre.id, e.target.value)}
          placeholder="Surnom (facultatif)"
          maxLength={20}
          className="w-full rounded-lg border border-gray-300 bg-transparent px-2 py-1 text-sm placeholder:text-gray-500 dark:border-gray-700"
        />
        <button
          type="button"
          onClick={() => retirer(membre.id)}
          className="self-start rounded text-sm font-semibold text-red-700 hover:underline dark:text-red-400"
        >
          Retirer<span className="sr-only"> {membre.nomFr}</span>
        </button>
      </div>
    </article>
  );
}

/** L'état « à confirmer » ne concerne que ce bouton : il reste dans un useState, pas dans le store. */
function BoutonVider() {
  const taille = useSacoche((etat) => etat.equipe.length);
  const vider = useSacoche((etat) => etat.vider);
  const [aConfirmer, setAConfirmer] = useState(false);

  if (taille === 0) return null;

  return (
    <button
      type="button"
      onClick={() => {
        if (aConfirmer) {
          vider();
          setAConfirmer(false);
        } else {
          setAConfirmer(true);
        }
      }}
      onBlur={() => setAConfirmer(false)}
      className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
        aConfirmer
          ? "bg-accent text-white hover:bg-red-700"
          : "border border-gray-300 hover:bg-gray-100 dark:border-gray-700 dark:hover:bg-gray-800"
      }`}
    >
      {aConfirmer ? "Confirmer ?" : "Vider la sacoche"}
    </button>
  );
}
