# Exemplos de Prompts — Workshop MCP

Aqui estão exemplos práticos de como usar tools MCP de forma natural e direta.

---

## 🎯 Tools do Repositório (Nordesul)

### `nordesul-delivery` — Padrões e Convenções de Código

1. "Quais são as convenções de código que devo seguir na área de checkout?"
2. "Me mostra os padrões de naming usados na PDP do Nordesul."
3. "Preciso adicionar uma nova feature na home, quais são as boas práticas?"

### `nordesul-deploy` — Cuidados antes de Publicar

1. "Vou fazer deploy hoje, o que preciso checar antes?"
2. "Quais são os cuidados essenciais antes de subir uma mudança em produção?"
3. "Tem algum checklist de deploy que eu deveria seguir?"

### `nordesul-reference` — Documentação das APIs

1. "Me mostra como funciona a API de produtos do Nordesul."
2. "Quero integrar com o carrinho, quais são os endpoints disponíveis?"
3. "Preciso consultar a API de pedidos, me dá um exemplo de uso."

### `nordesul-status` — Saúde das Aplicações

1. "Como está a saúde da aplicação storefront-v2?"
2. "Tem algum serviço fora do ar no momento?"
3. "Me dá o status do checkout-service."

---

## 🌐 Ideias para Tools com APIs Públicas

Use o catálogo **https://www.freepublicapis.com/tags/popular** para escolher uma API e criar sua própria tool!

### 🌤️ Clima (Open Meteo)

**API:** https://open-meteo.com/

```text
"Qual a temperatura atual em São Paulo?"
"Vai chover em Curitiba amanhã?"
"Me dá a previsão do tempo para os próximos 3 dias em Porto Alegre."
```

**Exemplo de tool:**
```javascript
// tools/weather/tool.js
export async function handler({ city }) {
  // Primeiro buscar coordenadas da cidade, depois clima
  const response = await fetch(
    `https://api.open-meteo.com/v1/forecast?latitude=-23.55&longitude=-46.63&current_weather=true`
  );
  const data = await response.json();
  return { content: [{ type: 'text', text: `Temperatura: ${data.current_weather.temperature}°C` }] };
}
```

---

### 🍲 Receitas (Free Meal API)

**API:** https://www.themealdb.com/api.php

```text
"Me sugere uma receita aleatória para o jantar."
"Como fazer um bolo de chocolate?"
"Quais receitas mexicanas você conhece?"
```

**Exemplo de tool:**
```javascript
// tools/recipes/tool.js
export async function handler({ query }) {
  const response = await fetch(
    `https://www.themealdb.com/api/json/v1/1/search.php?s=${query}`
  );
  const data = await response.json();
  const meal = data.meals?.[0];
  return { content: [{ type: 'text', text: meal ? `${meal.strMeal}: ${meal.strInstructions}` : 'Receita não encontrada' }] };
}
```

---

### 📰 Notícias Tech (HackerNews)

**API:** https://github.com/HackerNews/API

```text
"Quais são as top 5 notícias de tech agora?"
"Me mostra os posts mais comentados do HackerNews."
"Tem alguma notícia sobre IA hoje?"
```

**Exemplo de tool:**
```javascript
// tools/hackernews/tool.js
export async function handler({ limit = 5 }) {
  const topIds = await fetch('https://hacker-news.firebaseio.com/v0/topstories.json').then(r => r.json());
  const stories = await Promise.all(
    topIds.slice(0, limit).map(id => 
      fetch(`https://hacker-news.firebaseio.com/v0/item/${id}.json`).then(r => r.json())
    )
  );
  const text = stories.map((s, i) => `${i+1}. ${s.title} (${s.score} pts)`).join('\n');
  return { content: [{ type: 'text', text }] };
}
```

---

### ⚽ Futebol (Football Data API)

**API:** https://www.football-data.org/

```text
"Quais jogos da Premier League tem essa semana?"
"Qual a tabela atual do Brasileirão?"
"Quem é o artilheiro da Champions League?"
```

---

### 🌍 Dados Econômicos (World Bank)

**API:** https://datahelpdesk.worldbank.org/knowledgebase/topics/125589

```text
"Qual o PIB do Brasil nos últimos 5 anos?"
"Compara a população do Brasil com a da Argentina."
"Qual a taxa de desemprego na América Latina?"
```

---

### 🎮 Jogos Grátis (GamerPower)

**API:** https://www.gamerpower.com/api-read

```text
"Tem algum jogo grátis disponível agora?"
"Quais jogos estão em promoção na Steam?"
"Me mostra os giveaways ativos de PC."
```

---

### 🎲 Dados Aleatórios (Várias APIs)

```text
"Me conta uma curiosidade aleatória." (API: uselessfacts.jsph.pl)
"Gera um nome de usuário pra mim." (API: randomuser.me)
"Me conta uma piada." (API: official-joke-api.appspot.com)
```

---

## 💡 Dicas para Criar Bons Prompts

1. **Seja específico** — "Qual a temperatura em SP?" é melhor que "Como está o tempo?"
2. **Use linguagem natural** — O agente entende contexto
3. **Peça ações** — "Me mostra...", "Busca...", "Lista..."
4. **Combine tools** — "Verifica o status e depois faz o deploy"
