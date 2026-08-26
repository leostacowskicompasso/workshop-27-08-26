import { McpServer } from '@modelcontextprotocol/server'
import { serveStdio } from '@modelcontextprotocol/server/stdio'

import { SERVER } from './config.js'
import tools from '../../tools/index.js'

const handle = serveStdio(() => {
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

process.on('SIGINT', () => handle.close())
