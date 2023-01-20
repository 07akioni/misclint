import type { Level } from './types.js'
import type { RuleName } from './rules/types.js'
import { DirHandle, FileHandle } from './fs.js'

export type Message = { level: Level; path: string; message: string }

export type SyncExecuteReturn = {
  messages: Message[]
}

export type Execute<T> = (data: {
  files: FileHandle[]
  dirs: DirHandle[]
  params: T
}) => SyncExecuteReturn | Promise<SyncExecuteReturn>

export type Rule<T> = {
  name: RuleName
  execute: Execute<T>
}

export function defineRule<T>(name: RuleName, execute: Execute<T>): Rule<T> {
  return { name, execute }
}

export type ExtractExecuteParams<T> = T extends Rule<infer V> ? V : never
