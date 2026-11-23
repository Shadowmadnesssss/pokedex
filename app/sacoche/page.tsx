import type { Metadata } from "next";
import ListeSacoche from "@/components/ListeSacoche";

export const metadata: Metadata = { title: "Sacoche" };

export default function PageSacoche() {
  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <p className="surtitre">Équipe · six places</p>
        <h1 className="font-display text-5xl font-semibold text-gray-50">Ma sacoche</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Composez votre équipe : six Pokémon au maximum, sans doublon.
        </p>
      </div>
      <ListeSacoche />
    </div>
  );
}
