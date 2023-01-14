import { defineRule } from '../defineRule'
import { promisify } from 'util'
import fastFolderSize from 'fast-folder-size'

const fastFolderSizeAsync = promisify(fastFolderSize)

export const rule = defineRule<{ size: number }>(async (_, dirs, params) => {
  await Promise.all(
    dirs.map((dir) => {
      return (async () => {
        const folderSize = await fastFolderSizeAsync(dir)
        if (folderSize === undefined) {
          console.error('')
          return
        }
        if (folderSize > params.size) {
          console.error('dir size exceeded', dir, folderSize)
        }
      })()
    })
  )
})
