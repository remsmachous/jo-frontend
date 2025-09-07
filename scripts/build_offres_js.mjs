/**
 * Génère src/data/offres.js à partir de l'API backend.
 * - BACKEND_URL peut être surchargée par process.env.BACKEND_URL (sans slash final).
 * - Par défaut: https://jobackend.fly.dev
 */
import { writeFile, mkdir } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname   = dirname(fileURLToPath(import.meta.url));
const BACKEND_URL = (process.env.BACKEND_URL || "https://jobackend.fly.dev").replace(/\/+$/, "");
const ENDPOINT    = `${BACKEND_URL}/api/offers/`;

const OUT_PATH = resolve(__dirname, "../src/data/offres.js");
const OUT_DIR  = dirname(OUT_PATH);

function toAbs(url) {
  if (!url) return "";
  if (/^https?:\/\//i.test(url)) return url;
  if (url.startsWith("/")) return `${BACKEND_URL}${url}`;
  return `${BACKEND_URL}/${url}`;
}
const js = (v) => JSON.stringify(v ?? "", null, 0);

function pick(obj, ...keys) {
  for (const k of keys) if (obj?.[k] != null) return k;
  return null;
}

function groupByCategory(items) {
  const buckets = { solo: [], duo: [], famille: [] };
  for (const o of items) {
    const key = (o.category || "solo").toLowerCase();
    (buckets[key] || buckets.solo).push(o);
  }
  return buckets;
}

function serializeItem(o) {
  // ID  panier
  const id = o.id ?? o.slug ?? null;               
  // Image 
  const image = toAbs(o.image_url || o.image || "");
  // ALT 
  const alt = o.alt ?? "";
  // Titre 
  const titre = (o.name || o.titre || "").trim();  
  const description = (o.description || "").trim();
  // Prix en nombre 
  const prix = Number(o.price ?? 0);
  // Label du bouton 
  const btnLabel = (o.btnLabel || "Ajouter au panier").trim();
  const btnHref = "/reservation";

  return `{ id: ${js(id)}, image: ${js(image)}, alt: ${js(alt)}, titre: ${js(titre)}, description: ${js(description)}, prix: ${prix}, btnLabel: ${js(btnLabel)}, btnClass: BTN_CLASS, btnHref: ${js(btnHref)} }`;
}

function serializeList(arr) {
  return "[\n  " + arr.map(serializeItem).join(",\n  ") + (arr.length ? "\n" : "") + "]";
}

async function main() {
  const res = await fetch(ENDPOINT, { headers: { Accept: "application/json" } });
  if (!res.ok) {
    const t = await res.text().catch(() => "");
    throw new Error(`Échec GET ${ENDPOINT} -> ${res.status} ${res.statusText} ${t}`);
  }
  const data   = await res.json();
  const offers = Array.isArray(data) ? data : (data?.results ?? []);

  const { solo = [], duo = [], famille = [] } = groupByCategory(offers);

  const header =
    "/**\n" +
    " * ⚠️ FICHIER GÉNÉRÉ AUTOMATIQUEMENT — NE PAS ÉDITER\n" +
    ` * Source: ${ENDPOINT}\n` +
    ` * Généré: ${new Date().toISOString()}\n` +
    " */\n\n";

  const body =
    'const BTN_CLASS = "btn btn-custom";\n\n' +
    `export const offresSolo = ${serializeList(solo)};\n\n` +
    `export const offresDuo = ${serializeList(duo)};\n\n` +
    `export const offresFamille = ${serializeList(famille)};\n\n` +
    "export default { offresSolo, offresDuo, offresFamille };\n";

  await mkdir(OUT_DIR, { recursive: true });
  await writeFile(OUT_PATH, header + body, "utf8");
  console.log(`✅ Généré: ${OUT_PATH} (solo:${solo.length}, duo:${duo.length}, famille:${famille.length})`);
}

main().catch((err) => {
  console.error("❌ Échec génération offres.js:", err);
  process.exit(1);
});
