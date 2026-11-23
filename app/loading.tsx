import { SqueletteGrille } from "@/components/Squelettes";

/** Suspense automatique autour de la page entière. */
export default function Chargement() {
  return (
    <div className="space-y-6">
      <div className="squelette h-10 w-64 rounded" />
      <SqueletteGrille />
    </div>
  );
}
