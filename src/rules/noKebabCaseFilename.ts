import { defineRule, Message } from '../defineRule'

export const noKebabCaseFilename = defineRule('noKebabCaseFilename', async ({ files }) => {
  const messages: Message[] = []
  files.forEach((file) => {
    if (file.includes('-')) {
      messages.push({
        level: 'error',
        path: file,
        message: `filename is invalid(kebab-case)`
      })
    }
  })
  return {
    messages
  }
})
