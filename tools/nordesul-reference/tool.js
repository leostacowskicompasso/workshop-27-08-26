import * as z from 'zod/v4'

import { TOOL } from './config.js'
import baconIpsum from '../../utils/bacon-ipsum.js'

const docs = {
  products: {
    method: 'GET',
    path: '/api/v1/products',
    description: 'Retorna a lista paginada de produtos do catálogo.',
    params: '?page=1&limit=20&category=eletronicos',
  },
  cart: {
    method: 'POST',
    path: '/api/v1/cart',
    description: 'Adiciona um item ao carrinho do usuário autenticado.',
    params: '{ "sku": "ABC123", "quantity": 2 }',
  },
  orders: {
    method: 'GET',
    path: '/api/v1/orders/{orderId}',
    description: 'Consulta os detalhes de um pedido pelo ID.',
    params: 'orderId (path param)',
  },
  customers: {
    method: 'GET',
    path: '/api/v1/customers/{customerId}',
    description: 'Consulta os dados cadastrais de um cliente.',
    params: 'customerId (path param)',
  },
}

const execute = async ({ api = '', type = 'all-meat', paras = 1, sentences = null }) => {
  try {
    if (typeof api !== 'string' || !Object.keys(docs).includes(api)) {
      throw new Error(
        `ERRO: API inválida. Por favor, escolha uma das seguintes APIs: ${Object.keys(docs).join(', ')}`,
      )
    }

    const doc = docs[api]
    const [response] = await baconIpsum({ type, paras, sentences })

    const text = [
      `Endpoint: ${doc.method} ${doc.path}`,
      `Descrição: ${doc.description}`,
      `Parâmetros: ${doc.params}`,
      `Definição: ${response}`,
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
    api: z
      .string()
      .describe(
        `API que deseja consultar a documentação. (Uma de: ${Object.keys(docs).join(' | ')})`,
      ),
    type: z
      .enum(['all-meat', 'meat-and-filler'])
      .optional()
      .describe(
        'Tipo de texto gerado para o exemplo de resposta (Uma de: all-meat | meat-and-filler).',
      ),
    paras: z
      .number()
      .int()
      .positive()
      .optional()
      .describe('Número de parágrafos a gerar para o exemplo de resposta.'),
    sentences: z
      .number()
      .int()
      .positive()
      .optional()
      .describe('Número de frases a gerar para o exemplo de resposta (sobrepõe paras).'),
  }),
}
