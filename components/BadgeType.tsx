import { estUnType, TYPES } from "@/lib/types-pokemon";

type Props = { type: string; taille?: "sm" | "md" };

export default function BadgeType({ type, taille = "sm" }: Props) {
  const info = estUnType(type) ? TYPES[type] : { libelle: type, classes: "bg-gray-400 text-gray-950" };
  const dimensions = taille === "md" ? "px-3 py-1 text-sm" : "px-2 py-0.5 text-xs";
  return (
    <span className={`inline-block rounded-full font-semibold ${dimensions} ${info.classes}`}>
      {info.libelle}
    </span>
  );
}
