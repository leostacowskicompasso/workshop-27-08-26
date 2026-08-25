import * as z from 'zod/v4'

import { TOOL } from './config.js'

const docs = {
  products: {
    method: 'GET',
    path: '/api/v1/products',
    description: 'Retorna a lista paginada de produtos do catálogo.',
    params: '?page=1&limit=20&category=eletronicos',
    response: '{ "data": [...], "page": 1, "total": 240 }',
  },
  cart: {
    method: 'POST',
    path: '/api/v1/cart',
    description: 'Adiciona um item ao carrinho do usuário autenticado.',
    params: '{ "sku": "ABC123", "quantity": 2 }',
    response: '{ "cartId": "c_98213", "items": [...] }',
  },
  orders: {
    method: 'GET',
    path: '/api/v1/orders/{orderId}',
    description: 'Consulta os detalhes de um pedido pelo ID.',
    params: 'orderId (path param)',
    response: '{ "orderId": "o_5521", "status": "shipped", "items": [...] }',
  },
  customers: {
    method: 'GET',
    path: '/api/v1/customers/{customerId}',
    description: 'Consulta os dados cadastrais de um cliente.',
    params: 'customerId (path param)',
    response: '{ "customerId": "cust_101", "name": "...", "email": "..." }',
  },
}

const execute = async ({ api = '' }) => {
  try {
    if (typeof api !== 'string' || !Object.keys(docs).includes(api)) {
      throw new Error(
        `ERRO: API inválida. Por favor, escolha uma das seguintes APIs: ${Object.keys(docs).join(', ')}`,
      )
    }

    const doc = docs[api]
    const text = [
      `Endpoint: ${doc.method} ${doc.path}`,
      `Descrição: ${doc.description}`,
      `Parâmetros: ${doc.params}`,
      `Exemplo de resposta: ${doc.response}`,
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
  }),
}
