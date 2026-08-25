# workshop-27-08-26

Exemplo de servidor MCP para o workshop do bootcamp _AWS AI FDE for Commerce_ de 27/08/2026

## O que é MCP?

O [MCP (Model Context Protocol)](https://modelcontextprotocol.io/specification/2026-07-28) é um protocolo _open-source_ de comunicação entre sistemas, que permite a troca de informações de dados/contexto entre diferentes aplicações (Majoritariamente de IA).

Usando esse protocolo, é possível que um sistema de IA (como uma aplicação de agentes) consuma/disponibilize informações contextuais de/para outro sistema, permitindo que modelos operem com mais certeza e relevância.

Usando a [analogia do USB-C](https://modelcontextprotocol.io/docs/2026-07-28/getting-started/intro):

> Pense no MCP como uma porta USB-C para aplicações de IA. Assim como o USB-C fornece uma maneira padronizada de conectar dispositivos eletrônicos, o MCP fornece uma maneira padrão de conectar aplicações de IA a outros sistemas.

## Opções de SDK

O protocolo suporta diferentes opções de SDKs (Software Development Kits), que podem ser usados para implementar MCP em diferentes linguagens/frameworks.

Encontre a lista completa aqui: [Available SDKs](https://modelcontextprotocol.io/docs/2026-07-28/sdk#available-sdks)

## Opções de Transporte

Focando no contexto do workshop, vamos explorar as opções de transporte mais comuns/populares para Node.js, que são:

### stdio

Faça o servidor MCP rodar como um processo filho, envie e receba mensagens via _stdin_ e _stdout_.

[Serve over stdio](https://ts.sdk.modelcontextprotocol.io/v2/serving/stdio.html#serve-over-stdio)

### HTTP

Disponibilize um servidor, que recebe e envia mensagens via requisições HTTP para diversos clientes simultaneamente.

[Serve over HTTP](https://ts.sdk.modelcontextprotocol.io/v2/serving/http.html#serve-over-http)

### Frameworks

Use de tecnologias/frameworks de Node.js para facilitar a implementação do protocolo MCP, como:

- [Express](https://ts.sdk.modelcontextprotocol.io/v2/serving/express.html)
- [Fastify](https://ts.sdk.modelcontextprotocol.io/v2/serving/fastify.html)
- [Hono](https://ts.sdk.modelcontextprotocol.io/v2/serving/hono.html)

## Cenário do Workshop

Cliente **Nordesul**

1.  Considere um projeto de e-commerce atuando em um grande cliente, com uma equipe de 20 desenvolvedores alocados para fazer a migração de sua loja virtual legada (_V0_) para um framework mais moderno (_V1_). O objetivo é que a loja virtual _V1_ seja idêntica a _V0_, mas use melhorias de performance do _V1_.

2.  Como diversos desenvolvedores atuarão na mesma base de código, é primordial que as entregas possuam a melhor padronização e qualidade possíveis, seguindo as normas e identidade da nossa companhia.

3.  O cliente possui uma base de dados com documentações de todas as suas APIs, que estão em um endpoint compartilhado com a equipe de desenvolvimento para consulta.

## Este Repositório

Este repositório contém um template de servidor MCP, que pode ser usado para:

- Entender a implementação dos transportes _stdio_ e _HTTP_ com `@modelcontextprotocol/server`;
- Simular a comunicação entre sistemas de IA e qualquer serviço externo;
- Servir como inspiração para a implementação de um servidor MCP real;
- Ser a porta de entrada para o uso de Agentes de IA com _tools_ customizadas.

## Estrutura do Repositório

### **/servers**

Servidores MCP de exemplo, usando diferentes transportes e frameworks.

- **/servers/stdio**

Serve mensagens MCP via _stdin_ e _stdout_, como um processo filho.

- **/servers/http**

Serve mensagens MCP via requisições HTTP, usando apenas o módulo HTTP nativo do Node.js.

- **/servers/express**

Serve mensagens MCP via requisições HTTP, usando o framework Express.

### **/tools**

Exemplos de _tools_ customizadas, que podem ser usadas por Agentes de IA para interagir com outros sistemas.

- **/tools/nordesul-deploy**

Simula o deploy de uma aplicação no cliente Nordesul.

- **/tools/nordesul-git**

Simula padrões e contratos _git_ para o projeto.

- **/tools/nordesul-reference**

Simula a consulta de uma documentação de API no cliente Nordesul.

- **/tools/nordesul-status**

Simula a consulta do status de uma aplicação no cliente Nordesul.

## Rodando o Projeto

### Pré-requisitos

- [Node.js](https://nodejs.org/en/download) (>= LTS Preferido)
- Gerenciador de Pacotes (npm ou [yarn](https://classic.yarnpkg.com/lang/en/docs/install/#windows-stable))

### Instalando as Dependências

Na raíz do projeto, rode o comando:

```bash
npm install

# ou:

yarn install
```

### Rodando os Servidores

#### Servidor MCP via _stdio_:

```bash
npm run start:stdio

# ou:

yarn start:stdio
```

#### Servidor MCP via _http_:

```bash
npm run start:http

# ou:

yarn start:http
```

#### Servidor MCP via integração com _Express_:

```bash
npm run start:express

# ou:

yarn start:express
```

### Integração com Agentes de IA

- Opencode: [MCP servers](https://opencode.ai/docs/en/mcp-servers/);
- Claude: [Connect Claude Code to tools via MCP](https://code.claude.com/docs/en/mcp);
- Codex: [Model Context Protocol](https://learn.chatgpt.com/docs/extend/mcp);
- Cursor: [Model Context Protocol (MCP)](https://cursor.com/en-US/docs/mcp);
- Antigravity: [Model Context Protocol (MCP)](https://antigravity.google/docs/cli/mcp/).
