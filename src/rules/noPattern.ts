import { defineRule, Message } from '../defineRule'

export const noPattern = defineRule<{ patterns: string[] }>(
  'noPattern',
  async ({ files, params }) => {
    const messages: Message[] = []
    await Promise.all(
      files.map((file) => {
        return (async () => {
          const content = await file.ensureContent()
          params.patterns.some((pattern) => {
            if (content.includes(pattern)) {
              messages.push({
                level: 'error',
                path: file.path,
                message: `invalid pattern \`${pattern}\` exists`
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
