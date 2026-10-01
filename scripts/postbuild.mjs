/**
 * Postbuild para GitHub Pages (SPA con rutas limpias, sin HashRouter).
 *
 * Qué hace, en orden:
 *   1. Copia dist/index.html a dist/404.html (respaldo de GitHub Pages).
 *   2. Genera dist/<ruta>/index.html para cada ruta estática del router.
 *   3. Muestra un resumen de rutas estáticas y rutas dinámicas.
 *
 * La lista de rutas se lee de la definición real del router del proyecto
 * (src/App.tsx). Si la extracción automática falla, se usa el array
 * `FALLBACK_ROUTES` de abajo: ajústalo a mano si agregas rutas nuevas.
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const OUT_DIR = path.join(ROOT, "dist");
const ROUTER_FILE = path.join(ROOT, "src", "App.tsx");

// Rutas relativas a `base` (sin barra inicial y sin barra final).
// Solo como respaldo si no se puede leer el router del proyecto.
const FALLBACK_ROUTES = ["", "projects", "work-experience", "about"];

/** Rutas que contienen parámetros dinámicos: no pueden tener carpeta propia. */
const isDynamic = (route) => /[:*]/.test(route);

/**
 * Extrae las rutas del array `routes` definido en el router.
 * Ignora rutas dinámicas para la generación de carpetas estáticas.
 */
function readRoutesFromRouter() {
  if (!fs.existsSync(ROUTER_FILE)) return [];

  const source = fs.readFileSync(ROUTER_FILE, "utf8");
  const match = source.match(/const\s+routes\s*=\s*\[([\s\S]*?)\]\s*as\s+const/);
  if (!match) return [];

  return [...match[1].matchAll(/\blink:\s*["'`]([^"'`]*)["'`]/g)].map(
    (m) => m[1],
  );
}

/** Limpia una ruta: sin barras al inicio ni al final. "" = home. */
function normalize(route) {
  return route.replace(/^\/+/, "").replace(/\/+$/, "");
}

/** Verifica que `dist/index.html` exista y devuelve su contenido. */
function readIndexHtml() {
  const indexPath = path.join(OUT_DIR, "index.html");
  if (!fs.existsSync(indexPath)) {
    throw new Error(`No se encontró ${indexPath}. ¿Falló el build?`);
  }
  return fs.readFileSync(indexPath, "utf8");
}

/**
 * Reescribe las referencias relativas de assets (./assets/...) a rutas
 * absolutas con `base`, para que las páginas anidadas carguen los assets.
 */
function absolutizeAssets(html) {
  return html.replace(/(["'])\.\/assets\//g, `$1/${getBase()}assets/`);
}

/** Lee `base` desde vite.config.ts para no duplicar el valor a mano. */
function getBase() {
  const configPath = path.join(ROOT, "vite.config.ts");
  if (fs.existsSync(configPath)) {
    const match = fs.readFileSync(configPath, "utf8").match(
      /base:\s*["'`]([^"'`]*)["'`]/,
    );
    if (match) return match[1].replace(/\/+$/, "");
  }
  return "";
}

function main() {
  const html = readIndexHtml();
  const pageHtml = absolutizeAssets(html);

  const extracted = readRoutesFromRouter();
  const routes = extracted.length > 0 ? extracted : FALLBACK_ROUTES;
  const source = extracted.length > 0 ? "src/App.tsx" : "FALLBACK_ROUTES";

  fs.writeFileSync(path.join(OUT_DIR, "404.html"), pageHtml);

  const staticRoutes = [];
  const dynamicRoutes = [];

  for (const raw of routes) {
    const route = normalize(raw);
    if (isDynamic(route)) {
      dynamicRoutes.push(route);
      continue;
    }
    staticRoutes.push(route);

    const dir = route === "" ? OUT_DIR : path.join(OUT_DIR, route);
    fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(path.join(dir, "index.html"), pageHtml);
  }

  const base = getBase();
  console.log(`[postbuild] base: "${base}/" (rutas leídas de ${source})`);
  console.log(
    `[postbuild] 404.html generado para rutas dinámicas o desconocidas`,
  );
  console.log("[postbuild] rutas estáticas con HTTP 200:");
  for (const route of staticRoutes) {
    console.log(`  ${base}/${route}${route === "" ? "" : "/"}`);
  }
  if (dynamicRoutes.length > 0) {
    console.log("[postbuild] rutas dinámicas (sirven 404.html, renderiza la app):");
    for (const route of dynamicRoutes) {
      console.log(`  ${base}/${route}`);
    }
  }
}

main();