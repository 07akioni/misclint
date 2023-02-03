import { defineRule, type Message } from '../defineRule.js'

export const maxFileSize = defineRule<{ size: number, showInfo?: boolean }>(
  'maxFileSize',
  async ({ files, params }) => {
    const messages: Message[] = []
    await Promise.all(
      files.map((file) => {
        return (async () => {
          const fileSize = await file.ensureSize()
          if (fileSize > params.size) {
            messages.push({
              level: 'error',
              path: file.path,
              message: `file size ${fileSize} bytes exceeds ${params.size} bytes`
            })
          } else if (params.showInfo) {
            messages.push({
              level: 'info',
              path: file.path,
              message: `file size ${fileSize} bytes doesn't exceed ${params.size} bytes`
            })
          }
        })()
      })
    )
    return {
      messages
    }
  }
)
