import { defineConfig, execute } from './src/index'

execute(
  defineConfig({
    overrides: [
      {
        files: 'src/**/*',
        rules: {
          noPattern: {
            patterns: [
              "from 'glob'"
            ]
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
          noKebabCaseDirname: true,
          noKebabCaseFilename: true
        }
      }
    ]
  })
)
