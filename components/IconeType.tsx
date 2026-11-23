import Image from "next/image";
import { iconeType, type NomType } from "@/lib/types-pokemon";

/** Icône officielle du type. Décorative : le libellé est toujours écrit à côté. */
type Props = { type: NomType; taille?: number; immediat?: boolean };

export default function IconeType({ type, taille = 18, immediat = false }: Props) {
  return (
    <Image
      src={iconeType(type)}
      alt=""
      width={taille}
      height={taille}
      loading={immediat ? "eager" : "lazy"}
      className="shrink-0 rounded-[30%]"
    />
  );
}
