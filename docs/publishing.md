# Publishing Guide

This document describes how maintainers release `mcp-me` to npm, the official MCP Registry, and distribution channels.

## Prerequisites

- npm account with publish access to the `mcp-me` package
- **npm Trusted Publishing** configured for this GitHub repo (see below — no `NPM_TOKEN` needed)
- GitHub repository owned by `paladini` (for `io.github.paladini/mcp-me` namespace)

## npm Trusted Publishing (recommended)

npm recommends **Trusted Publishing** over long-lived access tokens for CI/CD. The workflow [`.github/workflows/publish.yml`](../.github/workflows/publish.yml) is already configured for OIDC — you do **not** need to create an `NPM_TOKEN` secret.

### One-time setup on npmjs.com

1. Log in at [npmjs.com](https://www.npmjs.com/) and open the **mcp-me** package page.
2. Go to **Settings** → **Publishing access** → **Trusted Publisher**.
3. Click **GitHub Actions** and fill in **exactly**:

   | Field | Value |
   |-------|-------|
   | **Organization or user** | `paladini` |
   | **Repository** | `mcp-me` |
   | **Workflow filename** | `publish.yml` |
   | **Environment** | *(leave empty)* |

4. Save. Fields are **case-sensitive** — the workflow file must be `.github/workflows/publish.yml`.

### How it works

When you push a `v*` tag, GitHub Actions issues a short-lived OIDC token. npm verifies that the workflow matches your Trusted Publisher config and allows `npm publish` without any stored secret.

### First publish (if the package does not exist yet)

Trusted Publishing works for **updates** to an existing package. If `mcp-me` is not on npm yet, publish once manually from your machine:

```bash
npm login
npm run build
npm publish --access public
```

Then configure Trusted Publisher as above for all future releases via CI.

### Requirements

- GitHub-hosted runner (`ubuntu-latest`) — self-hosted runners are not supported
- `permissions: id-token: write` in the workflow (already set)
- npm CLI ≥ 11.5.1 (workflow runs `npm install -g npm@latest`)
- Node.js 24 in CI (already set)

## Version Bump Checklist

Update version in **all** of these locations:

1. [`package.json`](../package.json) → `"version"`
2. [`server.json`](../server.json) → `"version"` and `packages[0].version`
3. [`mcpb/manifest.json`](../mcpb/manifest.json) → `"version"`
4. [`CHANGELOG.md`](../CHANGELOG.md) → new dated section under `[Unreleased]`

## Release Process (Automated)

Publishing is automated via [`.github/workflows/publish.yml`](../.github/workflows/publish.yml):

1. Merge all changes to `main`
2. Run the full verification suite locally:

   ```bash
   npm run lint
   npm run typecheck
   npm test
   npm run build
   ```

3. Create and push a version tag:

   ```bash
   git tag v0.6.0
   git push origin v0.6.0
   ```

4. GitHub Actions will:
   - Run lint, typecheck, test, and build
   - Pack the Claude Desktop `.mcpb` bundle
   - Publish to npm (`npm publish --provenance`)
   - Publish to the [official MCP Registry](https://registry.modelcontextprotocol.io) via `mcp-publisher`
   - Create a GitHub Release with `mcp-me.mcpb` attached

## Manual Publishing (Fallback)

### npm

```bash
npm run build
npm publish --provenance --access public
```

### Official MCP Registry

```bash
# Install mcp-publisher (macOS/Linux)
curl -sL "https://github.com/modelcontextprotocol/registry/releases/latest/download/mcp-publisher_linux_amd64.tar.gz" | tar xz mcp-publisher

# Authenticate with GitHub
mcp-publisher login github

# Validate without publishing
mcp-publisher publish --dry-run

# Publish
mcp-publisher publish
```

The `server.json` `name` field (`io.github.paladini/mcp-me`) must match `mcpName` in `package.json`.

### Claude Desktop Extension (.mcpb)

```bash
npm run build
npm run pack:mcpb
```

This creates `mcp-me.mcpb` in the project root. Attach it to a GitHub Release or distribute directly.

## Install Link Generation

Regenerate one-click install badges for README:

```bash
npm run generate:install-links
```

Paste the output badges into the README Installation section.

## Distribution Channels

| Channel | Status | Notes |
|---------|--------|-------|
| [npm](https://www.npmjs.com/package/mcp-me) | Active | Primary distribution |
| [MCP Registry](https://registry.modelcontextprotocol.io) | Automated on tag push | `server.json` + `mcp-publisher` |
| [Cursor deeplink](https://cursor.com/install-mcp) | README badge | Zero-config `npx mcp-me serve` |
| [VS Code MCP install](vscode:mcp/install) | README badge | Zero-config `npx mcp-me serve` |
| [Claude Desktop .mcpb](https://github.com/paladini/mcp-me/releases) | GitHub Releases | Bundled extension |
| Third-party directories | See [directory-submissions.md](./directory-submissions.md) | Smithery, mcp.so, PulseMCP, Glama |

## Cursor MCP Directory Submission

To list mcp-me in the Cursor MCP directory:

1. Ensure the package is published on npm and the MCP Registry
2. Visit the Cursor developer portal and submit the server with:
   - **Name:** mcp-me
   - **npm package:** `mcp-me`
   - **Install command:** `npx -y mcp-me serve`
   - **Repository:** https://github.com/paladini/mcp-me
3. Include the one-click install deeplink from `npm run generate:install-links`

## Troubleshooting

| Issue | Fix |
|-------|-----|
| Registry rejects `name` mismatch | Ensure `package.json` `mcpName` equals `server.json` `name` |
| Registry auth fails in CI | Verify `id-token: write` permission and `github-oidc` login |
| npm publish 403 | Configure Trusted Publisher on npmjs.com (user `paladini`, repo `mcp-me`, workflow `publish.yml`) |
| MCPB pack fails | Run `npm run build` first; ensure Node.js 20+ |
