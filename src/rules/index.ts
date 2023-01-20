import { Rule } from '../defineRule.js'
import { maxDirectorySize } from './maxDirectorySize.js'
import { maxFileSize } from './maxFileSize.js'
import { noKebabCaseDirname } from './noKebabCaseDirname.js'
import { noKebabCaseFilename } from './noKebabCaseFilename.js'
import { noPattern } from './noPattern.js'
import { requiredPattern } from './requiredPattern.js'
import { RuleName } from './types.js'

export const ruleExecutors = {
  maxDirectorySize,
  maxFileSize,
  noKebabCaseDirname,
  noKebabCaseFilename,
  noPattern,
  requiredPattern
} satisfies Record<RuleName, Rule<any>>
