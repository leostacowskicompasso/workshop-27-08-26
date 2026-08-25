import * as z from 'zod/v4'

import { TOOL } from './config.js'

const apps = ['storefront-v1', 'storefront-v2', 'checkout-service', 'catalog-api', 'search-service']
const statuses = ['online', 'degraded', 'offline', 'em manutenção']

const randomFrom = (list) => list[Math.floor(Math.random() * list.length)]
const randomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min

const execute = async ({ app = '' }) => {
  try {
    const target = typeof app === 'string' && app.trim() ? app.trim() : randomFrom(apps)

    const text = [
      `Aplicação: ${target}`,
      `Status: ${randomFrom(statuses)}`,
      `Uptime: ${randomInt(90, 100)}.${randomInt(0, 99)}%`,
      `Latência média: ${randomInt(50, 800)}ms`,
      `CPU: ${randomInt(5, 95)}%`,
      `Memória: ${randomInt(100, 4096)}MB`,
    ].join('\n')

    return { content: [{ type: 'text', text }] }
  } catch (error) {
    return { content: [{ type: 'text', text: error?.message || JSON.stringify(error) }] }
  }
}

export default {
  name: TOOL.NAME,
  description: TOOL.DESCRIPTION,
  execute,
  inputSchema: z.object({
    app: z
      .string()
      .optional()
      .describe(
        `Nome da aplicação a consultar (opcional). Se omitido, retorna dados de uma aplicação fictícia aleatória. (Ex.: ${apps.join(' | ')})`,
      ),
  }),
}
