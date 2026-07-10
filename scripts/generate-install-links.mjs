#!/usr/bin/env node
/**
 * Generate one-click MCP install links for Cursor and VS Code.
 * Run: node scripts/generate-install-links.mjs
 */

const SERVER_NAME = "me";
const NPM_PACKAGE = "mcp-me";

const cursorConfig = {
  command: "npx",
  args: ["-y", NPM_PACKAGE, "serve"],
};

const vscodeConfig = {
  name: SERVER_NAME,
  command: "npx",
  args: ["-y", NPM_PACKAGE, "serve"],
};

const cursorBase64 = Buffer.from(JSON.stringify(cursorConfig), "utf8").toString("base64url");
const cursorDeepLink = `cursor://anysphere.cursor-deeplink/mcp/install?name=${encodeURIComponent(SERVER_NAME)}&config=${cursorBase64}`;
const cursorWebLink = `https://cursor.com/install-mcp?name=${encodeURIComponent(SERVER_NAME)}&config=${encodeURIComponent(Buffer.from(JSON.stringify(cursorConfig)).toString("base64"))}`;

const vscodeLink = `vscode:mcp/install?${encodeURIComponent(JSON.stringify(vscodeConfig))}`;

const cursorBadge = `[![Add to Cursor](https://cursor.com/deeplink/mcp-install-dark.svg)](${cursorWebLink})`;
const vscodeBadge = `[![Install in VS Code](https://img.shields.io/badge/VS_Code-Install_MCP-007ACC?style=for-the-badge&logo=visualstudiocode)](${vscodeLink})`;

console.log("## One-Click Install Links\n");
console.log("### Badges (paste into README)\n");
console.log(cursorBadge);
console.log();
console.log(vscodeBadge);
console.log();
console.log("### Raw URLs\n");
console.log("Cursor deeplink:", cursorDeepLink);
console.log("Cursor web link:", cursorWebLink);
console.log("VS Code link:", vscodeLink);
