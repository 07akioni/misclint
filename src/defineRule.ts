import type { Level } from './types'
import type { RuleName } from './rules/types'

export type Message = { level: Level; path: string, message: string }

export type SyncExecuteReturn = {
  messages: Message[]
}

export type Execute<T> = (data: {
  files: string[]
  dirs: string[]
  params: T
}) => SyncExecuteReturn | Promise<SyncExecuteReturn>

export function defineRule<T>(name: RuleName, execute: Execute<T>): Execute<T> {
  return execute
}

export type ExtractExecuteParams<T> = T extends Execute<infer V> ? V : never
