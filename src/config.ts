import { ExtractExecuteParams } from './defineRule.js'
import { ruleExecutors } from './rules/index.js'
import type { RuleName } from './rules/types.js'

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
