"use client";

import BadgeType from "@/components/BadgeType";
import { useTypesCouverts } from "@/hooks/useTypesCouverts";

/** Bonus : les types couverts par l'équipe, sous forme de badges. */
export default function TypesCouverts() {
  const types = useTypesCouverts();
  if (types.length === 0) return null;
  return (
    <section aria-labelledby="titre-types" className="space-y-2">
      <h2 id="titre-types" className="text-lg font-bold">
        Types couverts <span className="text-gray-600 dark:text-gray-400">({types.length}/18)</span>
      </h2>
      <div className="flex flex-wrap gap-1.5">
        {types.map((t) => (
          <BadgeType key={t} type={t} taille="md" />
        ))}
      </div>
    </section>
  );
}
