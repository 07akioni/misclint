import { Message } from './defineRule'

let isFirst = false

export function printDiagnostics(ruleName: string, messages: Message[]): void {
  if (isFirst) {
    isFirst = false
  } else {
    console.log()
  }
  console.log(`rule:${ruleName}`)
  for (const { level, path, message } of messages) {
    console.log(`  ${path} [${level}]`)
    console.log(`    ${message}`)
  }
}
