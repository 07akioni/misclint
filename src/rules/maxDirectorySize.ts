import { defineRule, type Message } from '../defineRule.js'

export const maxDirectorySize = defineRule<{ size: number }>(
  'maxDirectorySize',
  async ({ dirs, params }) => {
    const messages: Message[] = []
    await Promise.all(
      dirs.map((dir) => {
        return (async () => {
          const folderSize = await dir.ensureSize()
          if (folderSize > params.size) {
            messages.push({
              level: 'error',
              path: dir.path,
              message: `size ${folderSize} bytes exceeds ${params.size} bytes`
            })
          }
        })()
      })
    )
    return { messages }
  }
)
