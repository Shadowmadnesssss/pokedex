"use client"; // Une limite d'erreur réagit à un clic : composant client obligatoire.

import { useEffect } from "react";

export default function Erreur({ error, retry }: { error: unknown; retry: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  // L'erreur est typée unknown : en JavaScript on peut lever n'importe quelle valeur.
  const message = error instanceof Error ? error.message : "Erreur inconnue";

  return (
    <div className="mx-auto max-w-md space-y-4 py-16 text-center">
      <p aria-hidden="true" className="text-6xl">
        😵
      </p>
      <h1 className="text-2xl font-bold">Oups, la PokéAPI ne répond pas</h1>
      <p className="text-gray-600 dark:text-gray-400">
        Le chargement a échoué. Vérifiez votre connexion puis réessayez.
      </p>
      <p className="font-mono text-xs text-gray-600 dark:text-gray-400">{message}</p>
      <button
        type="button"
        onClick={() => retry()}
        className="rounded-full bg-accent px-6 py-2.5 font-semibold text-white shadow-sm transition hover:bg-red-700"
      >
        Réessayer
      </button>
    </div>
  );
}
