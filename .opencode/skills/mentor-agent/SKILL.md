---
name: mentor-agent
description: >-
  Use when participants are working with any of the workshop's MCP servers (stdio, HTTP, or Express) — running, testing, comparing transports, or troubleshooting.
---

# Overview (shared across all 3 transports)

- SDK: `@modelcontextprotocol/server` (>= 2.0.0), `@modelcontextprotocol/node` (>= 2.0.0) — both required for HTTP/Express, only `server` for stdio.
- Prerequisite: dependencies must already be installed (`npm install` / `yarn install`) at the repo root before running any server.
- **Startup model differs per transport:**
  - `stdio_mcp` is `type: "local"` in `.opencode/opencode.jsonc` (`command: ["npm", "run", "start:stdio"]`) — OpenCode spawns and manages this process automatically. Never instruct a participant to run `npm run start:stdio` manually.
  - `http_mcp` (`http://localhost:8787`) and `express_mcp` (`http://localhost:8788`) are `type: "remote"` — OpenCode only connects, it does **not** start these. The participant must run `npm run start:http` / `npm run start:express` manually, each in its own terminal (the `--watch` flag blocks the terminal). Only after the server is up do the `http_mcp*`/`express_mcp*` tools appear.
- All 4 tools (`nordesul-delivery`, `nordesul-deploy`, `nordesul-reference`, `nordesul-status`) are imported unconditionally by `tools/index.js` — no server starts until every one of them exports something.
- Full SDK v2 reference: https://ts.sdk.modelcontextprotocol.io/v2/

---

# stdio

## Implementation Reference

```text
https://ts.sdk.modelcontextprotocol.io/v2/serving/stdio.html
```

## Implementation Dependencies

- `@modelcontextprotocol/server` — `McpServer`
- `@modelcontextprotocol/server/stdio` — `serveStdio`

## Server Files

- `servers/stdio/main.js` — entrypoint, registers the _tools_ from `tools/index.js` via `McpServer.registerTool` and serves via `serveStdio`.
- `servers/stdio/config.js` — `SERVER.NAME`/`SERVER.VERSION`, `LOGGER.PREFIX`.

## How to Run

```bash
npm run start:stdio
# or
yarn start:stdio
```

## How to Test Without Hanging

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

## Expected Response

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

## stdio-specific Troubleshooting

- **No response / process looks stuck**: `serveStdio` expects valid JSON-RPC messages (one per line) on `stdin`; a malformed or empty input produces no visible error, it just doesn't respond. Validate the JSON with `ConvertFrom-Json` before sending.
- **`SIGINT` doesn't behave the same on Windows as on Unix**: always prefer the "one-shot" pattern (stdin closed at the end of the heredoc) instead of leaving the process open in interactive mode.

---

# HTTP

## Implementation Reference

```text
https://ts.sdk.modelcontextprotocol.io/v2/serving/http.html
```

## Implementation Dependencies

- `@modelcontextprotocol/server` — `McpServer`, `createMcpHandler`
- `@modelcontextprotocol/node` — `toNodeHandler`

## Server Files

- `servers/http/main.js` — entrypoint, registers the _tools_ from `tools/index.js` via `McpServer.registerTool`, builds the handler with `createMcpHandler`, and serves via `node:http` + `toNodeHandler`.
- `servers/http/config.js` — `SERVER.URL`/`SERVER.PORT` (default: `http://localhost:8787`), `SERVER.NAME`/`SERVER.VERSION`, `LOGGER.PREFIX`.

## How to Run

```bash
npm run start:http
# or
yarn start:http
```

## How to Test Without Hanging

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

## Expected Response

Responses come back in **SSE** format by default (`createMcpHandler`'s `responseMode: 'auto'`) — this is expected, not an error:

```
event: message
data: {"result":{"protocolVersion":"2026-07-28","capabilities":{"tools":{"listChanged":true}},"serverInfo":{"name":"http-mcp","version":"0.0.0"}},"jsonrpc":"2.0","id":1}
```

---

# Express

## Implementation Reference

```text
https://ts.sdk.modelcontextprotocol.io/v2/serving/express.html
```

## Implementation Dependencies

- `express` (>= 5.0.0)
- `@modelcontextprotocol/server` — `McpServer`, `createMcpHandler`
- `@modelcontextprotocol/node` — `toNodeHandler`

## Server Files

- `servers/express/main.js` — entrypoint, registers the _tools_ from `tools/index.js` via `McpServer.registerTool`, builds the handler with `createMcpHandler`, and serves via `app.all('/', toNodeHandler(handler))`.
- `servers/express/config.js` — `SERVER.URL`/`SERVER.PORT` (default: `http://localhost:8788`), `SERVER.NAME`/`SERVER.VERSION`, `LOGGER.PREFIX`.

**Note:** there's no `express.json()` or any other body-parsing middleware registered — `toNodeHandler` already reads the request body straight from the stream. Adding a global body parser would break that read (the stream would already be consumed).

## How to Run

```bash
npm run start:express
# or
yarn start:express
```

## How to Test Without Hanging

Start the server as a detached process, validate it with `fetch`, and shut it down explicitly — never run it with `--watch` or synchronously without a shutdown plan.

```powershell
# 1. Start the server in the background, without blocking the session
$proc = Start-Process -FilePath "node" -ArgumentList "servers/express/main.js" -WorkingDirectory "<repo-path>" -PassThru -WindowStyle Hidden
Start-Sleep -Seconds 2

# 2. Call a tool directly (no init needed if already connected)
node -e "
async function run() {
  let res = await fetch('http://localhost:8788/', {
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

## Expected Response

Responses come back in **SSE** format by default (`createMcpHandler`'s `responseMode: 'auto'`) — this is expected, not an error:

```
event: message
data: {"result":{"content":[{"type":"text","text":"Aplicação: checkout-service\nStatus: offline\n..."}]},"jsonrpc":"2.0","id":1}
```

---

# Shared Troubleshooting (stdio + HTTP + Express)

- **`does not provide an export named 'default'`**: some tool in `tools/*/tool.js` is still `// TODO` (no `export default`). `tools/index.js` imports all 4 tools unconditionally — no server starts until every one of them exports something.
- **Port already in use** (HTTP/Express only): `servers/http` defaults to `8787` and `servers/express` defaults to `8788` (`config.js`) — they use different ports and can run at the same time. If you still hit a conflict, check for a stray process already bound to the port.
- **`toNodeHandler is not a function` / import failing** (HTTP/Express only): confirm `@modelcontextprotocol/node` is installed (`node_modules/@modelcontextprotocol/node`) — it's a **separate** package from `@modelcontextprotocol/server`, not bundled with it.
- **Response looks like odd text (SSE) instead of plain JSON** (HTTP/Express only): default `createMcpHandler` behavior (`responseMode: 'auto'`), not a bug — the message body is inside the `data:` field.
- **Process "stuck" on the port after a previous test** (HTTP/Express only): always pair a background start (`Start-Process`) with an explicit `Stop-Process`; never leave a test server running without shutting it down.
- **Request body arrives empty/undefined in the tool** (Express only): check that no body-parsing middleware (`express.json()`, `bodyParser.json()`, etc.) was added before the route — that would consume the stream before `toNodeHandler` can read it.
