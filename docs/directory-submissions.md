# Directory Submissions Checklist

Track visibility submissions for `mcp-me` across MCP directories and community lists. Update status as submissions are completed.

## Submission Details

Use these details for all directory submissions:

| Field | Value |
|-------|-------|
| **Name** | mcp-me |
| **Title** | mcp-me — Personal Profile for AI |
| **Description** | Expose your personal, professional, educational, and social profile to any AI assistant via MCP. Privacy-first: all data stays local in YAML files. |
| **npm package** | `mcp-me` |
| **MCP Registry name** | `io.github.paladini/mcp-me` |
| **Repository** | https://github.com/paladini/mcp-me |
| **License** | MIT |
| **Transport** | stdio |
| **Install command** | `npx -y mcp-me serve` |
| **Author** | Fernando Paladini |

## Official Registry

| Directory | URL | Status | Notes |
|-----------|-----|--------|-------|
| MCP Registry | https://registry.modelcontextprotocol.io | Pending first tag push | Automated via `publish.yml` on `v*` tag |

## AI Tool Directories

| Directory | URL | Status | Notes |
|-----------|-----|--------|-------|
| Cursor MCP Directory | https://cursor.com (developer portal) | Pending | Submit after npm + registry publish; include deeplink |
| Smithery | https://smithery.ai | Pending | Auto-indexes from registry; verify listing after publish |
| mcp.so | https://mcp.so | Pending | Submit server listing with npm package link |
| PulseMCP | https://www.pulsemcp.com | Pending | Submit or verify auto-indexing |
| Glama | https://glama.ai/mcp/servers | Pending | Submit via Glama publishing flow |

## Community Lists

| List | URL | Status | Notes |
|------|-----|--------|-------|
| awesome-mcp-servers | https://github.com/punkpeye/awesome-mcp-servers | Pending | Open PR under "Personal / Identity" category |
| modelcontextprotocol/servers | https://github.com/modelcontextprotocol/servers | Pending | Community servers list PR if applicable |

## awesome-mcp-servers PR Template

```markdown
### mcp-me

- **Description:** Personal profile MCP server — expose your identity, career, skills, projects, and social presence to AI assistants. 329 generators, 13 live plugins, privacy-first local YAML storage.
- **npm:** `mcp-me`
- **Install:** `npx -y mcp-me serve`
- **Repository:** https://github.com/paladini/mcp-me
```

## Post-Publish Verification

After the first `v0.6.0` tag push, verify:

- [ ] npm: https://www.npmjs.com/package/mcp-me shows v0.6.0
- [ ] MCP Registry: search API returns `io.github.paladini/mcp-me`
- [ ] GitHub Release: `mcp-me.mcpb` attached
- [ ] Cursor deeplink installs successfully
- [ ] VS Code install link works
- [ ] Claude Desktop `.mcpb` installs and prompts for profile directory
- [ ] `mcp-me init` creates `~/.mcp-me` by default
- [ ] `mcp-me serve` starts without path argument

## Social Launch (Optional)

- [ ] Product Hunt launch post drafted
- [ ] Hacker News "Show HN" post drafted
- [ ] Dev.to / blog post about digital identity layer for AI
- [ ] README badges for npm version and MCP Registry
