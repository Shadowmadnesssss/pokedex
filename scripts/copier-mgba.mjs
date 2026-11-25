// Copie le cœur de l'émulateur mGBA (WebAssembly) dans public/mgba.
// mgba.js doit être servi depuis le même domaine que la page : il démarre ses
// threads (Web Workers) à partir de sa propre adresse. Lancé après chaque npm install.
import { copyFileSync, existsSync, mkdirSync } from "node:fs";

const source = "node_modules/@thenick775/mgba-wasm/dist";
const destination = "public/mgba";

if (!existsSync(source)) {
  console.warn("mgba-wasm absent : copie ignorée");
} else {
  mkdirSync(destination, { recursive: true });
  for (const fichier of ["mgba.js", "mgba.wasm"]) {
    copyFileSync(`${source}/${fichier}`, `${destination}/${fichier}`);
  }
  console.log("mGBA copié dans public/mgba");
}
