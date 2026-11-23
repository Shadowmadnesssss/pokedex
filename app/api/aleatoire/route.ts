import { connection } from "next/server";
import { recupererTousLesNoms } from "@/lib/pokeapi";

/** GET /api/aleatoire → { nom, id } d'un Pokémon tiré au sort. */
export async function GET() {
  // Attendre une vraie requête : sinon Next.js préparerait la réponse à l'avance
  // et le tirage serait le même pour tout le monde.
  await connection();
  const tous = await recupererTousLesNoms();
  const tire = tous[Math.floor(Math.random() * tous.length)];
  return Response.json({ nom: tire.nom, id: tire.id }, { headers: { "Cache-Control": "no-store" } });
}
