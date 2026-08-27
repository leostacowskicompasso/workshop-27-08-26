# Conceitos de Agentes de IA

## 🤖 O que é um Agente de IA?

### Definição Simples
> Um agente de IA é um **assistente inteligente** que pode **pensar, decidir e agir** para realizar tarefas, diferente de um chat simples que apenas responde perguntas.

### Analogia
- **Chat** = Atendente que responde perguntas sobre um manual
- **Agente** = Funcionário que pode acessar sistemas, tomar decisões e executar ações

---

## 🔄 Diferença: Chat vs Agente

### Chat Tradicional

```
Usuário: "Qual o status da loja virtual?"
   ↓
IA: "O status da loja virtual é online."
   ↓
Fim da conversa
```

**Características:**
- Apenas responde perguntas
- Não pode acessar sistemas externos
- Não pode executar ações
- Depende do que está no "manual" (treinamento)

### Agente de IA

```
Usuário: "Qual o status da loja virtual?"
   ↓
Agente: "Vou verificar o status..."
   ↓
Agente: [Usa tool nordesul-status]
   ↓
Agente: "A loja virtual está online com 99.9% de uptime.
         Quer que eu liste os cuidados antes de um deploy?"
   ↓
Usuário: "Sim, por favor"
   ↓
Agente: [Usa tool nordesul-deploy]
   ↓
Agente: "Aqui está a checklist: valide em staging, tenha
         rollback pronto, evite horários de pico..."
```

**Características:**
- Pode **pensar** e **decidir** o que fazer
- Pode **acessar sistemas externos** via tools
- Pode **executar ações** no mundo real
- Pode **manter contexto** ao longo da conversa
- Pode **planejar** etapas para atingir um objetivo

---

## 🧠 Componentes de um Agente

### 1. **Modelo de LLM** (O "Cérebro")
- É o modelo de linguagem (GPT, Claude, etc)
- Responsável pelo **raciocínio** e **geração de texto**
- Exemplo: `claude-3.5-sonnet`, `gpt-4`, etc

### 2. **Tools** (As "Mãos")
- Funcionalidades que o agente pode usar
- Permitem **interagir com o mundo exterior**
- Exemplos:
  - `nordesul-status` - Consultar status
  - `nordesul-deploy` - Realizar deploy
  - `nordesul-reference` - Consultar documentação
  - `web_search` - Buscar na internet
  - `read_file` - Ler arquivos

### 3. **Contexto** (A "Memória")
- Informações que o agente mantém durante a conversa
- Permite **lembrar** de interações anteriores
- Tipos:
  - **Histórico** - Mensagens anteriores
  - **Sistema** - Instruções iniciais
  - **Documentos** - Arquivos carregados

### 4. **Skills** (As "Habilidades")
- Capacidades especiais do agente
- Conjuntos de instruções para tarefas específicas
- Exemplos:
  - `code_review` - Revisar código
  - `deploy_app` - Fazer deploy
  - `debug_error` - Depurar erros

### 5. **Prompts** (As "Instruções")
- Textos que guiam o comportamento do agente
- Definem **como** o agente deve agir
- Exemplo:
  ```
  Você é um assistente de deploy do cliente Nordesul.
  Sempre verifique o status antes de fazer deploy.
  Em caso de erro, notifique o time.
  ```

---

## 📊 Glossário de Termos

### **LLM** (Large Language Model)
- Modelo de Linguagem de Grande Porte
- É o "cérebro" que processa e gera texto
- Exemplos: GPT-4, Claude, Gemini

### **Tool** (Ferramenta)
- Funcionalidade que o agente pode executar
- Define **o que** o agente pode fazer
- Exemplo: `nordesul-status`, `web_search`

### **Contexto** (Context)
- Informações que o agente "lembra"
- Permite manter a conversa coesa
- Limitado por **tokens**

### **Token**
- Unidade básica de processamento de texto
- Aproximadamente 4 caracteres em inglês
- Limita o tamanho do contexto
- Exemplo: "Hello world" = ~2 tokens

### **Prompt**
- Instrução ou pergunta para o modelo
- Define **como** o agente deve responder
- Pode ser do sistema ou do usuário

### **Skill** (Habilidade)
- Conjunto de instruções para uma tarefa específica
- Define **como** o agente deve agir
- Exemplo: "skill de deploy"

### **Agent** (Agente)
- Sistema que combina LLM + Tools + Contexto
- Capaz de **pensar, decidir e agir**
- Executa tarefas de forma autônoma

### **Chain of Thought** (Cadeia de Pensamento)
- Técnica onde o agente "pensa passo a passo"
- Melhora a precisão em tarefas complexas
- Exemplo: "Primeiro vou verificar... depois vou..."

### **Hallucination** (Alucinação)
- Quando o modelo gera informações falsas
- Ocorre quando não tem contexto suficiente
- Tools ajudam a reduzir alucinações

### **RAG** (Retrieval-Augmented Generation)
- Geração Aumentada por Recuperação
- Técnica para buscar informações externas
- Usa tools para buscar dados atualizados

---

## 🔄 Fluxo de Trabalho: Chat vs Agente

### Chat Tradicional

```
┌─────────────┐     ┌─────────────┐
│   Usuário   │ ──▶ │     LLM     │
│             │ ◀── │             │
└─────────────┘     └─────────────┘
        │                │
        └────────────────┘
           Pergunta/Resposta
```

**Fluxo:**
1. Usuário faz pergunta
2. LLM processa e responde
3. Fim

### Agente de IA

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   Usuário   │ ──▶ │   Agente    │ ──▶ │    Tool     │
│             │ ◀── │             │ ◀── │             │
└─────────────┘     └─────────────┘     └─────────────┘
        │                │                   │
        └────────────────┴───────────────────┘
              Pergunta → Raciocínio → Ação → Resposta
```

**Fluxo:**
1. Usuário faz pergunta
2. Agente **analisa** o que precisa fazer
3. Agente **decide** qual tool usar
4. Agente **executa** a tool
5. Agente **processa** o resultado
6. Agente **responde** ao usuário

---

## 🎯 Exemplo Prático: Deploy no Nordesul

### Cenário
O usuário vai fazer deploy da loja virtual e quer se preparar antes

### Fluxo com Chat Tradicional
```
Usuário: "Como faço deploy?"
IA: "Para fazer deploy, você deve seguir os seguintes passos:
     1. Acessar o painel
     2. Selecionar a aplicação
     3. Clicar em deploy
     ..."
```
→ O usuário ainda precisa **fazer tudo manualmente**

### Fluxo com Agente
```
Usuário: "Vou fazer deploy da loja virtual, o que preciso checar antes?"

Agente: "Vou verificar o status da aplicação primeiro..."
        [Usa nordesul-status]

Agente: "A aplicação está online. Antes de publicar, veja os
         cuidados essenciais..."
        [Usa nordesul-deploy]

Agente: "Aqui está a checklist antes do deploy:
         - Valide as mudanças em staging antes de produção
         - Confirme que o rollback está pronto e testado
         - Evite deploys em horários de pico
         Quer que eu detalhe algum desses pontos?"
```
→ O agente **reúne o contexto e orienta** — `nordesul-deploy` é consultiva (retorna boas práticas), não executa o deploy de fato

---

## 💡 Por que Usar Agentes?

### 1. **Automação**
- Reduz trabalho manual
- Executa tarefas repetitivas
- Economiza tempo

### 2. **Eficiência**
- Acessa múltiplos sistemas rapidamente
- Processa informações em paralelo
- Reduz erros humanos

### 3. **Escalabilidade**
- Pode atender vários usuários
- Não cansa nem esquece
- Disponível 24/7

### 4. **Precisão**
- Usa tools para buscar dados atualizados
- Reduz alucinações
- Mantém contexto da conversa

---

## 🔧 Como o MCP se Encaixa?

### O Papel do MCP

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   Agente    │ ──▶ │  Servidor   │ ──▶ │  Sistema    │
│   (IA)      │ ◀── │   MCP       │ ◀── │  Externo    │
└─────────────┘     └─────────────┘     └─────────────┘
        │                │                   │
        └────────────────┴───────────────────┘
           Raciocínio → Protocolo → Dados
```

**MCP é a "ponte" entre:**
- **Agente** (que pensa e decide)
- **Sistemas externos** (onde estão os dados)

### Sem MCP
- Agente não consegue acessar sistemas
- Precisa de integrações customizadas
- Difícil de manter e escalar

### Com MCP
- Agente acessa qualquer sistema via tools
- Integração padronizada e simples
- Fácil de manter e escalar

---

## 📋 Resumo dos Conceitos

| Conceito | O que é | Exemplo |
|----------|---------|---------|
| **LLM** | Cérebro do agente | GPT-4, Claude |
| **Tool** | Mão do agente | nordesul-status |
| **Contexto** | Memória do agente | Histórico da conversa |
| **Token** | Unidade de texto | "Hello" ≈ 1 token |
| **Prompt** | Instrução | "Faça o deploy..." |
| **Skill** | Habilidade | "Habilidade de deploy" |
| **Agent** | Sistema completo | LLM + Tools + Contexto |
| **MCP** | Protocolo de comunicação | Conecta agente a sistemas |

---

## 📚 Referências

- [MCP Documentation](https://modelcontextprotocol.io/docs)
- [What are AI Agents?](https://www.ibm.com/topics/ai-agents)
- [LLM vs AI Agents](https://www.datacamp.com/blog/llm-vs-agent)
- [Tool Use in LLMs](https://docs.anthropic.com/en/docs/build-with-claude/tool-use)
