#!/usr/bin/env node
/**
 * Validate Open Plugins / Cursor Directory component structure.
 * Run: npm run validate:open-plugin
 */

import { existsSync, readdirSync, readFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");

const errors = [];

function check(condition, message) {
  if (!condition) errors.push(message);
}

function hasFiles(dir, pattern) {
  if (!existsSync(dir)) return false;
  const files = readdirSync(dir, { recursive: true });
  const flat = files.map((f) => (typeof f === "string" ? f : f.toString()));
  if (pattern instanceof RegExp) {
    return flat.some((f) => pattern.test(f));
  }
  return flat.some((f) => f.endsWith(pattern));
}

// Manifest
check(
  existsSync(join(root, ".cursor-plugin", "plugin.json")),
  "Missing .cursor-plugin/plugin.json",
);

// MCP server config
check(
  existsSync(join(root, "mcp.json")) || existsSync(join(root, ".mcp.json")),
  "Missing mcp.json or .mcp.json",
);

// Rules
check(hasFiles(join(root, "rules"), ".mdc"), "Missing rules/*.mdc");

// Skills
check(
  hasFiles(join(root, "skills"), "SKILL.md"),
  "Missing skills/*/SKILL.md",
);

// Agents
check(hasFiles(join(root, "agents"), ".md"), "Missing agents/*.md");

// Commands
check(hasFiles(join(root, "commands"), ".md"), "Missing commands/*.md");

// Hooks
check(
  existsSync(join(root, "hooks", "hooks.json")),
  "Missing hooks/hooks.json",
);

// LSP
check(existsSync(join(root, ".lsp.json")), "Missing .lsp.json");

// Validate manifest JSON
if (existsSync(join(root, ".cursor-plugin", "plugin.json"))) {
  try {
    const manifest = JSON.parse(
      readFileSync(join(root, ".cursor-plugin", "plugin.json"), "utf8"),
    );
    check(manifest.name === "mcp-me", "plugin.json: name must be 'mcp-me'");
    check(typeof manifest.version === "string", "plugin.json: version required");
    check(manifest.mcpServers, "plugin.json: mcpServers path required");
  } catch (e) {
    errors.push(`plugin.json: invalid JSON — ${e instanceof Error ? e.message : String(e)}`);
  }
}

// Validate mcp.json
if (existsSync(join(root, "mcp.json"))) {
  try {
    const mcp = JSON.parse(readFileSync(join(root, "mcp.json"), "utf8"));
    check(mcp.mcpServers?.me, "mcp.json: mcpServers.me entry required");
    check(
      mcp.mcpServers.me.command === "npx",
      "mcp.json: mcpServers.me.command must be 'npx'",
    );
  } catch (e) {
    errors.push(`mcp.json: invalid JSON — ${e instanceof Error ? e.message : String(e)}`);
  }
}

if (errors.length > 0) {
  console.error("Open Plugins validation failed:\n");
  for (const err of errors) {
    console.error(`  ✗ ${err}`);
  }
  process.exit(1);
}

console.log("Open Plugins structure: all 7 component types present ✓");
