import { defineRule, type Message } from '../defineRule'

export const maxFileSize = defineRule<{ size: number }>(
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
              message: `size ${fileSize} bytes exceeds ${params.size} bytes`
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
