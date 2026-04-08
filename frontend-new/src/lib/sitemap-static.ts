import fs from "node:fs";
import path from "node:path";

function getAppDir(): string {
  const srcAppDir = path.join(process.cwd(), "src", "app");
  const appDir = path.join(process.cwd(), "app");

  if (fs.existsSync(srcAppDir)) return srcAppDir;
  if (fs.existsSync(appDir)) return appDir;

  throw new Error("Nie znaleziono katalogu app ani src/app");
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

  const routes = walk(appDir).filter((route) => {
    if (route === "/sitemap" || route === "/robots") return false;
    if (route.includes("/page/")) return false; // paginacja
    if (route.includes("/marki/")) return false; // marki dodajemy ręcznie
    return true;
  });

  return Array.from(new Set(routes)).sort();
}