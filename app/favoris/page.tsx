import type { Metadata } from "next";
import ListeFavoris from "@/components/ListeFavoris";

export const metadata: Metadata = { title: "Favoris" };

export default function PageFavoris() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-black tracking-tight">Mes favoris</h1>
      {/* Le serveur ne connaît pas vos favoris : la liste se charge dans le navigateur. */}
      <ListeFavoris />
    </div>
  );
}
