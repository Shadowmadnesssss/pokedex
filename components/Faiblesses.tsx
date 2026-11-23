import BadgeType from "@/components/BadgeType";
import { recupererFaiblesses } from "@/lib/pokeapi";

const GROUPES = [
  { multiplicateur: 4, titre: "Très vulnérable", badge: "×4" },
  { multiplicateur: 2, titre: "Vulnérable", badge: "×2" },
  { multiplicateur: 0.5, titre: "Résistant", badge: "×½" },
  { multiplicateur: 0.25, titre: "Très résistant", badge: "×¼" },
  { multiplicateur: 0, titre: "Immunisé", badge: "×0" },
];

/** Dégâts subis selon le type de l'attaque, calculés à partir des relations de /type/{nom}. */
export default async function Faiblesses({ types }: { types: string[] }) {
  const faiblesses = await recupererFaiblesses(types);

  return (
    <dl className="space-y-3">
      {GROUPES.map((g) => {
        const liste = faiblesses.filter((f) => f.multiplicateur === g.multiplicateur);
        if (liste.length === 0) return null;
        return (
          <div key={g.multiplicateur} className="grid gap-1.5 sm:grid-cols-[9rem_1fr] sm:items-start">
            <dt className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
              <span
                className={`inline-block min-w-9 rounded-md px-1.5 py-0.5 text-center font-mono text-xs font-bold ${
                  g.multiplicateur > 1
                    ? "bg-rose-500/15 text-rose-300 ring-1 ring-inset ring-rose-400/30"
                    : "bg-emerald-500/15 text-emerald-300 ring-1 ring-inset ring-emerald-400/30"
                }`}
              >
                {g.badge}
              </span>
              {g.titre}
            </dt>
            <dd className="flex flex-wrap gap-1">
              {liste.map((f) => (
                <BadgeType key={f.type} type={f.type} icone />
              ))}
            </dd>
          </div>
        );
      })}
    </dl>
  );
}
