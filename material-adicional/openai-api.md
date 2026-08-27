# API OpenAI - Como as Requests Funcionam

Este documento complementa `protocolo.md` e `jsonrpc.md`, mostrando que os conceitos de **request/response, autenticação e streaming** que você viu no MCP também aparecem (de outra forma) em APIs REST tradicionais — como a da OpenAI.

> ⚠️ **Nota:** este material é só referência conceitual. O workshop **não** chama a API da OpenAI de verdade — você não precisa de uma API key da OpenAI para nada aqui.

## 🔑 Autenticação

A API OpenAI usa **Bearer token** no header `Authorization`, obtido de uma API key ou de um token de acesso de curta duração:

```bash
curl https://api.openai.com/v1/models \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -H "OpenAI-Organization: $ORGANIZATION_ID" \
  -H "OpenAI-Project: $PROJECT_ID"
```

- A API key é um **segredo** — nunca deve aparecer em código client-side (browser/app) nem em commits. Carregue via variável de ambiente.
- Os headers `OpenAI-Organization`/`OpenAI-Project` são opcionais, usados quando a conta pertence a mais de uma organização/projeto.

## 📨 Anatomia de uma Request

Diferente do MCP (que envia **tudo** — método, params e id — dentro de um único corpo JSON-RPC via `POST`), a API OpenAI é **REST**: o endpoint e o verbo HTTP já indicam a ação, e o corpo carrega só os parâmetros.

```bash
POST https://api.openai.com/v1/responses
Content-Type: application/json
Authorization: Bearer $OPENAI_API_KEY

{
  "model": "gpt-5",
  "input": "Explique o protocolo MCP em uma frase"
}
```

| | MCP (JSON-RPC) | OpenAI (REST) |
|---|---|---|
| Como identifica a ação | campo `method` no corpo | verbo HTTP + path do endpoint |
| Correlação request/response | campo `id` | correlação implícita da conexão HTTP |
| Transporte | stdio / Streamable HTTP | sempre HTTP |

## 📬 Anatomia de uma Response

O corpo de sucesso vem como JSON. Além dele, a resposta carrega headers úteis para debug e controle de uso:

- `x-request-id` — identificador único da request, essencial para abrir chamados de suporte.
- `openai-processing-ms` — tempo de processamento no servidor.
- `x-ratelimit-limit-requests` / `x-ratelimit-remaining-requests` — limite e saldo de requests.
- `x-ratelimit-limit-tokens` / `x-ratelimit-remaining-tokens` — limite e saldo de tokens.

## 🌊 Streaming (SSE)

Assim como os servidores MCP deste workshop (`servers/http`, `servers/express`) podem responder com `text/event-stream` (veja `diferenca.md`), a **Responses API** também usa **Server-Sent Events** para entregar a resposta em pedaços incrementais em vez de esperar o resultado completo — o mesmo mecanismo de transporte, aplicado a um protocolo diferente.

## ⚠️ Erros e Rate Limits

Erros seguem um formato de corpo previsível, e ultrapassar os limites de request/token retorna `429`. Sempre logar o `x-request-id` de uma request com erro facilita o troubleshooting.

---

## 📚 Referências

- [OpenAI API Reference - Overview](https://developers.openai.com/api/reference/overview)
- [MCP TypeScript SDK](https://ts.sdk.modelcontextprotocol.io/v2/servers/tools)
