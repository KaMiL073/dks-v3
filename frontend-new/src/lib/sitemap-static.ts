import fs from "node:fs";
import path from "node:path";

const fallbackStaticRoutes = [
  "/",
  "/blog",
  "/certyfikaty",
  "/kariera",
  "/klauzula-ochrony-danych-data-protection",
  "/kontakt",
  "/kontrakt-obslugi-serwisowej",
  "/o-firmie",
  "/ochrona-sygnalistow",
  "/oddzialy",
  "/oferta",
  "/oferta/produkty",
  "/oferta/rozwiazania-video",
  "/oferta/xsm-medyk",
  "/promocje",
  "/regulamin-platnosci-online",
  "/serwis-urzadzen-produkcyjnych",
  "/serwis-urzadzen-wielkoformatowych",
  "/serwis-urzadzen-wielofunkcyjnych",
  "/strefa-klienta",
  "/wydarzenia",
  "/zgloszenie-serwisowe",
] as const;

function getAppDir(): string | null {
  const srcAppDir = path.join(process.cwd(), "src", "app");
  const appDir = path.join(process.cwd(), "app");

  if (fs.existsSync(srcAppDir)) return srcAppDir;
  if (fs.existsSync(appDir)) return appDir;

  return null;
}

function shouldSkipSegment(segment: string): boolean {
  return (
    segment === "api" ||
    segment.startsWith("(") || // route groups
    segment.startsWith("[") || // dynamic routes
    segment.startsWith("_") // np. _components
  );
}

function walk(dir: string, baseRoute = ""): string[] {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  const routes: string[] = [];

  const hasPageFile = entries.some(
    (entry) => entry.isFile() && entry.name === "page.tsx"
  );

  if (hasPageFile) {
    routes.push(baseRoute || "/");
  }

  for (const entry of entries) {
    if (!entry.isDirectory()) continue;
    if (shouldSkipSegment(entry.name)) continue;

    const childDir = path.join(dir, entry.name);
    const childRoute = `${baseRoute}/${entry.name}`.replace(/\/+/g, "/");

    routes.push(...walk(childDir, childRoute));
  }

  return routes;
}

export function getStaticAppRoutes(): string[] {
  const appDir = getAppDir();

  if (!appDir) {
    return [...fallbackStaticRoutes];
  }

  const routes = walk(appDir).filter((route) => {
    if (route === "/sitemap" || route === "/robots") return false;
    if (route.includes("/page/")) return false; // paginacja
    if (route.includes("/marki/")) return false; // marki dodajemy ręcznie
    return true;
  });

  return Array.from(new Set(routes)).sort();
}
