import { SqueletteGrille } from "@/components/Squelettes";

/** Suspense automatique autour de la page entière. */
export default function Chargement() {
  return (
    <div className="space-y-6">
      <div className="h-10 w-64 animate-pulse rounded bg-gray-200 dark:bg-gray-800" />
      <SqueletteGrille />
    </div>
  );
}
