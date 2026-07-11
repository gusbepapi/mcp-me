#!/usr/bin/env node

// Patching the `@modelcontextprotocol/inspector` client bundle with our own translation dictionary, entirely within this repository, never touching the upstream project.

import { readFileSync, writeFileSync, readdirSync, existsSync } from "node:fs";
import { join, dirname, basename } from "node:path";
import { fileURLToPath } from "node:url";
import { createHash } from "node:crypto";

const HERE = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = join(HERE, "..");
const INSPECTOR_ASSETS_DIR = join(
  REPO_ROOT,
  "node_modules",
  "@modelcontextprotocol",
  "inspector",
  "client",
  "dist",
  "assets",
);
const DICTIONARY_PATH = join(REPO_ROOT, "i18n", "inspector", "pt-BR.json");
const BASELINE_PATH = join(REPO_ROOT, "i18n", "inspector", "baseline-strings-0.22.0.json");

function findBundleFile() {
  if (!existsSync(INSPECTOR_ASSETS_DIR)) {
    // `@modelcontextprotocol/inspector` is a `devDependency`; its absence is expected and correct under `npm install --omit=dev`, and must not block a legitimate production install. Returning null here, rather than throwing, so `main()` can skip patching quietly in this case
    return null;
  }

  // Matching by filename pattern, not by exact hash, since the content hash in the filename changes with every upstream rebuild
  const candidates = readdirSync(INSPECTOR_ASSETS_DIR).filter(
    (f) => f.startsWith("index-") && f.endsWith(".js"),
  );

  if (candidates.length !== 1) {
    throw new Error(
      `Expected exactly one index-*.js bundle, found ${candidates.length}: ${candidates.join(", ")}`,
    );
  }

  return join(INSPECTOR_ASSETS_DIR, candidates[0]);
}

function loadDictionary() {
  const raw = JSON.parse(readFileSync(DICTIONARY_PATH, "utf-8"));
  const entries = Object.entries(raw).filter(([key]) => key !== "_comment");
  return entries;
}

function bustBrowserCache(bundlePath, patchedContent) {
  const htmlPath = join(dirname(dirname(bundlePath)), "index.html");

  if (!existsSync(htmlPath)) {
    console.warn(`Warning: could not find index.html at ${htmlPath} to apply cache-busting`);
    return;
  }

  // Hashing the content *after* our own patch, since Vite’s own filename hash reflects the pre-patch content and cannot change without a rebuild we do not perform. Appending our own hash as a query string forces the browser to treat the translated bundle as a distinct, freshly-cacheable resource whenever the translated content changes, without needing the operator to disable caching manually
  const hash = createHash("sha256").update(patchedContent).digest("hex").slice(0, 8);
  const bundleFileName = basename(bundlePath);
  const escapedName = bundleFileName.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const scriptTagPattern = new RegExp(`(src="[^"]*${escapedName})(\\?i18n=[a-f0-9]+)?(")`);

  let html = readFileSync(htmlPath, "utf-8");
  if (!scriptTagPattern.test(html)) {
    console.warn(`Warning: could not find a script tag referencing ${bundleFileName} in index.html`);
    return;
  }

  const alreadyCurrent = html.includes(`${bundleFileName}?i18n=${hash}"`);
  html = html.replace(scriptTagPattern, `$1?i18n=${hash}$3`);
  writeFileSync(htmlPath, html, "utf-8");

  if (alreadyCurrent) {
    console.log("index.html cache-busting query string already matches the current translation");
  } else {
    console.log(`Cache-busted index.html: script now references ${bundleFileName}?i18n=${hash}`);
  }
}

function main() {
  const bundlePath = findBundleFile();

  if (bundlePath === null) {
    console.log(
      "@modelcontextprotocol/inspector is not installed (expected under a production install); skipping the translation patch",
    );
    return;
  }

  let content = readFileSync(bundlePath, "utf-8");
  const dictionary = loadDictionary();

  const missing = [];
  let replacedCount = 0;
  let alreadyAppliedCount = 0;

  for (const [english, translated] of dictionary) {
    const englishOccurrences = content.split(english).length - 1;
    if (englishOccurrences > 0) {
      content = content.split(english).join(translated);
      replacedCount += englishOccurrences;
      continue;
    }

    // The English translator anchor is absent. Distinguishing «already translated in a previous run» from «genuinely missing, upstream wording has changed», since re-running this script against an already-patched bundle, for example via both `postinstall` and `npm run inspector` in the same install, must not be treated as a failure
    const translatedOccurrences = content.split(translated).length - 1;
    if (translatedOccurrences > 0) {
      alreadyAppliedCount += 1;
      continue;
    }

    missing.push(english);
  }

  if (missing.length > 0) {
    console.error(
      "Error: the following dictionary entries were not found in the bundle, " +
        "meaning the upstream wording has changed since this dictionary was written:",
    );
    for (const entry of missing) console.error(`  - "${entry}"`);
    console.error(
      "\nUpdate i18n/inspector/pt-BR.json to match the new wording before proceeding. " +
        "Refusing to continue with a partially-applied translation",
    );
    process.exit(1);
  }

  writeFileSync(bundlePath, content, "utf-8");
  bustBrowserCache(bundlePath, content);
  const newlyTranslatedEntries = dictionary.length - alreadyAppliedCount;
  console.log(
    `${newlyTranslatedEntries} entr${newlyTranslatedEntries === 1 ? "y" : "ies"} newly translated ` +
      `(${replacedCount} occurrences replaced), ${alreadyAppliedCount} already applied from a previous run`,
  );

  // Reporting strings present in the bundle now but absent from the recorded baseline, a signal that this is a different MCP Inspector version than the one the baseline was captured against, and that new, as yet untranslated interface copy may exist
  if (existsSync(BASELINE_PATH)) {
    const baseline = new Set(JSON.parse(readFileSync(BASELINE_PATH, "utf-8")));
    const ourOwnTranslations = new Set(dictionary.map(([, translated]) => translated));
    const currentCandidates = new Set();
    const re = /"([A-Z][a-zA-Z0-9 ,.'!?()%/-]{19,90})"/g;
    let match;
    while ((match = re.exec(content)) !== null) currentCandidates.add(match[1]);

    const newStrings = [...currentCandidates].filter(
      (s) => !baseline.has(s) && !ourOwnTranslations.has(s),
    );

    if (newStrings.length > 0) {
      console.warn(
        `\nWarning: ${newStrings.length} candidate string(s) appear in this bundle but not in the ` +
          "recorded baseline. Some may be genuinely new interface copy requiring translation, " +
          "and some may be vendored dependency internals requiring no action; each must be " +
          "reviewed manually, not assumed",
      );
    }
  }
}

main();
