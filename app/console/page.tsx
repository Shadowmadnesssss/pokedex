import type { Metadata } from "next";
import Console from "@/components/console/Console";

export const metadata: Metadata = {
  title: "Console",
  description: "Une console rétro cachée dans le Pokédex.",
  // Page secrète : on demande aux moteurs de recherche de ne pas l'indexer.
  robots: { index: false, follow: false },
};

export default function PageConsole() {
  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <p className="surtitre">Easter egg · ↑ ↑ ↓ ↓ ← → ← → B A</p>
        <h1 className="font-display text-5xl font-semibold text-gray-50">Console</h1>
        <p className="max-w-prose text-gray-400">
          Une console portable rétro, propulsée par l’émulateur libre mGBA. Insérez vos propres
          cartouches : elles restent dans votre navigateur et ne sont jamais envoyées.
        </p>
      </div>
      <Console />
    </div>
  );
}
