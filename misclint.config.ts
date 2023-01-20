import { executeConfig } from './src/index.js'

executeConfig({
  overrides: [
    {
      files: 'src/**/*',
      rules: {
        noPattern: {
          patterns: ["from 'glob'"]
        },
        maxFileSize: {
          size: 512
        }
      }
    },
    {
      files: 'src/rules',
      rules: {
        maxDirectorySize: {
          size: 1024
        }
      }
    },
    {
      files: 'test/**/*',
      rules: {
        requiredPattern: {
          patterns: ['foo']
        },
        noKebabCaseDirname: true,
        noKebabCaseFilename: true
      }
    }
  ]
})
