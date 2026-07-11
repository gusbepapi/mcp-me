import { existsSync, readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, it, expect } from "vitest";

const root = join(import.meta.dirname, "..");

function hasFiles(dir: string, suffix: string): boolean {
  if (!existsSync(dir)) return false;
  const files = readdirSync(dir, { recursive: true });
  return files.some((f) => f.toString().endsWith(suffix));
}

describe("Open Plugins structure", () => {
  it("has .cursor-plugin/plugin.json manifest", () => {
    expect(existsSync(join(root, ".cursor-plugin", "plugin.json"))).toBe(true);
    const manifest = JSON.parse(
      readFileSync(join(root, ".cursor-plugin", "plugin.json"), "utf8"),
    );
    expect(manifest.name).toBe("mcp-me");
    expect(manifest.mcpServers).toBe("./mcp.json");
  });

  it("has mcp.json with zero-config server entry", () => {
    expect(existsSync(join(root, "mcp.json"))).toBe(true);
    const mcp = JSON.parse(readFileSync(join(root, "mcp.json"), "utf8"));
    expect(mcp.mcpServers.me.command).toBe("npx");
    expect(mcp.mcpServers.me.args).toEqual(["-y", "mcp-me", "serve"]);
  });

  it("has rules/*.mdc", () => {
    expect(hasFiles(join(root, "rules"), ".mdc")).toBe(true);
  });

  it("has skills/*/SKILL.md", () => {
    expect(hasFiles(join(root, "skills"), "SKILL.md")).toBe(true);
  });

  it("has agents/*.md", () => {
    expect(hasFiles(join(root, "agents"), ".md")).toBe(true);
  });

  it("has commands/*.md", () => {
    expect(hasFiles(join(root, "commands"), ".md")).toBe(true);
  });

  it("has hooks/hooks.json", () => {
    expect(existsSync(join(root, "hooks", "hooks.json"))).toBe(true);
  });

  it("has .lsp.json", () => {
    expect(existsSync(join(root, ".lsp.json"))).toBe(true);
  });
});
