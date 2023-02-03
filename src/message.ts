import chalk from 'chalk'
import { compare } from 'natural-orderby'
import { Message } from './defineRule.js'
import { Level } from './types.js'

const sorter = compare()

class MessageCollector {
  private data = new Map<string, Map<string, Message[]>>()
  constructor() {}
  collect(path: string, ruleName: string, message: Message) {
    const { data } = this
    if (!data.has(path)) {
      data.set(path, new Map<string, Message[]>())
    }
    const ruleName2MessagesMap = data.get(path)!
    if (!ruleName2MessagesMap.has(ruleName)) {
      ruleName2MessagesMap.set(ruleName, [])
    }
    const collectedMessages = ruleName2MessagesMap.get(ruleName)
    collectedMessages?.push(message)
  }
  print(levelToPrint: Level | undefined): {
    count: number
    infoCount: number
    errorCount: number
  } {
    let count = 0
    let errorCount = 0
    let infoCount = 0
    const messagesToSort: Array<[string, Map<string, Message[]>]> = []
    for (const pair of this.data) {
      messagesToSort.push(pair)
    }
    messagesToSort.sort(([pathA], [pathB]) => {
      return sorter(pathA, pathB)
    })
    let isFirstPrint = true
    for (const [path, ruleName2MessagesMap] of messagesToSort) {
      let pathPrinted = false
      for (const [ruleName, messages] of ruleName2MessagesMap) {
        for (const { level: messageLevel, message } of messages) {
          if (levelToPrint !== undefined && levelToPrint !== messageLevel)
            continue
          if (!pathPrinted) {
            if (!isFirstPrint) {
              console.log()
            } else {
              isFirstPrint = false
            }
            console.log(chalk.underline(path))
            pathPrinted = true
          }
          const isError = messageLevel === 'error'
          if (isError) {
            errorCount++
          } else {
            infoCount++
          }
          console.log(
            `  ${
              isError ? chalk.red(messageLevel) : chalk.blue(messageLevel)
            } ${message} ${chalk.gray(ruleName)}`
          )
          count++
        }
      }
    }
    return {
      count,
      errorCount,
      infoCount
    }
  }
}

export const messageCollector = new MessageCollector()
