import { Rule } from '../defineRule'
import { maxDirectorySize } from './maxDirectorySize'
import { maxFileSize } from './maxFileSize'
import { noKebabCaseDirname } from './noKebabCaseDirname'
import { noKebabCaseFilename } from './noKebabCaseFilename'
import { noPattern } from './noPattern'
import { requiredPattern } from './requiredPattern'
import { RuleName } from './types'

export const ruleExecutors = {
  maxDirectorySize,
  maxFileSize,
  noKebabCaseDirname,
  noKebabCaseFilename,
  noPattern,
  requiredPattern
} satisfies Record<RuleName, Rule<any>>
