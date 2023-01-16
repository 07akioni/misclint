import { promisify } from 'util'
import fastFolderSize from 'fast-folder-size'
import { defineRule, type Message } from '../defineRule'
import { formatMessage } from '../utils'

const fastFolderSizeAsync = promisify(fastFolderSize)

export const maxDirectorySize = defineRule<{ size: number }>(
  'maxDirectorySize',
  async ({ dirs, params }) => {
    const messages: Message[] = []
    await Promise.all(
      dirs.map((dir) => {
        return (async () => {
          const folderSize = await fastFolderSizeAsync(dir)
          if (folderSize === undefined) {
            throw new Error(
              formatMessage(
                'maxDirectorySize',
                'internal error: folderSize is undefined'
              )
            )
          }
          if (folderSize > params.size) {
            messages.push({
              level: 'error',
              path: dir,
              message: `size ${folderSize} bytes exceeds ${params.size} bytes`
            })
          }
        })()
      })
    )
    return { messages }
  }
)
