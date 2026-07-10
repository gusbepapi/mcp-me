#!/usr/bin/env node
/**
 * Pack mcp-me as a Claude Desktop Extension (.mcpb bundle).
 * Run: npm run pack:mcpb
 */

import { cp, mkdir, rm, readFile, writeFile } from "node:fs/promises";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { execSync } from "node:child_process";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");
const staging = join(root, ".mcpb-staging");
const output = join(root, "mcp-me.mcpb");

async function main() {
  console.log("Packing mcp-me MCPB bundle...");

  await rm(staging, { recursive: true, force: true });
  await mkdir(staging, { recursive: true });

  // Copy built server and runtime files
  await cp(join(root, "dist"), join(staging, "dist"), { recursive: true });
  await cp(join(root, "templates"), join(staging, "templates"), { recursive: true });

  const pkg = JSON.parse(await readFile(join(root, "package.json"), "utf-8"));
  const runtimePkg = {
    name: pkg.name,
    version: pkg.version,
    type: "module",
    dependencies: pkg.dependencies,
  };
  await writeFile(join(staging, "package.json"), JSON.stringify(runtimePkg, null, 2));

  await cp(join(root, "mcpb", "manifest.json"), join(staging, "manifest.json"));

  const iconSvg = join(root, "docs", "assets", "og-image.svg");
  try {
    await cp(iconSvg, join(staging, "icon.svg"));
  } catch {
    console.warn("  Warning: icon.svg not copied (optional)");
  }

  console.log("  Installing production dependencies in staging...");
  execSync("npm install --omit=dev", { cwd: staging, stdio: "inherit" });

  console.log("  Running mcpb pack...");
  execSync(`npx --yes @anthropic-ai/mcpb@latest pack "${staging}" "${output}"`, {
    cwd: root,
    stdio: "inherit",
  });

  await rm(staging, { recursive: true, force: true });
  console.log(`  Created: ${output}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
