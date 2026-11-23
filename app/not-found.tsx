import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = { title: "Introuvable" };

export default function Introuvable() {
  return (
    <div className="mx-auto max-w-md space-y-4 py-16 text-center">
      <p aria-hidden="true" className="font-display text-8xl font-semibold italic text-accent/40">
        404
      </p>
      <h1 className="text-2xl font-bold">Ce Pokémon s’est enfui…</h1>
      <p className="text-gray-600 dark:text-gray-400">
        La page ou le Pokémon demandé n’existe pas. Vérifiez l’orthographe, ou repartez de la liste.
      </p>
      <Link
        href="/"
        className="inline-block rounded-full px-6 py-2.5 font-semibold transition bouton-or"
      >
        Retour au Pokédex
      </Link>
    </div>
  );
}
