import { defineRule } from '../defineRule'
import { promisify } from 'util'
import fs from 'fs'

const statAsync = promisify(fs.stat)

export const rule = defineRule<{ size: number }>(async (files, _, params) => {
  await Promise.all(
    files.map((file) => {
      return (async () => {
        const fileSize = (await statAsync(file)).size
        if (fileSize === undefined) {
          console.error('')
          return
        }
        if (fileSize > params.size) {
          console.error('file size exceeded', file, fileSize)
        }
      })()
    })
  )
})
