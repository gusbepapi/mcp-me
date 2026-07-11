---
description: Generate a 2-paragraph personal introduction using the mcp-me introduce_me MCP prompt.
---

Generate a personal introduction for the user using the `introduce_me` MCP prompt from the `me` server.

Context or audience (if provided): $ARGUMENTS

Steps:
1. Call the `introduce_me` prompt on the `me` MCP server.
2. If additional context was provided in $ARGUMENTS, tailor the tone and emphasis accordingly.
3. Present the introduction ready to copy-paste.

If the `me` MCP server is not connected, tell the user to install mcp-me (`npx -y mcp-me serve`) and run `mcp-me init` first.
