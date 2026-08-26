import { createServer } from 'node:http'

import { createMcpHandler, McpServer } from '@modelcontextprotocol/server'
import { toNodeHandler } from '@modelcontextprotocol/node'

import { SERVER, LOGGER } from './config.js'
import tools from '../../tools/index.js'

const handler = createMcpHandler(() => {
  const server = new McpServer({ name: SERVER.NAME, version: SERVER.VERSION })

  tools.forEach((tool) => {
    server.registerTool(
      tool.name,
      {
        description: tool.description,
        inputSchema: tool.inputSchema,
      },
      tool.execute,
    )
  })

  return server
})

const httpServer = createServer(toNodeHandler(handler))

httpServer.listen(SERVER.PORT, () =>
  console.log(`@${LOGGER.PREFIX} listening on ${SERVER.URL}:${SERVER.PORT}`),
)

process.on('SIGINT', async () => {
  await handler.close()

  httpServer.close(() => process.exit(0))
})
