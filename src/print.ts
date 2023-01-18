import chalk from 'chalk'
import { Message } from './defineRule'

export function printDiagnostics(ruleName: string, messages: Message[]): void {
  for (const { level, path, message } of messages) {
    console.log(chalk.underline(path))
    console.log(`  ${chalk.red(level)} ${message} ${chalk.gray(ruleName)}`)
  }
}
