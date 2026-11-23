import IconeType from "@/components/IconeType";
import { estUnType, TYPES } from "@/lib/types-pokemon";

type Props = { type: string; taille?: "sm" | "md"; icone?: boolean };

export default function BadgeType({ type, taille = "sm", icone = false }: Props) {
  if (!estUnType(type)) {
    return <span className="rounded-full bg-gray-400 px-2 py-0.5 text-xs font-semibold">{type}</span>;
  }
  const dimensions =
    taille === "md"
      ? `${icone ? "pl-1 pr-3" : "px-3"} py-1 text-sm gap-1.5`
      : `${icone ? "pl-0.5 pr-2" : "px-2"} py-0.5 text-xs gap-1`;
  return (
    <span
      className={`inline-flex items-center rounded-full font-semibold ${dimensions} ${TYPES[type].classes}`}
    >
      {icone && <IconeType type={type} taille={taille === "md" ? 20 : 16} />}
      {TYPES[type].libelle}
    </span>
  );
}
