import { promisify } from 'util'
import fs from 'fs'
import { defineRule, type Message } from '../defineRule'
import { formatMessage } from '../utils'

const statAsync = promisify(fs.stat)

export const maxFileSize = defineRule<{ size: number }>(
  'maxFileSize',
  async ({ files, params }) => {
    const messages: Message[] = []
    await Promise.all(
      files.map((file) => {
        return (async () => {
          const fileSize = (await statAsync(file)).size
          if (fileSize === undefined) {
            throw new Error(
              formatMessage(
                'maxFileSize',
                'internal error: fileSize is undefined'
              )
            )
          }
          if (fileSize > params.size) {
            messages.push({
              level: 'error',
              path: file,
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
