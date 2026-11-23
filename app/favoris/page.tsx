import type { Metadata } from "next";
import ListeFavoris from "@/components/ListeFavoris";

export const metadata: Metadata = { title: "Favoris" };

export default function PageFavoris() {
  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <p className="surtitre">Collection personnelle</p>
        <h1 className="font-display text-5xl font-semibold text-gray-50">Mes favoris</h1>
      </div>
      {/* Le serveur ne connaît pas vos favoris : la liste se charge dans le navigateur. */}
      <ListeFavoris />
    </div>
  );
}
