import { defineRule } from '../defineRule'
import { promisify } from 'util'
import fs from 'fs'

const readFileAsync = promisify(fs.readFile)

export const rule = defineRule<{ patterns: string[] }>(
  async (files, _, params) => {
    await Promise.all(
      files.map((file) => {
        return (async () => {
          const content = await readFileAsync(file)
          params.patterns.some((pattern) => {
            if (content.includes(pattern)) {
              console.error('invalid pattern in file', file, pattern)
            }
          })
        })()
      })
    )
  }
)
