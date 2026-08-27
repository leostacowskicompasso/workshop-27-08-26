# Protocolo MCP - Tipos de Requests e Methods

## 📋 Tipos de Requests MCP

O protocolo MCP define **3 tipos principais** de mensagens:

### 1. **Requests** (Requisições)
O cliente envia e espera uma resposta:

```json
{
  "jsonrpc": "2.0",
  "id": 1,                          // ← ID único para identificar a resposta
  "method": "tools/list",           // ← Método a ser chamado
  "params": { ... }                 // ← Parâmetros (opcional)
}
```

### 2. **Notifications** (Notificações)
O cliente envia **sem esperar resposta**:

```json
{
  "jsonrpc": "2.0",
  "method": "notifications/cancelled",
  "params": {
    "requestId": 1,
    "reason": "Usuário cancelou"
  }
}
```
- Não tem campo `id`
- Servidor não responde

### 3. **Responses** (Respostas)
O servidor responde a um request:

```json
{
  "jsonrpc": "2.0",
  "id": 1,                          // ← Mesmo ID do request
  "result": { ... }                 // ← Sucesso
}
```

Ou erro:
```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "error": {
    "code": -32601,
    "message": "Method not found"
  }
}
```

---

## 🔧 Métodos Disponíveis (Tools)

### **Listar Tools**
O cliente pergunta ao servidor quais tools estão disponíveis:

**Request:**
```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "method": "tools/list",
  "params": {
    "cursor": "optional-cursor-value"  // ← Para paginação (opcional)
  }
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
        "title": "Consulta Status",
        "description": "Consulta o status de uma aplicação no Nordesul",
        "inputSchema": {
          "type": "object",
          "properties": {
            "appName": {
              "type": "string",
              "description": "Nome da aplicação"
            }
          },
          "required": ["appName"]
        }
      },
      {
        "name": "nordesul-deploy",
        "title": "Deploy Aplicação",
        "description": "Simula o deploy de uma aplicação",
        "inputSchema": {
          "type": "object",
          "properties": {
            "appName": { "type": "string" },
            "version": { "type": "string" }
          },
          "required": ["appName", "version"]
        }
      }
    ],
    "nextCursor": "next-page-cursor"  // ← Se houver mais páginas
  }
}
```

---

### **Chamar Tool**
O cliente invoca uma tool específica:

**Request:**
```json
{
  "jsonrpc": "2.0",
  "id": 2,
  "method": "tools/call",
  "params": {
    "name": "nordesul-status",
    "arguments": {
      "appName": "loja-virtual-v1"
    }
  }
}
```

**Response (sucesso):**
```json
{
  "jsonrpc": "2.0",
  "id": 2,
  "result": {
    "content": [
      {
        "type": "text",
        "text": "Status: online | Uptime: 99.9% | Versão: 1.2.3"
      }
    ],
    "isError": false
  }
}
```

**Response (erro):**
```json
{
  "jsonrpc": "2.0",
  "id": 2,
  "result": {
    "content": [
      {
        "type": "text",
        "text": "Erro: Aplicação não encontrada"
      }
    ],
    "isError": true
  }
}
```

---

### **Outros Métodos Importantes**

| Método | Direção | Descrição |
|--------|---------|-----------|
| `tools/list` | Cliente → Servidor | Lista tools disponíveis |
| `tools/call` | Cliente → Servidor | Invoca uma tool |
| `notifications/tools/list_changed` | Servidor → Cliente | Notifica que a lista mudou |
| `notifications/cancelled` | Cliente → Servidor | Cancela um request em andamento |

---

## 🔄 Fluxo Completo

```
┌─────────────────────────────────────────────────────────────┐
│  1. DESCoberta                                              │
│                                                             │
│  Cliente ──── tools/list ────▶ Servidor                     │
│  Cliente ◀─── Lista de tools ─ Servidor                     │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│  2. EXECUÇÃO                                                │
│                                                             │
│  Cliente ──── tools/call ────▶ Servidor                     │
│  Cliente ◀─── Resultado ───── Servidor                      │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│  3. NOTIFICAÇÃO (opcional)                                  │
│                                                             │
│  Servidor ── notifications/tools/list_changed ──▶ Cliente   │
│  Cliente ── tools/list (para ver novas tools) ──▶ Servidor  │
└─────────────────────────────────────────────────────────────┘
```

---

## 📊 Resumo dos Tipos de Request

| Tipo | Tem `id`? | Espera resposta? | Exemplo |
|------|-----------|------------------|---------|
| **Request** | ✅ Sim | ✅ Sim | `tools/list`, `tools/call` |
| **Notification** | ❌ Não | ❌ Não | `notifications/cancelled` |
| **Response** | ✅ Sim | - | Resposta a um request |

---

## 💡 Dica Prática

No **stdio**, as mensagens são **newline-delimited JSON**:

```
{"jsonrpc":"2.0","id":1,"method":"tools/list"}\n
{"jsonrpc":"2.0","id":1,"result":{"tools":[...]}}\n
{"jsonrpc":"2.0","id":2,"method":"tools/call","params":{...}}\n
{"jsonrpc":"2.0","id":2,"result":{"content":[...]}}\n
```

Cada linha é uma mensagem JSON completa!

---

## 📚 Referências

- [MCP Specification - Tools](https://modelcontextprotocol.io/specification/2026-07-28/server/tools)
- [MCP TypeScript SDK](https://ts.sdk.modelcontextprotocol.io/server.html)
- [JSON-RPC 2.0 Specification](https://www.jsonrpc.org/specification)
