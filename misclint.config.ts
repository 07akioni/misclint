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
          ignoreFolderSize: true,
          size: 1024
        }
      }
    },
    {
      files: 'src/rules',
      rules: {
        maxDirectorySize: {
          size: 1024000,
          showInfo: true
        }
      }
    },
    {
      files: 'src/fs.ts',
      rules: {
        maxFileSize: {
          size: 512000,
          showInfo: true
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
