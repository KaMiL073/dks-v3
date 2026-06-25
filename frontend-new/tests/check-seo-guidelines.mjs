#!/usr/bin/env node

import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";

const DEFAULT_GUIDELINES_PATH = fileURLToPath(
  new URL("./wytyczne.txt", import.meta.url)
);

const BASE_URL = process.env.BASE_URL || "http://localhost:3000";
const CONCURRENCY = Number(process.env.CONCURRENCY || 6);

function usage() {
  console.log(`Użycie:
  npm run check:seo -- [plik-z-wytycznymi.txt]
  node frontend-new/tests/check-seo-guidelines.mjs [plik-z-wytycznymi.txt]

Domyślnie skrypt sprawdza frontend pod:
  ${BASE_URL}

Przykłady:
  npm run check:seo -- ./wytyczne.txt
  cd frontend-new && npm run check:seo
  BASE_URL=http://localhost:3001 npm run check:seo -- ./wytyczne.txt
  BASE_URL=https://dks.pl npm run check:seo -- ./wytyczne.txt

Zmienne opcjonalne:
  BASE_URL=http://localhost:3000
  CONCURRENCY=6
`);
}

function normalizePath(rawUrl) {
  const url = new URL(rawUrl);
  const path = decodeURI(url.pathname).replace(/\/+$/, "");
  return path || "/";
}

function normalizeValue(value) {
  return String(value ?? "")
    .replace(/\s+/g, " ")
    .trim();
}

function decodeHtmlEntities(value) {
  const named = {
    amp: "&",
    lt: "<",
    gt: ">",
    quot: '"',
    apos: "'",
    nbsp: " ",
  };

  return String(value ?? "").replace(
    /&(#x[0-9a-f]+|#\d+|[a-z]+);/gi,
    (entity, code) => {
      const lower = code.toLowerCase();

      if (lower.startsWith("#x")) {
        return String.fromCodePoint(Number.parseInt(lower.slice(2), 16));
      }

      if (lower.startsWith("#")) {
        return String.fromCodePoint(Number.parseInt(lower.slice(1), 10));
      }

      return named[lower] ?? entity;
    }
  );
}

function stripTags(value) {
  return String(value ?? "")
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .replace(/<style[\s\S]*?<\/style>/gi, "")
    .replace(/<[^>]+>/g, " ");
}

function parseGuidelines(text) {
  const titles = [];
  const h1 = [];

  const titlePattern =
    /Proszę o zmianę title z\s+"[^"]*"\s+na\s+"([^"]+)"\s+dla\s+(https?:\/\/\S+)/g;
  const h1Pattern =
    /Proszę o dodanie nagłówka H1:\s+(.+?)\s+dla\s+(https?:\/\/\S+)/g;

  for (const match of text.matchAll(titlePattern)) {
    titles.push({
      type: "title",
      path: normalizePath(match[2]),
      expected: normalizeValue(match[1]),
    });
  }

  for (const match of text.matchAll(h1Pattern)) {
    h1.push({
      type: "h1",
      path: normalizePath(match[2]),
      expected: normalizeValue(match[1]),
    });
  }

  return { titles, h1 };
}

function pageUrl(path) {
  const base = BASE_URL.endsWith("/") ? BASE_URL : `${BASE_URL}/`;
  return new URL(path.replace(/^\//, ""), base).toString();
}

function getTitle(html) {
  const match = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
  return normalizeValue(decodeHtmlEntities(stripTags(match?.[1] ?? "")));
}

function getH1(html) {
  return [...html.matchAll(/<h1\b[^>]*>([\s\S]*?)<\/h1>/gi)]
    .map((match) => normalizeValue(decodeHtmlEntities(stripTags(match[1]))))
    .filter(Boolean);
}

async function fetchPage(path) {
  const url = pageUrl(path);

  try {
    const response = await fetch(url, {
      headers: {
        accept: "text/html,application/xhtml+xml",
        "user-agent": "dks-seo-guidelines-check/1.0",
      },
      redirect: "follow",
    });

    const html = await response.text();

    return {
      path,
      url,
      ok: response.ok,
      status: response.status,
      html,
      finalUrl: response.url,
      error: null,
    };
  } catch (error) {
    return {
      path,
      url,
      ok: false,
      status: 0,
      html: "",
      finalUrl: url,
      error: error instanceof Error ? error.message : String(error),
    };
  }
}

async function mapLimit(items, limit, worker) {
  const results = new Array(items.length);
  let index = 0;

  async function run() {
    while (index < items.length) {
      const current = index;
      index += 1;
      results[current] = await worker(items[current], current);
    }
  }

  await Promise.all(
    Array.from({ length: Math.min(limit, items.length) }, () => run())
  );

  return results;
}

function uniquePaths(...groups) {
  return [...new Set(groups.flat().map((item) => item.path))].sort();
}

function checkTitles(expected, pages) {
  return expected.map((item) => {
    const page = pages.get(item.path);
    const actual = page ? getTitle(page.html) : "";

    return {
      ...item,
      url: page?.url ?? pageUrl(item.path),
      status: page?.status ?? 0,
      finalUrl: page?.finalUrl ?? "",
      error: page?.error ?? null,
      actual,
      ok: page?.ok === true && actual === item.expected,
    };
  });
}

function checkH1(expected, pages) {
  return expected.map((item) => {
    const page = pages.get(item.path);
    const h1 = page ? getH1(page.html) : [];

    return {
      ...item,
      url: page?.url ?? pageUrl(item.path),
      status: page?.status ?? 0,
      finalUrl: page?.finalUrl ?? "",
      error: page?.error ?? null,
      actual: h1.join(" | "),
      h1,
      ok: page?.ok === true && h1.includes(item.expected),
    };
  });
}

function printSection(label, rows) {
  const failed = rows.filter((row) => !row.ok);
  const httpFailed = rows.filter((row) => row.status < 200 || row.status >= 400);

  console.log(`\n${label}`);
  console.log(`  sprawdzono: ${rows.length}`);
  console.log(`  OK: ${rows.length - failed.length}`);
  console.log(`  błędy: ${failed.length}`);
  console.log(`  błędy HTTP: ${httpFailed.length}`);

  if (failed.length === 0) return;

  console.log("\n  Niezgodności:");
  for (const row of failed) {
    console.log(`  - ${row.path}`);
    console.log(`    URL: ${row.url}`);
    console.log(`    HTTP: ${row.status}${row.error ? ` (${row.error})` : ""}`);
    if (row.finalUrl && row.finalUrl !== row.url) {
      console.log(`    final URL: ${row.finalUrl}`);
    }
    console.log(`    oczekiwane: ${row.expected}`);
    console.log(`    aktualne:   ${row.actual || "(puste/brak)"}`);
  }
}

async function main() {
  const arg = process.argv[2];

  if (arg === "-h" || arg === "--help") {
    usage();
    return;
  }

  const guidelinesPath = resolve(arg || DEFAULT_GUIDELINES_PATH);

  if (!existsSync(guidelinesPath)) {
    console.error(`Nie znaleziono pliku z wytycznymi: ${guidelinesPath}`);
    usage();
    process.exit(2);
  }

  const text = readFileSync(guidelinesPath, "utf8");
  const { titles, h1 } = parseGuidelines(text);
  const paths = uniquePaths(titles, h1);

  console.log(`Plik wytycznych: ${guidelinesPath}`);
  console.log(`Frontend: ${BASE_URL}`);
  console.log(`Znaleziono title: ${titles.length}`);
  console.log(`Znaleziono H1: ${h1.length}`);
  console.log(`Unikalne URL-e do sprawdzenia: ${paths.length}`);

  const fetched = await mapLimit(paths, CONCURRENCY, fetchPage);
  const pages = new Map(fetched.map((page) => [page.path, page]));

  const titleRows = checkTitles(titles, pages);
  const h1Rows = checkH1(h1, pages);

  printSection("Meta title <title>", titleRows);
  printSection("Nagłówki H1", h1Rows);

  const failed = [...titleRows, ...h1Rows].filter((row) => !row.ok);

  if (failed.length > 0) {
    console.log(`\nWynik: NIEZGODNE (${failed.length})`);
    process.exit(1);
  }

  console.log("\nWynik: OK");
}

main();
