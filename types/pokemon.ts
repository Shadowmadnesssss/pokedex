// ---------- Réponses brutes de la PokéAPI (seulement les champs utiles) ----------

export type RessourceNommee = { name: string; url: string };

export type PokemonApi = {
  id: number;
  name: string;
  height: number; // décimètres
  weight: number; // hectogrammes
  types: { slot: number; type: RessourceNommee }[];
  stats: { base_stat: number; stat: RessourceNommee }[];
  species: RessourceNommee;
  sprites: {
    front_default: string | null;
    other?: { "official-artwork"?: { front_default: string | null } };
  };
};

export type ListeApi = {
  count: number;
  results: RessourceNommee[];
};

export type TypeApi = {
  pokemon: { pokemon: RessourceNommee }[];
};

export type EspeceApi = {
  names: { name: string; language: RessourceNommee }[];
  evolution_chain: { url: string } | null;
};

export type MaillonApi = {
  species: RessourceNommee;
  evolves_to: MaillonApi[];
};

export type ChaineApi = {
  chain: MaillonApi;
};

// ---------- Types manipulés par l'application : simples et à plat ----------

export type Statistique = {
  cle: string; // "hp", "attack"...
  valeur: number;
};

export type Pokemon = {
  id: number;
  nom: string; // nom de l'API, en anglais : sert d'identifiant dans les adresses
  nomFr: string; // nom affiché
  image: string | null;
  types: string[];
  taille: number; // mètres
  poids: number; // kilogrammes
  stats: Statistique[];
  urlEspece: string;
};

export type ReferencePokemon = {
  id: number;
  nom: string;
  nomFr?: string;
};

/** Ce qu'on garde d'un Pokémon dans la sacoche. */
export type MembreEquipe = Pick<Pokemon, "id" | "nom" | "nomFr" | "image" | "types"> & {
  surnom?: string;
};
