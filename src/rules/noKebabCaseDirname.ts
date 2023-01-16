import { defineRule, Message } from '../defineRule'

export const noKebabCaseDirname = defineRule('noKebabCaseDirname', ({ dirs }) => {
  const messages: Message[] = []
  dirs.forEach((dir) => {
    if (dir.includes('-')) {
      messages.push({
        level: 'error',
        path: dir,
        message: `directory name is invalid(kebab-case)`
      })
    }
  })
  return {
    messages
  }
})
