---
name: workshop-stdio
description: >-
  Use when participants are working with the workshop's stdio MCP server. This skill provides guidance on how to interact with the stdio environment.
---

# Implementation Reference

```text
https://ts.sdk.modelcontextprotocol.io/v2/serving/stdio.html
```

# Implementation Dependencies

- @modelcontextprotocol/server _(>= 2.0.0)_
  - `McpServer`

- @modelcontextprotocol/server/stdio _(>= 2.0.0)_
  - `serveStdio`

# Server Files

- `servers/stdio/main.js` — entrypoint, registers the _tools_ from `tools/index.js` via `McpServer.registerTool` and serves via `serveStdio`.
- `servers/stdio/config.js` — `SERVER.NAME`/`SERVER.VERSION`, `LOGGER.PREFIX`.

# How to Run

```bash
npm run start:stdio
# or
yarn start:stdio
```

**Important:** `stdio_mcp` is configured as `type: "local"` in `.opencode/opencode.jsonc`, with `command: ["npm", "run", "start:stdio"]` — OpenCode spawns and manages this process automatically when the session starts. The tools (`nordesul‑delivery`, `nordesul‑deploy`, `nordesul‑reference`, `nordesul‑status`) are already native to the agent; never instruct the participant to run `npm run start:stdio` manually, that would just start a redundant, disconnected process.

# How to Test Without Hanging

`stdio` doesn't use networking — send a JSON-RPC message via `stdin` in a single Node process (no `--watch`) and read the response from `stdout`. The process exits on its own once the input ends.

```powershell
$msg = '{"jsonrpc":"2.0","id":1,"method":"tools/list","params":{}}'
$msg | node servers/stdio/main.js
```

Para chamar uma ferramenta diretamente, basta enviar a mensagem `tools/call` (o `initialize` pode ser omitido se o agente já estiver conectado). Exemplo:

```powershell
@'
{"jsonrpc":"2.0","id":1,"method":"tools/call","params":{"name":"nordesul-deploy","arguments":{}}}
'@ | node servers/stdio/main.js
```

# Expected Response

```json
{
  "result": {
    "protocolVersion": "2026-07-28",
    "capabilities": { "tools": { "listChanged": true } },
    "serverInfo": { "name": "stdio-mcp", "version": "0.0.0" }
  },
  "jsonrpc": "2.0",
  "id": 1
}
```

```json
{
  "result": {
    "tools": [
      { "name": "nordesul-delivery", "...": "..." },
      { "name": "nordesul-deploy", "...": "..." },
      { "name": "nordesul-reference", "...": "..." },
      { "name": "nordesul-status", "...": "..." }
    ]
  },
  "jsonrpc": "2.0",
  "id": 1
}
```

# Common Errors / Troubleshooting

- **`does not provide an export named 'default'`**: some tool in `tools/*/tool.js` is still `// TODO` (no `export default`). `tools/index.js` imports all 4 tools unconditionally — no server starts until every one of them exports something.
- **No response / process looks stuck**: `serveStdio` expects valid JSON-RPC messages (one per line) on `stdin`; a malformed or empty input produces no visible error, it just doesn't respond. Validate the JSON with `ConvertFrom-Json` before sending.
- **`SIGINT` doesn't behave the same on Windows as on Unix**: always prefer the "one-shot" pattern (stdin closed at the end of the heredoc) instead of leaving the process open in interactive mode.
