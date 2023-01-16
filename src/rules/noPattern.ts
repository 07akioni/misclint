import { defineRule, Message } from '../defineRule'
import { promisify } from 'util'
import fs from 'fs'

const readFileAsync = promisify(fs.readFile)

export const noPattern = defineRule<{ patterns: string[] }>(
  'noPattern',
  async ({ files, params }) => {
    const messages: Message[] = []
    await Promise.all(
      files.map((file) => {
        return (async () => {
          const content = await readFileAsync(file)
          params.patterns.some((pattern) => {
            if (content.includes(pattern)) {
              messages.push({
                level: 'error',
                path: file,
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
