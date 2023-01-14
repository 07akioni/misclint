import glob from 'glob'
import path from 'path'

type Rules = {
  'max-directory-size': {
    size: number
  }
  'max-file-size': {
    size: number
  }
  'no-kebab-case-filename': boolean
  'no-kebab-case-dirname': boolean
  'no-pattern': {
    patterns: string[]
  }
}


export type Config = {
  overrides: [
    {
      files: string | string[]
      rules: {}
    }
  ]
}

export function defineConfig<T extends Config>(config: T): T {
  return config
}

async function run() {
  glob('**/*', { ignore: ['node_modules/**/*'] }, async (error, files) => {
    if (error) {
      console.error(error)
      return
    }
    console.log(files)
  })
}

run()
