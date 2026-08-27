# Diferença: Servidor Web vs Servidor MCP

## O que é MCP?

O **MCP (Model Context Protocol)** é um protocolo de comunicação entre sistemas que permite a troca de informações de dados/contexto entre diferentes aplicações (majoritariamente de IA).

Usando a analogia do USB-C:
> Pense no MCP como uma porta USB-C para aplicações de IA. Assim como o USB-C fornece uma maneira padronizada de conectar dispositivos eletrônicos, o MCP fornece uma maneira padrão de conectar aplicações de IA a outros sistemas.

---

## 🌐 Servidor Web vs Servidor MCP

### Servidor Web Tradicional

```
┌─────────────────┐      ┌─────────────────┐
│   Navegador     │ ───▶ │  Servidor Web   │
│   (Cliente)     │      │   (Express,     │
│                 │ ◀─── │    Fastify, etc) │
└─────────────────┘      └─────────────────┘
         │                        │
         └────────────────────────┘
              HTTP Requests/Responses
```

**O que faz:**
- Recebe requisições HTTP (GET, POST, PUT, DELETE)
- Retorna dados (JSON, HTML, XML)
- Gerencia rotas e middlewares
- Serve para qualquer aplicação web

**Exemplo típico:**
```javascript
// Servidor web comum
app.get('/api/users', (req, res) => {
  res.json([{ id: 1, name: 'João' }]);
});
```

---

### Servidor MCP

```
┌─────────────────┐      ┌─────────────────┐
│   Agente IA     │ ───▶ │  Servidor MCP   │
│   (Opencode,    │      │   (Tools)       │
│    Claude, etc) │ ◀─── │                 │
└─────────────────┘      └─────────────────┘
         │                        │
         └────────────────────────┘
           MCP Protocol Messages
```

**O que faz:**
- Comunica-se usando o **Protocolo MCP** (não HTTP comum)
- Disponibiliza **tools** (funcionalidades) para IA consumir
- Tem um **schema padronizado** (quais tools existem, parâmetros, etc)
- Gerencia contexto e estado de sessões

**Exemplo típico:**
```javascript
// Servidor MCP
server.tool(
  'get_user_status',           // Nome da tool
  { userId: z.string() },      // Schema dos parâmetros
  async ({ userId }) => {      // Handler da tool
    return { content: [{ type: 'text', text: `Status: ativo` }] };
  }
);
```

---

## 🔑 Diferenças Principais

| Aspecto | Servidor Web | Servidor MCP |
|---------|--------------|--------------|
| **Protocolo** | HTTP/HTTPS | MCP (stdio ou HTTP) |
| **Consumidor** | Navegador, apps, etc | Agentes de IA |
| **Interface** | Rotas REST/GraphQL | Tools com schemas |
| **Dados** | JSON/HTML/etc | Mensagens MCP padronizadas |
| **Autenticação** | JWT, OAuth, etc | Variável (pode ser None) |
| **Complexidade** | Simples a complexa | Geralmente simples |

---

## 💡 Analogia Prática

**Servidor Web** = Um **balcão de atendimento** que atende qualquer pessoa com diferentes pedidos

**Servidor MCP** = Um **robô programado** que só faz o que a IA manda, de forma previsível

---

## 🎯 Por que usar MCP?

1. **Padronização** - Qualquer IA pode consumir suas tools
2. **Segurança** - Controle total do que a IA pode acessar
3. **Controle** - Defina exatamente quais funcionalidades estão disponíveis
4. **Escopo** - A IA só vê o que você expõe (não precisa de acesso completo ao sistema)

---

## 📨 Formato das Mensagens MCP

### O Protocolo por Trás: JSON-RPC

MCP usa **JSON-RPC** como formato de mensagem. É um protocolo leve e padronizado:

```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "method": "tools/call",
  "params": {
    "name": "get_user_status",
    "arguments": { "userId": "123" }
  }
}
```

---

## 🔄 Comparação: HTTP vs WebSocket vs MCP

### HTTP Tradicional (Requisição/Resposta)
```
Cliente ──── GET /api/users ────▶ Servidor
Cliente ◀──── 200 OK + JSON ──── Servidor
         (fim da conexão)
```
- **Sem estado** - Cada requisição é independente
- **Unidirecional** - Cliente sempre inicia

### WebSocket (Bidirecional)
```
Cliente ──── Handshake ────▶ Servidor
         (conexão permanece aberta)
Cliente ◀─── Mensagem ──── Servidor
Cliente ──── Mensagem ────▶ Servidor
Cliente ◀─── Push ──────── Servidor
```
- **Bidirecional** - Ambos podem enviar
- **Estado** - Conexão persistente
- **Tempo real** - Servidor pode "empurrar" dados

### MCP (Sobre HTTP ou stdio)
```
Cliente ──── tools/call ──────▶ Servidor
         (HTTP POST ou stdin)
Cliente ◀──── Resultado ─────── Servidor
         (HTTP Response ou stdout)
```
- **Pode ser stateless** (HTTP) ou **stateful** (stdio)
- **Formato padronizado** - JSON-RPC
- **Transporte flexível** - HTTP ou processos filhos

---

## 🎯 Exemplo Prático: Mensagem MCP

### Request (Cliente → Servidor)
```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "method": "tools/call",
  "params": {
    "name": "nordesul-status",
    "arguments": {
      "app": "loja-virtual-v1"
    }
  },
  "_meta": {
    "io.modelcontextprotocol/protocolVersion": "2026-07-28"
  }
}
```

### Response (Servidor → Cliente)
```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "result": {
    "content": [
      {
        "type": "text",
        "text": "Status: online | Uptime: 99.9% | Versão: 1.2.3"
      }
    ]
  }
}
```

---

## 🔌 Transportes no MCP

### 1. **stdio** (Processo Filho)
```
┌─────────────┐     stdin      ┌─────────────┐
│  Cliente    │ ──────────────▶ │  Servidor   │
│  (Opencode) │ ◀────────────── │  (Node.js)  │
└─────────────┘     stdout     └─────────────┘
```
- Servidor roda como processo filho
- Mensagens via `process.stdin` / `process.stdout`
- Cada linha é uma mensagem JSON
- **Não é WebSocket!** É comunicação inter-processos (IPC)

### 2. **HTTP** (Streamable HTTP)
```
┌─────────────┐     POST /mcp  ┌─────────────┐
│  Cliente    │ ──────────────▶ │  Servidor   │
│  (Opencode) │ ◀────────────── │  (Express)  │
└─────────────┘     Response   └─────────────┘
```
- Cada mensagem é um HTTP POST
- Resposta pode ser JSON ou SSE (Server-Sent Events)
- **Não é WebSocket!** É HTTP REQUEST/RESPONSE

---

## ❓ Por que NÃO é WebSocket?

| Característica | WebSocket | MCP (HTTP) |
|----------------|-----------|------------|
| **Handshake** | Upgrade de HTTP | POST simples |
| **Conexão** | Persistente | Pode ser stateless |
| **Formato** | Frames binários | JSON-RPC |
| **Complexidade** | Maior | Menor |
| **Escalabilidade** | Mais difícil | Mais fácil |

---

## 💡 Resumo

- **MCP** é um **protocolo de mensagens** (JSON-RPC)
- Pode rodar sobre **HTTP** (como API comum) ou **stdio** (como processo filho)
- **Não é WebSocket** - é mais simples e flexível
- Cada requisição é independente (stateless) ou com sessão (stateful)

---

## 📚 Referências

- [MCP Specification](https://modelcontextprotocol.io/specification/2026-07-28)
- [MCP TypeScript SDK](https://ts.sdk.modelcontextprotocol.io/v2/servers/tools)
- [MCP Documentation](https://modelcontextprotocol.io/docs)
