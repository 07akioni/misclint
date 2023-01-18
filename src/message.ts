import chalk from 'chalk'
import { compare } from 'natural-orderby'
import { Message } from './defineRule'

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
  print(): {
    errorCount: number
  } {
    let errorCount = 0
    const messagesToSort: Array<[string, Map<string, Message[]>]> = []
    for (const pair of this.data) {
      messagesToSort.push(pair)
    }
    messagesToSort.sort(([pathA], [pathB]) => {
      return sorter(pathA, pathB)
    })
    for (const [path, ruleName2MessagesMap] of messagesToSort) {
      console.log(chalk.underline(path))
      for (const [ruleName, messages] of ruleName2MessagesMap) {
        for (const { level, message } of messages) {
          console.log(
            `  ${chalk.red(level)} ${message} ${chalk.gray(ruleName)}`
          )
          errorCount++
        }
      }
    }
    return {
      errorCount
    }
  }
}

export const messageCollector = new MessageCollector()
