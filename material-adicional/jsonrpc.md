# JSON-RPC 2.0 - O Protocolo por Trás do MCP

## 📖 O que é JSON-RPC?

**JSON-RPC** é um protocolo leve de chamada remota de procedimentos (RPC - Remote Procedure Call) que usa **JSON** como formato de dados.

> **Analogia:** É como uma "linguagem comum" para sistemas se comunicarem. Assim como humanos usam português para se entender, sistemas usam JSON-RPC para trocar mensagens.

### Características Principais

- **Stateless** - Sem estado entre requisições
- **Leve** - Mensagens pequenas e simples
- **Independente de transporte** - Funciona via HTTP, WebSocket, stdio, etc
- **Fácil de implementar** - Formato simples e intuitivo

---

## 🏗️ Estrutura Básica

### Request (Requisição)

```json
{
  "jsonrpc": "2.0",
  "method": "nome_da_funcao",
  "params": { "parametro1": "valor1" },
  "id": 1
}
```

| Campo | Obrigatório | Descrição |
|-------|-------------|-----------|
| `jsonrpc` | ✅ Sim | Versão do protocolo (sempre "2.0") |
| `method` | ✅ Sim | Nome do método a ser chamado |
| `params` | ❌ Não | Parâmetros da função (Object ou Array) |
| `id` | ⚠️ Condicional | ID único para correlacionar com a resposta |

### Response (Resposta)

**Sucesso:**
```json
{
  "jsonrpc": "2.0",
  "result": { "status": "sucesso", "dados": [...] },
  "id": 1
}
```

**Erro:**
```json
{
  "jsonrpc": "2.0",
  "error": {
    "code": -32601,
    "message": "Method not found"
  },
  "id": 1
}
```

---

## 📋 Tipos de Mensagem

### 1. Request (Requisição)

O cliente envia e espera uma resposta:

```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "method": "calcular_soma",
  "params": { "a": 10, "b": 20 }
}
```

**Características:**
- Tem campo `id`
- Espera uma resposta
- Pode ter `params` ou não

### 2. Notification (Notificação)

O cliente envia **sem esperar resposta**:

```json
{
  "jsonrpc": "2.0",
  "method": "log_evento",
  "params": { "evento": "usuario_logado" }
}
```

**Características:**
- **NÃO tem campo `id`**
- Servidor **NÃO responde**
- Útil para eventos, logs, etc

### 3. Response (Resposta)

O servidor responde a um request:

```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "result": { "soma": 30 }
}
```

**Características:**
- Tem campo `id` (mesmo do request)
- Tem `result` (sucesso) OU `error` (erro)
- Nunca ambos ao mesmo tempo

---

## ⚠️ Códigos de Erro

### Erros Padrão (Reservados)

| Code | Mensagem | Significado |
|------|----------|-------------|
| `-32700` | Parse error | JSON inválido recebido |
| `-32600` | Invalid Request | Request não é válido |
| `-32601` | Method not found | Método não existe |
| `-32602` | Invalid params | Parâmetros inválidos |
| `-32603` | Internal error | Erro interno do servidor |

### Erros Customizados

Códigos de `-32000` a `-32099` são reservados para erros do servidor.

Códigos acima de `0` podem ser usados para erros da aplicação:

```json
{
  "jsonrpc": "2.0",
  "error": {
    "code": 1001,
    "message": "Aplicação não encontrada",
    "data": { "appName": "loja-v1" }
  },
  "id": 1
}
```

---

## 📦 Estruturas de Parâmetros

### By-name (Por nome) - Mais comum

```json
{
  "jsonrpc": "2.0",
  "method": "buscar_usuario",
  "params": {
    "id": 123,
    "includeEmail": true
  },
  "id": 1
}
```

### By-position (Por posição)

```json
{
  "jsonrpc": "2.0",
  "method": "somar",
  "params": [10, 20, 30],
  "id": 1
}
```

---

## 🔄 Fluxo Completo de Comunicação

### Exemplo 1: Request/Response Simples

```
┌─────────────┐                                    ┌─────────────┐
│  Cliente    │ ──── Request ──────────────────────▶ │  Servidor   │
│             │     { "id": 1, "method": "get_weather" }           │
│             │                                    │             │
│             │ ◀──── Response ───────────────────── │  Servidor   │
│             │     { "id": 1, "result": { "temp": 25 } }          │
└─────────────┘                                    └─────────────┘
```

### Exemplo 2: Múltiplos Requests

```
┌─────────────┐                                    ┌─────────────┐
│  Cliente    │ ──── Request 1 ────────────────────▶ │  Servidor   │
│             │     { "id": 1, "method": "get_user" }              │
│             │                                    │             │
│             │ ──── Request 2 ────────────────────▶ │  Servidor   │
│             │     { "id": 2, "method": "get_orders" }            │
│             │                                    │             │
│             │ ◀──── Response 1 ─────────────────── │  Servidor   │
│             │     { "id": 1, "result": {...} }                   │
│             │                                    │             │
│             │ ◀──── Response 2 ─────────────────── │  Servidor   │
│             │     { "id": 2, "result": {...} }                   │
└─────────────┘                                    └─────────────┘
```

### Exemplo 3: Request + Notification

```
┌─────────────┐                                    ┌─────────────┐
│  Cliente    │ ──── Request ──────────────────────▶ │  Servidor   │
│             │     { "id": 1, "method": "deploy" } │             │
│             │                                    │             │
│             │ ◀──── Notification ───────────────── │  Servidor   │
│             │     { "method": "progress", "params": { "pct": 50 } }│
│             │                                    │             │
│             │ ◀──── Notification ───────────────── │  Servidor   │
│             │     { "method": "progress", "params": { "pct": 100 } }│
│             │                                    │             │
│             │ ◀──── Response ───────────────────── │  Servidor   │
│             │     { "id": 1, "result": { "status": "ok" } }     │
└─────────────┘                                    └─────────────┘
```

---

## 🎯 JSON-RPC no Contexto do MCP

O MCP usa JSON-RPC como **formato de mensagem padrão**. Veja como se aplica:

### Listar Tools (Request/Response)

**Request:**
```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "method": "tools/list"
}
```

**Response:**
```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "result": {
    "tools": [
      {
        "name": "nordesul-status",
        "description": "Consulta status de aplicação",
        "inputSchema": { ... }
      }
    ]
  }
}
```

### Chamar Tool (Request/Response)

**Request:**
```json
{
  "jsonrpc": "2.0",
  "id": 2,
  "method": "tools/call",
  "params": {
    "name": "nordesul-status",
    "arguments": { "appName": "loja-v1" }
  }
}
```

**Response:**
```json
{
  "jsonrpc": "2.0",
  "id": 2,
  "result": {
    "content": [
      {
        "type": "text",
        "text": "Status: online | Uptime: 99.9%"
      }
    ]
  }
}
```

### Notificação de Mudança (Notification)

**Notification (servidor → cliente):**
```json
{
  "jsonrpc": "2.0",
  "method": "notifications/tools/list_changed"
}
```

---

## 🔌 Transporte no MCP

### stdio (Processo Filho)

Cada linha é uma mensagem JSON-RPC:

```
{"jsonrpc":"2.0","id":1,"method":"tools/list"}\n
{"jsonrpc":"2.0","id":1,"result":{"tools":[...]}}\n
{"jsonrpc":"2.0","id":2,"method":"tools/call","params":{...}}\n
{"jsonrpc":"2.0","id":2,"result":{"content":[...]}}\n
```

### HTTP (Streamable HTTP)

Cada mensagem é um HTTP POST:

```
POST /mcp HTTP/1.1
Content-Type: application/json

{"jsonrpc":"2.0","id":1,"method":"tools/list"}
```

---

## 📊 Resumo

| Conceito | Descrição |
|----------|-----------|
| **JSON-RPC** | Protocolo leve para comunicação entre sistemas |
| **Request** | Mensagem com `id` que espera resposta |
| **Notification** | Mensagem sem `id` que não espera resposta |
| **Response** | Resposta a um request (com `result` ou `error`) |
| **Method** | Nome da função a ser chamada |
| **Params** | Parâmetros da função |
| **ID** | Identificador único para correlacionar requests/responses |

---

## 💡 Por que JSON-RPC é bom para MCP?

1. **Simplicidade** - Fácil de implementar e entender
2. **Flexibilidade** - Funciona com qualquer transporte
3. **Padronização** - Formato conhecido e documentado
4. **Leveza** - Mensagens pequenas e eficientes
5. **Compatibilidade** - Suportado por muitas linguagens

---

## 📚 Referências

- [JSON-RPC 2.0 Specification](https://www.jsonrpc.org/specification)
- [JSON-RPC 1.0 Specification](https://jsonrpc.org/historical/json-rpc-1-1.html)
- [MCP Specification](https://modelcontextprotocol.io/specification/2026-07-28)
- [MCP TypeScript SDK](https://ts.sdk.modelcontextprotocol.io/server.html)
