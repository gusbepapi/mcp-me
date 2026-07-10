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
| MCP Registry | https://registry.modelcontextprotocol.io | **Published** | `io.github.paladini/mcp-me` v0.6.0 active (2026-07-10) |

## AI Tool Directories

| Directory | URL | Status | Notes |
|-----------|-----|--------|-------|
| Cursor MCP Directory | https://cursor.com (developer portal) | Pending | Submit after npm + registry publish; include deeplink |
| Glama | https://glama.ai/mcp/servers | **Indexed** | https://glama.ai/mcp/servers/paladini/mcp-me (auto-index + `glama.json`) |
| Smithery | https://smithery.ai | Pending login | Run `smithery auth login` then `smithery mcp publish ./mcp-me.mcpb -n paladini/mcp-me` |
| mcp.so | https://mcp.so | Pending login | Submit at https://mcp.so/submit (requires GitHub/Google sign-in) |
| PulseMCP | https://www.pulsemcp.com | Pending auto-sync | Usually indexes from MCP Registry within 24–48h |

## Community Lists

| List | URL | Status | Notes |
|------|-----|--------|-------|
| awesome-mcp-servers | https://github.com/punkpeye/awesome-mcp-servers | **Listed** | Already in README |
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

- [x] npm: https://www.npmjs.com/package/mcp-me shows v0.6.0
- [x] MCP Registry: `io.github.paladini/mcp-me` active
- [x] GitHub Release: `mcp-me.mcpb` attached at https://github.com/paladini/mcp-me/releases/tag/v0.6.0
- [x] Glama: https://glama.ai/mcp/servers/paladini/mcp-me returns 200
- [x] awesome-mcp-servers: already listed
- [ ] Cursor deeplink installs successfully (user test)
- [ ] VS Code install link works (user test)
- [ ] Claude Desktop `.mcpb` installs and prompts for profile directory (user test)
- [ ] mcp.so submission (requires sign-in at mcp.so)
- [ ] Smithery MCPB publish (requires `smithery auth login`)
- [ ] PulseMCP auto-index (wait 24–48h)

## Social Launch (Optional)

- [ ] Product Hunt launch post drafted
- [ ] Hacker News "Show HN" post drafted
- [ ] Dev.to / blog post about digital identity layer for AI
- [ ] README badges for npm version and MCP Registry
