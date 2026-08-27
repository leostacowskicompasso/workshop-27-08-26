# Conectando o Opencode ao Servidor MCP

## 🎯 Objetivo

Configurar o Opencode para usar o servidor MCP via stdio.

---

## 📋 Pré-requisitos

- Opencode instalado ([Download](https://opencode.ai/download))
- Node.js LTS instalado
- Repositório clonado e com dependências instaladas

---

## 🔧 Passo a Passo

### 1. Verificar Estrutura do Projeto

```
workshop-27-08-26/
├── servers/
│   └── stdio/
│       ├── main.js        # ← Este é o servidor MCP
│       └── config.js
├── tools/
│   ├── nordesul-deploy/
│   ├── nordesul-reference/
│   ├── nordesul-status/
│   └── nordesul-delivery/
└── .opencode/
    └── opencode.jsonc     # ← Arquivo de configuração do Opencode
```

### 2. Criar/Editar Arquivo de Configuração

O arquivo `.opencode/opencode.jsonc` deve conter:

```jsonc
{
  "$schema": "https://opencode.ai/config.json",
  "mcp": {
    "nordesul": {
      "type": "local",
      "command": ["node", "servers/stdio/main.js"],
      "cwd": ".",
      "enabled": true
    }
  }
}
```

**Explicação das opções:**

| Opção | Tipo | Descrição |
|-------|------|-----------|
| `type` | String | Tipo de conexão (`"local"` para stdio) |
| `command` | Array | Comando para iniciar o servidor |
| `cwd` | String | Diretório de trabalho (raiz do projeto) |
| `enabled` | Boolean | Habilitar/desabilitar o servidor |

### 3. Verificar se o Servidor Funciona

Antes de conectar ao Opencode, teste o servidor manualmente:

```bash
# Na raiz do projeto
node servers/stdio/main.js
```

Se não houver erros, o servidor está funcionando!

### 4. Iniciar o Opencode

```bash
# Na raiz do projeto
opencode
```

Ou se estiver em outro diretório:

```bash
opencode --cwd /caminho/para/workshop-27-08-26
```

### 5. Verificar se as Tools Estão Disponíveis

Dentro do Opencode, faça uma pergunta que use a tool:

```
Quero verificar o status da loja virtual v1
```

O Opencode deve:
1. Detectar que precisa usar a tool `nordesul-status`
2. Chamar o servidor MCP via stdio
3. Retornar a resposta

---

## 📝 Exemplo de Configuração Completa

### `.opencode/opencode.jsonc`

```jsonc
{
  "$schema": "https://opencode.ai/config.json",
  
  // Configurações gerais
  "theme": "dark",
  
  // Servidores MCP
  "mcp": {
    "nordesul": {
      "type": "local",
      "command": ["node", "servers/stdio/main.js"],
      "cwd": ".",
      "enabled": true,
      "timeout": 10000  // 10 segundos
    }
  },
  
  // Outras configurações...
}
```

---

## 🔄 Como Funciona a Conexão

```
┌─────────────────┐     stdin      ┌─────────────────┐
│                 │ ──────────────▶ │                 │
│    Opencode     │                 │  Servidor MCP   │
│    (Cliente)    │                 │  (stdio/main.js)│
│                 │ ◀────────────── │                 │
└─────────────────┘     stdout     └─────────────────┘
        │                                │
        │    {"jsonrpc":"2.0",           │
        │     "method":"tools/list"}     │
        │                                │
        │    {"jsonrpc":"2.0",           │
        │     "result":{"tools":[...]}}  │
        │                                │
        │    {"jsonrpc":"2.0",           │
        │     "method":"tools/call",     │
        │     "params":{...}}            │
        │                                │
        │    {"jsonrpc":"2.0",           │
        │     "result":{"content":[...]}}│
        └────────────────────────────────┘
```

---

## 🧪 Testando a Conexão

### Teste 1: Listar Tools

Dentro do Opencode:
```
Quais tools estão disponíveis?
```

Resposta esperada:
```
As tools disponíveis são:
- nordesul-status: Consulta status de aplicação
- nordesul-deploy: Simula deploy de aplicação
- nordesul-reference: Consulta documentação de API
- nordesul-delivery: Padrões e contratos de implementação
```

### Teste 2: Usar uma Tool

Dentro do Opencode:
```
Qual o status da loja-virtual-v1?
```

Resposta esperada:
```
[Opencode usa a tool nordesul-status]
A loja-virtual-v1 está online com uptime de 99.9%
```

---

## ⚠️ Solução de Problemas

### Problema: "Servidor não encontrado"

**Causa:** O comando está incorreto ou o arquivo não existe.

**Solução:**
```bash
# Verifique se o arquivo existe
ls -la servers/stdio/main.js

# Teste o servidor manualmente
node servers/stdio/main.js
```

### Problema: "Timeout ao buscar tools"

**Causa:** O servidor demorou muito para responder.

**Solução:**
```jsonc
{
  "mcp": {
    "nordesul": {
      "type": "local",
      "command": ["node", "servers/stdio/main.js"],
      "timeout": 15000  // Aumente o timeout
    }
  }
}
```

### Problema: "Tools não aparecem no Opencode"

**Causa:** O servidor não está retornando as tools corretamente.

**Solução:**
1. Verifique se o servidor está rodando
2. Teste o `tools/list` manualmente
3. Verifique os logs do Opencode

---

## 📊 Múltiplos Servidores

Você pode adicionar vários servidores MCP:

```jsonc
{
  "mcp": {
    "nordesul-stdio": {
      "type": "local",
      "command": ["node", "servers/stdio/main.js"],
      "enabled": true
    },
    "nordesul-http": {
      "type": "remote",
      "url": "http://localhost:8787/mcp",
      "enabled": false
    }
  }
}
```

---

## 🎯 Resumo

1. **Crie/edite** `.opencode/opencode.jsonc`
2. **Adicione** o servidor MCP com `type: "local"`
3. **Defina** o comando: `["node", "servers/stdio/main.js"]`
4. **Inicie** o Opencode
5. **Teste** fazendo perguntas que usem as tools

---

## 📚 Referências

- [Opencode MCP Servers Documentation](https://opencode.ai/docs/mcp-servers/)
- [MCP TypeScript SDK](https://ts.sdk.modelcontextprotocol.io/server.html)
- [Repositório](https://github.com/leostacowskicompasso/workshop-27-08-26)
