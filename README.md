# misclint

## What's this

Lint some misc stuff:

- directory size
- file size
- directory name
- file name
- substring in file

I'm tired of checking & preventing shitty code & output at work. I think I need a tool to finish the chaos.

## Usage

### Installation

```sh
npm install misclint
```

### Create config file

Create a file with name `misclint.config.mjs` (or any other names, it doesn't matter).

Just make sure do not use `.js` suffix since it can only be run with es module.

```js
// @ts-check
import { executeConfig } from 'misclint'

executeConfig({
  overrides: [
    {
      // glob, array can also be used, for example 'src/**/*', ['src', 'dist']
      files: 'dist',
      rules: {
        maxDirectorySize: {
          size: 51200
        }
      }
    },
    // ... other { files, rules }
  ]
})
```

### Run lint

```
node mistlint.config.mjs
```

## Rules

### `maxFileSize`

Limit max file size.

```ts
type Options = {
  // bytes
  size: number
  // Whether to show size info even if there's no error
  // @default false
  showInfo?: boolean
}
```

### `maxDirectorySize`

Limit max directory size

```ts
type Options = {
  // bytes
  size: number
  // Whether to ingore folder size. In different file system, such as ext or
  // apfs, size of folders are different thus the result in different system
  // may be inaccurate
  // @default false
  ignoreFolderSize?: boolean
  // Whether to show size info even if there's no error
  // @default false
  showInfo?: boolean
}
```

### `noKebabCaseDirname`

Disallow kebab case directory name.

```ts
type Options = true
```

### `noKebabCaseFilename`

Disallow kebab case file name.

```ts
type Options = true
```

### `noPattern`

Disallow string patterns existing in files.

```ts
type Options = { patterns: string[] }
```

### `requiredPattern`

Force string patterns existing in files.

```ts
type Options = { patterns: string[] }
```
