import { defineRule, Message } from '../defineRule.js'

export const requiredPattern = defineRule<{ patterns: string[] }>(
  'requiredPattern',
  async ({ files, params }) => {
    const messages: Message[] = []
    await Promise.all(
      files.map((file) => {
        return (async () => {
          const content = await file.ensureContent()
          params.patterns.some((pattern) => {
            if (!content.includes(pattern)) {
              messages.push({
                level: 'error',
                path: file.path,
                message: `required pattern \`${pattern}\` does't exist`
              })
            }
          })
        })()
      })
    )
    return {
      messages
    }
  }
)
