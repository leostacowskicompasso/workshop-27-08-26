---
name: workshop-http
description: >-
  Use when participants are working with the workshop's HTTP MCP server. This skill provides guidance on how to interact with the HTTP environment.
---

# Implementation Reference

```text
https://ts.sdk.modelcontextprotocol.io/v2/serving/http.html
```

# Implementation Dependencies

- @modelcontextprotocol/server _(>= 2.0.0)_
  - `McpServer`
  - `createMcpHandler`

- @modelcontextprotocol/node _(>= 2.0.0)_
  - `toNodeHandler`

# Server Files

- `servers/http/main.js` — entrypoint, registers the _tools_ from `tools/index.js` via `McpServer.registerTool`, builds the handler with `createMcpHandler`, and serves via `node:http` + `toNodeHandler`.
- `servers/http/config.js` — `SERVER.URL`/`SERVER.PORT` (default: `http://localhost:8787`), `SERVER.NAME`/`SERVER.VERSION`, `LOGGER.PREFIX`.

# How to Run

```bash
npm run start:http
# or
yarn start:http
```

**Important:** Unlike `stdio` (which OpenCode spawns automatically as a `local` MCP), `http_mcp` is configured as `type: "remote"` in `.opencode/opencode.jsonc`, pointing at `http://localhost:8787`. OpenCode does **not** start this process — the participant must run `npm run start:http` (or `yarn start:http`) manually, in its own terminal, and keep it running (the `--watch` flag blocks the terminal). Only after the server is up will the `http_mcp*` tools appear in the agent's tool set.

# How to Test Without Hanging

Start the server as a detached process, validate it with `fetch`, and shut it down explicitly — never run it with `--watch` or synchronously without a shutdown plan.

```powershell
# 1. Start the server in the background, without blocking the session
$proc = Start-Process -FilePath "node" -ArgumentList "servers/http/main.js" -WorkingDirectory "<repo-path>" -PassThru -WindowStyle Hidden
Start-Sleep -Seconds 2

# 2. Call a tool directly (no prior initialize needed if already connected)
node -e "
async function run() {
  let res = await fetch('http://localhost:8787/', {
    method: 'POST',
    headers: { 'content-type': 'application/json', 'accept': 'application/json, text/event-stream' },
    body: JSON.stringify({ jsonrpc: '2.0', id: 1, method: 'tools/call', params: { name: 'nordesul-status', arguments: {} } })
  })
  console.log(await res.text())
}
run()
"

# 3. Terminate the process (mandatory)
Stop-Process -Id $proc.Id -Force
```

# Expected Response

Responses come back in **SSE** format by default (`createMcpHandler`'s `responseMode: 'auto'`) — this is expected, not an error:

```
event: message
data: {"result":{"protocolVersion":"2025-06-18","capabilities":{"tools":{"listChanged":true}},"serverInfo":{"name":"http-mcp","version":"0.0.0"}},"jsonrpc":"2.0","id":1}
```

# Common Errors / Troubleshooting

- **Port already in use**: `servers/http` defaults to `8787` and `servers/express` defaults to `8788` (`config.js`) — they use different ports and can run at the same time. If you still hit a conflict, check for a stray process already bound to the port.
- **`toNodeHandler is not a function` / import failing**: confirm `@modelcontextprotocol/node` is installed (`node_modules/@modelcontextprotocol/node`) — it's a **separate** package from `@modelcontextprotocol/server`, not bundled with it.
- **`does not provide an export named 'default'`**: some tool in `tools/*/tool.js` is still `// TODO`. `tools/index.js` imports all 4 tools unconditionally.
- **Response looks like odd text (SSE) instead of plain JSON**: default `createMcpHandler` behavior (`responseMode: 'auto'`), not a bug — the message body is inside the `data:` field.
- **Process "stuck" on the port after a previous test**: always pair a background start (`Start-Process`) with an explicit `Stop-Process`; never leave a test server running without shutting it down.
