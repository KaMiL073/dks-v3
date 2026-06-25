import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { isAbsolute, resolve } from "node:path";
import test from "node:test";

const defaultUrlsFile = resolve("tests/canonical-urls.txt");
const urlsFile = resolvePath(process.env.CANONICAL_URLS_FILE || defaultUrlsFile);
const fetchBaseUrl = (process.env.CANONICAL_BASE_URL || "http://localhost:3000").replace(/\/$/, "");
const timeoutMs = Number(process.env.CANONICAL_TIMEOUT_MS || 15000);

function resolvePath(pathname) {
  return isAbsolute(pathname) ? pathname : resolve(pathname);
}

function normalizeUrl(value) {
  const url = new URL(value);
  url.hash = "";

  if (url.pathname !== "/") {
    url.pathname = url.pathname.replace(/\/+$/, "");
  }

  return url.toString();
}

function getFetchUrl(value) {
  if (!fetchBaseUrl) return value;

  const url = new URL(value);
  return `${fetchBaseUrl}${url.pathname}${url.search}`;
}

function parseUrls(input) {
  return Array.from(input.matchAll(/https?:\/\/[^\s<>"']+/g), ([url]) =>
    url.replace(/[),.;]+$/, "")
  );
}

function getCanonicalLinks(html) {
  return Array.from(
    html.matchAll(/<link\b(?=[^>]*\brel=["'][^"']*\bcanonical\b[^"']*["'])[^>]*>/gi),
    ([tag]) => {
      const href = tag.match(/\bhref=["']([^"']+)["']/i)?.[1];
      return href ? normalizeUrl(href) : "";
    }
  ).filter(Boolean);
}

function getLinkHeaderCanonical(headers) {
  const linkHeader = headers.get("link");
  if (!linkHeader) return null;

  for (const part of linkHeader.split(",")) {
    const match = part.match(/<([^>]+)>;\s*rel=["']?canonical["']?/i);
    if (match?.[1]) return normalizeUrl(match[1]);
  }

  return null;
}

async function fetchWithTimeout(url) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);

  try {
    return await fetch(url, {
      redirect: "follow",
      signal: controller.signal,
      headers: {
        "user-agent": "DKS canonical-link-test/1.0",
      },
    });
  } finally {
    clearTimeout(timeout);
  }
}

const fileContent = await readFile(urlsFile, "utf8");
const urls = parseUrls(fileContent);

test("canonical URL list is not empty", () => {
  assert.ok(urls.length > 0, `No URLs found in ${urlsFile}`);
});

for (const sourceUrl of urls) {
  const expectedCanonical = normalizeUrl(sourceUrl);

  test(`canonical: ${sourceUrl}`, async (context) => {
    const response = await fetchWithTimeout(getFetchUrl(sourceUrl));

    assert.ok(
      response.ok,
      `Expected 2xx response, got ${response.status} ${response.statusText}`
    );

    const contentType = response.headers.get("content-type") || "";

    if (!contentType.includes("text/html")) {
      const canonicalHeader = getLinkHeaderCanonical(response.headers);

      if (!canonicalHeader) {
        context.skip(
          `Pomijam zasób ${contentType || "non-HTML"} bez nagłówka Link canonical`
        );
        return;
      }

      assert.equal(
        canonicalHeader,
        expectedCanonical,
        "Non-HTML response must expose canonical through the HTTP Link header"
      );

      return;
    }

    const html = await response.text();
    const canonicalLinks = getCanonicalLinks(html);

    assert.equal(
      canonicalLinks.length,
      1,
      `Expected exactly one canonical link, found ${canonicalLinks.length}`
    );
    assert.equal(canonicalLinks[0], expectedCanonical);
  });
}
