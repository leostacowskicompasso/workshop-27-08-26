import * as z from 'zod/v4'

import { TOOL } from './config.js'

const checklist = [
  'Sempre valide as mudanças em ambiente de staging antes de promover para produção.',
  'Confirme que o rollback está pronto e testado antes de iniciar o deploy.',
  'Evite deploys em horários de pico de tráfego ou próximos ao fim do expediente/sexta-feira.',
  'Garanta que as migrations de banco de dados sejam retrocompatíveis.',
  'Monitore logs e métricas nos primeiros minutos após o deploy.',
  'Comunique o time e os stakeholders sobre a janela de deploy.',
  'Nunca faça deploy direto na branch principal sem passar por revisão de código.',
]

const execute = async () => {
  try {
    return { content: [{ type: 'text', text: checklist.join('\n') }] }
  } catch (error) {
    return { content: [{ type: 'text', text: error?.message || JSON.stringify(error) }] }
  }
}

export default {
  name: TOOL.NAME,
  description: TOOL.DESCRIPTION,
  execute,
  inputSchema: z.object({}),
}
