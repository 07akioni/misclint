import glob from 'glob'
import fs from 'fs'
import { promisify } from 'util'
import { defer, formatMessage } from './utils'
import type { Config } from './config'
import { printDiagnostics } from './print'
import { ruleExecutors } from './rules/index'
import { RuleName } from './rules/types'

const statAsync = promisify(fs.stat)

export async function execute(config: Config) {
  let shouldExitNormally = true
  try {
    for (const override of config.overrides) {
      const files = Array.isArray(override.files)
        ? override.files
        : [override.files]
      for (const fileGlob of files) {
        const deferred = defer()
        glob(
          fileGlob,
          { ignore: ['node_modules/**/*'] },
          async (error, filesOrDirs) => {
            if (error) {
              console.error(error)
              deferred.reject(
                new Error(
                  formatMessage('execute', 'internal error: glob error')
                )
              )
              return
            }
            const files: string[] = []
            const dirs: string[] = []
            for (const fileOrDir of filesOrDirs) {
              if ((await statAsync(fileOrDir)).isDirectory()) {
                dirs.push(fileOrDir)
              } else {
                files.push(fileOrDir)
              }
            }
            const { rules } = override
            for (const ruleName in rules) {
              const ruleExecutor = ruleExecutors[ruleName as RuleName]
              const { messages } = await ruleExecutor({
                files,
                dirs,
                params: rules[ruleName as RuleName] as any
              })
              if (shouldExitNormally && messages.length) {
                shouldExitNormally = false
              }
              printDiagnostics(ruleName, messages)
            }
            deferred.resolve()
          }
        )
        await deferred.promise
      }
    }
  } catch (error) {
    console.error('internal error', error)
  }
  if (!shouldExitNormally) {
    process.exit(1)
  }
}
