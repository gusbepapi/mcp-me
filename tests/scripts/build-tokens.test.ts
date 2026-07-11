import { describe, expect, it } from "vitest";
import { flattenTokens, emitCss, emitLatex, emitTypst, emitPython } from "../../scripts/build-tokens.mjs";

describe("flattenTokens", () => {
  it("resolving a direct alias to its concrete value", () => {
    const tree = {
      color: {
        blue: { 300: { $type: "color", $value: "#7cb9e8" } },
        semantic: { accent: { $type: "color", $value: "{color.blue.300}" } },
      },
    };
    const tokens = flattenTokens(tree);
    const accent = tokens.find((t) => t.path === "color.semantic.accent");
    expect(accent?.value).toBe("#7cb9e8");
  });

  it("resolving a chain of aliases pointing at one another", () => {
    const tree = {
      a: { $type: "color", $value: "#123456" },
      b: { $type: "color", $value: "{a}" },
      c: { $type: "color", $value: "{b}" },
    };
    const tokens = flattenTokens(tree);
    expect(tokens.find((t) => t.path === "c")?.value).toBe("#123456");
  });

  it("throwing on a circular alias rather than looping forever", () => {
    const tree = {
      a: { $type: "color", $value: "{b}" },
      b: { $type: "color", $value: "{a}" },
    };
    expect(() => flattenTokens(tree)).toThrow(/circular/i);
  });

  it("throwing when an alias points at a non-existent path", () => {
    const tree = {
      a: { $type: "color", $value: "{does.not.exist}" },
    };
    expect(() => flattenTokens(tree)).toThrow(/does not resolve/i);
  });

  it("resolving an alias array member correctly, not just top-level string values", () => {
    const tree = {
      base: { $type: "color", $value: "#abcdef" },
      list: { $type: "color", $value: ["{base}", "#000000"] },
    };
    const tokens = flattenTokens(tree);
    expect(tokens.find((t) => t.path === "list")?.value).toEqual(["#abcdef", "#000000"]);
  });
});

describe("per-format emitters", () => {
  const tokens = [
    { path: "color.blue.300", type: "color", value: "#7cb9e8" },
    { path: "dimension.radius.md", type: "dimension", value: "12px" },
    { path: "fontFamily.sans", type: "fontFamily", value: ["Google Sans", "sans-serif"] },
  ];

  it("emitting a CSS custom property with a kebab-case name", () => {
    const css = emitCss(tokens);
    expect(css).toContain("--color-blue-300: #7cb9e8;");
    expect(css).toContain("--dimension-radius-md: 12px;");
  });

  it("emitting a LaTeX \\definecolor with an uppercase hex code and a camelCase name", () => {
    const latex = emitLatex(tokens);
    expect(latex).toContain("\\definecolor{colorBlue300}{HTML}{7CB9E8}");
  });

  it("emitting a Typst dictionary entry keyed by the dotted path", () => {
    const typst = emitTypst(tokens);
    expect(typst).toContain('"color.blue.300": rgb("#7cb9e8"),');
  });

  it("emitting a Python HexColor constant in SCREAMING_SNAKE_CASE", () => {
    const python = emitPython(tokens);
    expect(python).toContain('COLOR_BLUE_300 = HexColor("#7cb9e8")');
  });
});
