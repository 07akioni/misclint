import glob from 'glob'
import fs from 'fs'
import { promisify } from 'util'
import chalk from 'chalk'
import { defer, formatInternalErrorMessage } from './utils'
import type { Config } from './config'
import { messageCollector } from './message'
import { ruleExecutors } from './rules/index'
import { RuleName } from './rules/types'
import { makeDirHandle, makeFileHandle } from './fs'

const statAsync = promisify(fs.stat)

export async function execute(config: Config) {
  let errorCount = 0
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
                new Error(formatInternalErrorMessage('execute', 'glob error'))
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
              const { messages } = await ruleExecutor.execute({
                files: files.map(makeFileHandle),
                dirs: dirs.map(makeDirHandle),
                params: rules[ruleName as RuleName] as any
              })

              for (const message of messages) {
                messageCollector.collect(message.path, ruleName, message)
              }
            }
            deferred.resolve()
          }
        )
        await deferred.promise
      }
    }
    errorCount = messageCollector.print().errorCount
  } catch (error) {
    console.error(
      formatInternalErrorMessage('execute', 'execute with internal error'),
      error
    )
  }
  if (errorCount) {
    console.log()
    console.log(chalk.red(`\u2717 ${errorCount} errors`))
    console.log()
    process.exit(1)
  }
}
