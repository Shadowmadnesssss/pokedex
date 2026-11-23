import { estUnType, type NomType } from "@/lib/types-pokemon";
import type { ReferencePokemon } from "@/types/pokemon";

export const PAR_PAGE = 24;

export type Parametres = {
  q: string;
  type: NomType | null;
  page: number;
};

type ParametresBruts = Record<string, string | string[] | undefined>;

function premier(valeur: string | string[] | undefined): string {
  return (Array.isArray(valeur) ? valeur[0] : valeur) ?? "";
}

/** Tout ce qui vient de l'adresse est saisi par l'utilisateur, donc non fiable : on vérifie. */
export function lireParametres(bruts: ParametresBruts): Parametres {
  const q = premier(bruts.q).trim().slice(0, 50);
  const type = premier(bruts.type);
  const page = Number.parseInt(premier(bruts.page), 10);
  return {
    q,
    type: estUnType(type) ? type : null,
    page: Number.isFinite(page) && page >= 1 ? page : 1,
  };
}

/** « Électrik » → « electrik » : la recherche ignore majuscules et accents. */
export function normaliser(texte: string): string {
  return texte
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "");
}

export function filtrer(liste: ReferencePokemon[], texte: string): ReferencePokemon[] {
  const cherche = normaliser(texte);
  if (!cherche) return liste;
  const numero = /^#?\d+$/.test(cherche) ? Number(cherche.replace("#", "")) : null;
  return liste.filter(
    (p) =>
      p.id === numero ||
      p.nom.includes(cherche) ||
      (p.nomFr !== undefined && normaliser(p.nomFr).includes(cherche)),
  );
}

/** Construit une adresse de la liste en conservant les paramètres utiles. */
export function adresseListe(p: { q?: string; type?: string | null; page?: number }): string {
  const params = new URLSearchParams();
  if (p.q) params.set("q", p.q);
  if (p.type) params.set("type", p.type);
  if (p.page && p.page > 1) params.set("page", String(p.page));
  const chaine = params.toString();
  return chaine ? `/?${chaine}` : "/";
}
