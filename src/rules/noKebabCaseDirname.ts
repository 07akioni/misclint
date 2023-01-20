import { defineRule, Message } from '../defineRule.js'

export const noKebabCaseDirname = defineRule(
  'noKebabCaseDirname',
  ({ dirs }) => {
    const messages: Message[] = []
    dirs.forEach((dir) => {
      if (dir.name.includes('-')) {
        messages.push({
          level: 'error',
          path: dir.path,
          message: `directory name is invalid(kebab-case)`
        })
      }
    })
    return {
      messages
    }
  }
)
