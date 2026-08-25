import * as z from 'zod/v4'

import { TOOL } from './config.js'

const areas = {
  checkout: [
    'O checkout deve ser simples e intuitivo, com campos claros e botões de ação destacados.',
    'Evite redirecionamentos desnecessários durante o processo de checkout.',
  ],
  pdp: [
    'A página de detalhes do produto (PDP) deve fornecer informações completas sobre o produto, incluindo imagens de alta qualidade, descrições detalhadas e avaliações de clientes.',
    'Inclua recomendações de produtos relacionados para aumentar as chances de upsell.',
  ],
  home: [
    'A página inicial deve ser visualmente atraente e destacar os produtos mais populares ou em promoção.',
    'Use banners e carrosséis de forma moderada para não sobrecarregar o usuário.',
  ],
  search: [
    'A funcionalidade de busca deve ser rápida e precisa, retornando resultados relevantes com base nas palavras-chave inseridas pelo usuário.',
    'Inclua filtros e opções de classificação para ajudar os usuários a refinar seus resultados de busca.',
  ],
  cart: [
    'O carrinho de compras deve ser fácil de acessar e permitir que os usuários visualizem e modifiquem os itens adicionados.',
    'Inclua informações claras sobre preços, impostos e custos de envio antes do checkout.',
  ],
}

const execute = async ({ area = '' }) => {
  try {
    if (typeof area !== 'string' || !Object.keys(areas).includes(area)) {
      throw new Error(
        `ERRO: Área inválida. Por favor, escolha uma das seguintes áreas: ${Object.keys(
          areas,
        ).join(', ')}`,
      )
    }

    return { content: [{ type: 'text', text: areas[area]?.join('\n') }] }
  } catch (error) {
    return { content: [{ type: 'text', text: error?.message || JSON.stringify(error) }] }
  }
}

export default {
  name: TOOL.NAME,
  description: TOOL.DESCRIPTION,
  execute,
  inputSchema: z.object({
    area: z
      .string()
      .describe(
        `Área do e-commerce que deseja consultar. (Um de: ${Object.keys(areas).join(' | ')})`,
      ),
  }),
}
