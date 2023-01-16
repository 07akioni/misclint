import { ExtractExecuteParams } from './defineRule'
import { ruleExecutors } from './rules'
import type { RuleName } from './rules/types'

export type Config = {
  overrides: Array<{
    files: string | string[]
    rules: {
      [key in RuleName]?: ExtractExecuteParams<typeof ruleExecutors[key]>
    }
  }>
}

export function defineConfig<T extends Config>(config: T): T {
  return config
}
