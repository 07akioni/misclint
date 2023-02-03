import { defineRule, type Message } from '../defineRule.js'

export const maxDirectorySize = defineRule<{
  size: number
  ignoreFolderSize?: boolean
  showInfo?: boolean
}>('maxDirectorySize', async ({ dirs, params }) => {
  const messages: Message[] = []
  await Promise.all(
    dirs.map((dir) => {
      return (async () => {
        const folderSize = await dir.ensureSize({
          ignoreFolderSize: params.ignoreFolderSize || false
        })
        if (folderSize > params.size) {
          messages.push({
            level: 'error',
            path: dir.path,
            message: `directory size ${folderSize} bytes exceeds ${params.size} bytes`
          })
        } else if (params.showInfo) {
          messages.push({
            level: 'info',
            path: dir.path,
            message: `directory size ${folderSize} bytes doesn't exceed ${params.size} bytes`
          })
        }
      })()
    })
  )
  return { messages }
})
