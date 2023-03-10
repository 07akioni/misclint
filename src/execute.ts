import glob from 'glob'
import fs from 'fs'
import { promisify } from 'util'
import chalk from 'chalk'
import { defer, formatInternalErrorMessage } from './utils.js'
import type { Config } from './config.js'
import { messageCollector } from './message.js'
import { ruleExecutors } from './rules/index.js'
import { RuleName } from './rules/types.js'
import { makeDirHandle, makeFileHandle } from './fs.js'

const statAsync = promisify(fs.stat)

export async function execute(config: Config) {
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
  } catch (error) {
    console.error(
      formatInternalErrorMessage('execute', 'execute with internal error'),
      error
    )
  }
  const { infoCount, errorCount } = messageCollector.print(undefined)
  if (infoCount) {
    console.log()
    console.log(chalk.blue(`??? ${infoCount} info`))
  }
  if (errorCount) {
    if (!infoCount) console.log()
    console.log(chalk.red(`\u2717 ${errorCount} errors`))
    console.log()
    process.exit(1)
  }
}

export async function executeConfig<T extends Config>(config: T) {
  await execute(config)
}
