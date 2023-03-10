import { defineRule, Message } from '../defineRule.js'

export const noKebabCaseFilename = defineRule(
  'noKebabCaseFilename',
  async ({ files }) => {
    const messages: Message[] = []
    files.forEach((file) => {
      if (file.name.includes('-')) {
        messages.push({
          level: 'error',
          path: file.path,
          message: `filename is invalid(kebab-case)`
        })
      }
    })
    return {
      messages
    }
  }
)
